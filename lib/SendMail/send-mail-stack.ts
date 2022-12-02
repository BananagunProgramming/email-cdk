import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';

export class SendMailStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new Function(this, 'read-email-queue', {
            runtime: Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: new InlineCode('exports.handler = _ => "Hello, CDK";')
        });
    }
}
