import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as eks from 'aws-cdk-lib/aws-eks'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BhEksCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromVpcAttributes(this, 'bhvpc',{
      vpcId: 'vpc-0613e72a46c8cb335',
      availabilityZones: ['us-east-1a', 'us-east-1b','us-east-1c'],
      publicSubnetIds:['subnet-0ffbfed9bbfa3b0ee','subnet-09d3a6a43989df57c','subnet-0c9c5ffeeb6764a07']
    });
    // create iam role
    const iabhrole = new iam.Role(this, 'bheksadmin',{
      assumedBy: new iam.AccountRootPrincipal()
    });
    // create eks cluster
    const cluster = new eks.Cluster(this,'bh-eks-cdk',{
      vpc,
      version: eks.KubernetesVersion.V1_29,
      clusterName: 'bh-edk-cdkcluster',
      mastersRole: iabhrole,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      defaultCapacity: 1,
      vpcSubnets: [{subnetType: ec2.SubnetType.PUBLIC}],
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(this, 'bhdefaultsec','sg-05c14cfab5ff1fd6c')
    });
  }
}
