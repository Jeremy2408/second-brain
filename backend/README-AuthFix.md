# AWS Cognito + Lambda Debug Fixes (Auth + CORS)

This document outlines the two critical steps taken to resolve common AWS Cognito and Lambda integration issues when using Amplify and API Gateway with a SvelteKit frontend.

---

## ✅ Step 1: Fixing `USER_SRP_AUTH is not enabled for the client`

### 🔍 Problem:
Amplify sign-in failed with the error:
```
USER_SRP_AUTH is not enabled for the client
```
This happens when your Cognito App Client is missing the correct auth flows.

### 🛠 Solution:
Navigate to **Cognito → User Pools → Your Pool → App clients → Edit your App Client**.

Then enable the following authentication flows:

- ✅ `ALLOW_USER_PASSWORD_AUTH`
- ✅ `ALLOW_USER_SRP_AUTH` *(optional — included for flexibility)*

These enable Amplify to perform password-based login using email + password.

---

## ✅ Step 2: Enabling CORS in Lambda Handler (`notes.ts`)

### 🔍 Problem:
Calling the Lambda endpoint from the frontend triggered CORS errors or failed preflight (OPTIONS) requests.

### 🛠 Solution:
In your Lambda handler (`notes.ts`), add CORS support for both OPTIONS and actual requests:

```ts
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (event.requestContext.http.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      body: ''
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    },
    body: JSON.stringify({
      message: 'Success from /notes!'
    })
  };
};
```

### ✅ Result:
- Lambda now handles preflight OPTIONS correctly.
- Frontend can send `Authorization` headers without being blocked.
- All fetch calls from SvelteKit now work securely and reliably.

---

## ✅ Status: Working

- Signup and email verification flows are functional
- Login returns ID token (JWT)
- Authenticated requests from frontend hit the Lambda successfully
- Lambda responds with CORS-compliant headers

