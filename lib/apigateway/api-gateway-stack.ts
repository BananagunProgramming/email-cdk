import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class ApiGatewayStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const api = new apigateway.RestApi(this, 'email-service-gtw', {
            restApiName: 'email-service-api',
            description: 'api gateway to the email service'
        });

        const send = api.root.addResource('send');

        send.addMethod('POST');
    }
}