import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiGatewayStack} from './apigateway/api-gateway-stack';

export class EmailPipelineStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        const apigtwStack = new ApiGatewayStack(this, 'ApiGatewayStack');
    }
}