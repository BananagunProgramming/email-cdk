import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { EmailPipelineStage } from './email-pipeline-stage';

export class EmailCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'EmailCdkPipeline', {
      pipelineName: 'EmailPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('bananagun/email-cdk','main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    const testingStage = pipeline.addStage(new EmailPipelineStage(this, 'testing', {
      env: {
        account: '460032395895',
        region: 'us-east-1'    
      }
    }));

    testingStage.addPost(new ManualApprovalStep('Please approve release'));
  
  }
}
