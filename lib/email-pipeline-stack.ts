import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { ApiGatewayStage } from './api-gateway-stage';
import { SendMailStage } from './send-mail-stage';

export class EmailPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //parameters
    // const environment = new cdk.CfnParameter(this, 'environment', {
    //   type: 'String',
    //   description: 'The environment being deployed to',
    //   allowedValues: ['test','live']
    // })

    var accountId = '460032395895';
    var region = 'us-east-1';
    
    const pipeline = new CodePipeline(this, 'EmailCdkPipeline', {
      pipelineName: 'EmailPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('BananagunProgramming/email-cdk', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    pipeline.addStage(new ApiGatewayStage(this, 'GatewaySqs', {
      env: {//todo does this accountId need to be hard coded here? It's in the email-cdk.ts
        account: accountId,
        region: region
      }
    }));

    pipeline.addStage(new SendMailStage(this, 'LambdaSes', {
      env: {//todo does this accountId need to be hard coded here? It's in the email-cdk.ts
        account: accountId,
        region: region
      }
    }));

    // stage was returned by pipeline.addStage
    /*liveStage.addPost(new ShellStep("validate", {
      commands: ['curl -Ssf https://my.webservice.com/'],
    }));*/
  }
}
