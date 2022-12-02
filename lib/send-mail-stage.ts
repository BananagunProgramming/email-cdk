import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SendMailStack} from './SendMail/send-mail-stack';

export class SendMailStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        const sendmailStage = new SendMailStack(this, 'SendMailStack');
    }
}