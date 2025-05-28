import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
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
    });

    // Lambda function
    const notesFunction = new lambda.Function(this, 'NotesFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'notes.handler',
      code: lambda.Code.fromAsset('lambdas'),
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
  }
}
