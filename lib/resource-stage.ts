import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ResourceStack} from './apigateway/resource-stack';

export class ResourceStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        const apigtwStack = new ResourceStack(this, 'ApiGatewayStack');
    }
}