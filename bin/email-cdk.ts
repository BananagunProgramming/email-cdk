#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EmailPipelineStack } from '../lib/email-pipeline-stack';

const app = new cdk.App();
new EmailPipelineStack(app, 'EmailPipelineStack', {
  env: {
    account: '460032395895',
    region: 'us-east-1'    
  }
});

app.synth();