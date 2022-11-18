import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as IAM from 'aws-cdk-lib/aws-iam';
import * as ApiGW from 'aws-cdk-lib/aws-apigateway';

export class ApiGatewayStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // role granting apigateway permission to send message to sqs
        const integrationRole = new IAM.Role(this, 'integration-role', {
            assumedBy: new IAM.ServicePrincipal('apigateway.amazonaws.com'),
        });
        //create queue
        const queue = new sqs.Queue(this, 'EmailInbound', {
            queueName: 'EmailSqs',
            encryption: sqs.QueueEncryption.SQS_MANAGED
        });
        //grant send message to api
        queue.grantSendMessages(integrationRole);

        // Api Gateway Direct Integration
        const apiToQueueIntegration = new ApiGW.AwsIntegration({
            service: 'sqs',
            path: '${process.env.CDK_DEFAULT_ACCOUNT}/${queue.queueName}',
            integrationHttpMethod: 'POST',
            options: {
                credentialsRole: integrationRole,
                requestParameters: {
                    'integration.request.header.Content-Type': "'application/x-www-form-urlencoded'",
                },
                requestTemplates: {
                    'method.response.header.Content-Type': 'integration.response.header.Content-Type',
                },
                integrationResponses: [
                    {
                        statusCode: '202',
                    },
                    {
                        statusCode: '400',
                    },
                    {
                        statusCode: '500',
                    }
                ]
            },
        });

        const api = new apigateway.RestApi(this, 'email-service-gtw', {
            restApiName: 'email-service-api',
            description: 'api gateway to the email service'
        });

        api.root.addMethod('POST', apiToQueueIntegration, {
            methodResponses: [
                {
                    statusCode: '202',
                },
                {
                    statusCode: '400',
                },
                {
                    statusCode: '500',
                }
            ]
        });
    }
}