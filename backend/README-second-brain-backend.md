# 🧠 Second Brain App – Backend Deployment Guide

This README outlines all the steps taken to set up the backend for the Second Brain app using AWS CDK, Lambda, API Gateway, DynamoDB, and Cognito. It also serves as a learning reference.

---

##  Goal

Deploy a real cloud backend for a personal knowledge base app using **Infrastructure as Code** with AWS CDK (TypeScript).

---

## 📁 Project Structure

```
backend/
├── bin/                    # CDK entry point
│   └── backend.ts
├── lib/                    # Infrastructure definition
│   └── backend-stack.ts
├── lambdas/                # Lambda function code
│   └── notes.ts
├── cdk.json                # CDK app config
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── node_modules/           # Installed libs (ignored by Git)
├── cdk.out/                # Synthesized CloudFormation (autogen)
```

---

## 🔧 Setup Steps

### 1. Initialize CDK App
```bash
cdk init app --language=typescript
```

### 2. Install AWS CDK Dependencies
```bash
npm install @aws-cdk/aws-lambda @aws-cdk/aws-apigateway @aws-cdk/aws-dynamodb @aws-cdk/aws-cognito
```

### 3. Create Infrastructure Stack in `lib/backend-stack.ts`
- DynamoDB table for storing notes
- Lambda function for API logic
- API Gateway for `/notes` routes
- Cognito for user auth

### 4. Create Lambda Handler in `lambdas/notes.ts`
Basic `handler()` to return a test response.

### 5. Set Entry Point in `bin/backend.ts`
Connects CDK app to the infrastructure stack.

### 6. Configure `cdk.json`
```json
{
  "app": "npx ts-node bin/backend.ts"
}
```

### 7. Set up AWS CLI
```bash
aws configure
```
Enter Access Key, Secret, Region (e.g. `eu-west-1`), Output Format (`json`)

### 8. Bootstrap CDK (one-time per account/region)
```bash
cdk bootstrap
```

### 9. Deploy Your Stack
```bash
cdk synth
cdk deploy
```

### 10. View Resources in AWS Console
- **CloudFormation** – stack overview
- **Lambda** – your function code/logs
- **API Gateway** – your REST endpoint
- **DynamoDB** – your note storage
- **Cognito** – authentication
- **CloudWatch** – logs

---

## 🚀 What's Live Now

| Service     | Description                         |
|-------------|-------------------------------------|
| DynamoDB    | NoSQL DB for user notes             |
| Lambda      | Backend logic for the API           |
| API Gateway | Public REST API (`/notes`)          |
| Cognito     | User authentication (not wired yet) |
| CloudWatch  | Logs and error tracking             |

---

## 🔄 Next Steps

- Implement `POST /notes` and `GET /notes` logic in `notes.ts`
- Integrate Cognito for token-based auth
- Connect SvelteKit frontend to this backend
- Expand with features like daily flashbacks and AI suggestions



_Last updated: 2025-05-28_
