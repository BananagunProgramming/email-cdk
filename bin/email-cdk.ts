#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EmailCdkStack } from '../lib/email-cdk-stack';

const app = new cdk.App();
new EmailCdkStack(app, 'EmailCdkStack', {
  env: {
    account: '460032395895',
    region: 'us-east-1'    
  }
});

app.synth();