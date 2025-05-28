# 📦 Lambda Build Fix – Notes

This short README explains how the `Runtime.ImportModuleError` was fixed when deploying the Lambda for the `/notes` endpoint in the Second Brain backend.

---

## ❌ The Problem

AWS Lambda returned this error:
```
Runtime.ImportModuleError: Cannot find module 'notes'
```

This happened because:

- The Lambda was configured with `handler: 'notes.handler'`
- But AWS expected a **compiled JavaScript file** named `notes.js` in the deployed zip
- The file `notes.ts` was TypeScript, and **was not being compiled or bundled automatically**

---

## ✅ The Fix

We replaced the CDK config from:

```ts
new lambda.Function(...)
```

To:

```ts
new lambdaNode.NodejsFunction(...)
```

### What this did:
- Automatically transpiled `notes.ts` → `index.js`
- Bundled it using **esbuild**
- Created a deployable JS Lambda with a correct `index.handler` entrypoint

---

## 📄 Why `index.js` Exists

After the fix, AWS Lambda runs the bundled output file:
```
index.js
```

Which is auto-generated from your `notes.ts` by `NodejsFunction`.

It now contains:
- The compiled handler logic
- A CommonJS export: `exports.handler = ...`
- Any future dependencies you import

---

## 🧠 Key Lesson

- **Don't use raw TypeScript with `lambda.Function`**
- Use `NodejsFunction` + `esbuild` to make Lambdas work with TypeScript smoothly
- This avoids errors like `Cannot find module 'yourfile'`

---

_Last updated: 2025-05-28_
