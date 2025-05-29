import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
    const notesTable = new dynamodb.Table(this, 'NotesTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // for dev only
    });

    // Cognito User Pool
    const userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClientV2', {
      userPool,
      authFlows: {
        userPassword: true, // Enables username+password login
      },
    });



    // Lambda function
    const notesFunction = new lambdaNode.NodejsFunction(this, 'NotesFunction', {
      entry: 'lambdas/notes.ts',          
      handler: 'handler',                
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        NOTES_TABLE_NAME: notesTable.tableName,
      },
    });


    // Permissions
    notesTable.grantReadWriteData(notesFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'NotesAPI', {
      restApiName: 'SecondBrain API',
    });

    const notes = api.root.addResource('notes');
    notes.addMethod('GET', new apigateway.LambdaIntegration(notesFunction));
    notes.addMethod('POST', new apigateway.LambdaIntegration(notesFunction));

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

  }
}
