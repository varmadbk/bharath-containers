import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { cpus } from 'os';


//import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BhEcsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = ec2.Vpc.fromLookup(this,'bhExistVPC',{
    vpcId: 'vpc-0613e72a46c8cb335'
    });
    const cluster = new ecs.Cluster(this,'bh-ecs-cluster',{
      clusterName: 'bh-ecs-bmclust',
      vpc: vpc,
      enableFargateCapacityProviders: true
    });
    cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
      instanceType: new ec2.InstanceType("t2.micro"),
      desiredCapacity: 0,
      minCapacity: 0,
      maxCapacity: 2
    });
    
    const fargatetaskdef = new ecs.FargateTaskDefinition(this,'bh-taskdef',{
      memoryLimitMiB: 512,
      cpu: 256
    } );
    //create security group
    const bhsecgroup = new ec2.SecurityGroup(this,'bhfirewgrp',{
      vpc: vpc,
      description: 'allow inbound connectivity',
    });
    bhsecgroup.addIngressRule(ec2.Peer.anyIpv4(),ec2.Port.tcp(80))
    const containter= fargatetaskdef.addContainer('bh-c2',{
      image: ecs.ContainerImage.fromRegistry('docker.io/varmadbk/bh-customer:appv2'),
      memoryLimitMiB: 512,
      portMappings: [{containerPort: 80}],
      environment: { myapp: "dev"}      
    });
    //create Load balancer
    const bhlbnew = new elbv2.ApplicationLoadBalancer(this,'bhulbcdk',{
      vpc: vpc,
      internetFacing: true
    });
    const bhListner = bhlbnew.addListener('bhListners',{
      port: 80,
      open: true
    });
    const service = new ecs.FargateService(this, 'bh-ecsCdk',{
    cluster,
    taskDefinition: fargatetaskdef,
    serviceName: 'bh-svc-cdk',
    desiredCount: 1,
    assignPublicIp: true,
    securityGroups: [bhsecgroup],

    });
    bhListner.addTargets('bhvms',{
      port: 80,
      targets: [service.loadBalancerTarget({
        containerName: 'bh-c2',
        containerPort: 80
      })],
      healthCheck: {
        interval: cdk.Duration.seconds(30),
        path: "/",
        timeout: cdk.Duration.seconds(5)
      }
    });
  }
}
