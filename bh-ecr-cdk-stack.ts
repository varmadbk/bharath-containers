import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BhEcrCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create ECR
    const bhrepo = new ecr.Repository(this, 'bh-repo',{
      repositoryName: 'bhrepo-v1',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      imageTagMutability: ecr.TagMutability.IMMUTABLE,
      imageScanOnPush: true
    });
  }
}
