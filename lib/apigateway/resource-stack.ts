import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as IAM from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class ResourceStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        //sqs queue
        const queue = new sqs.Queue(this, 'EmailInbound', {
            queueName: 'email-sqs',
            encryption: sqs.QueueEncryption.SQS_MANAGED,  
        });

        // role granting apigateway permission to send message to sqs
        const integrationRole = new IAM.Role(this, 'integration-role', {
            assumedBy: new IAM.ServicePrincipal('apigateway.amazonaws.com'),
        });
        queue.grantSendMessages(integrationRole);

        // Api Gateway Direct Integration
        const apiToQueueIntegration = new apigateway.AwsIntegration({
            service: 'sqs',//todo accountid should not be hard coded
            path: "460032395895" + '/' + queue.queueName,
            integrationHttpMethod: 'POST',
            options: {
                credentialsRole: integrationRole,
                requestParameters: {
                    'integration.request.header.Content-Type': "'application/x-www-form-urlencoded'",
                },
                requestTemplates: {
                    'application/json': 'Action=SendMessage&MessageBody=$input.body',
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

        //create lambda
        const createLambda = new lambda.Function(this, 'create-lambda', {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('./lib/lambda'),
            functionName:'process-inbound-sqs'
        });

        const eventSource = new SqsEventSource(queue);
        createLambda.addEventSource(eventSource);

        // cdk.CfnParameter
        // new cdk.CfnOutput(this, 'sqsArn', {
        //     value: queue.queueArn,
        //     description: 'The ARN of the sqs queue',
        //     exportName: 'queueArn',
        //   });
    }
}