# DugsiHub

DugsiHub is a production-oriented school operations workspace built with React, Vite, TypeScript, and Convex.

## Hosted Convex setup

The repository is configured for a hosted Convex deployment. It does not require or use the local Convex backend.

1. Install dependencies with `npm install`.
2. Authenticate with Convex using `npx convex login`.
3. Create or select the hosted project in the Convex dashboard.
4. Set the project deployment URL in a local environment file:

```bash
VITE_CONVEX_URL=https://your-project.convex.cloud
```

5. Deploy the schema and functions to the hosted deployment with `npm run convex:deploy`.
6. Start the app with `npm run dev`.

For CI, use a Convex deploy key instead of a local login:

```bash
CONVEX_DEPLOY_KEY=your-production-deploy-key npm run convex:deploy
```

The Convex backend includes school workspaces, members, students, attendance, payments, announcements, and audit logs. The frontend provider is enabled automatically whenever `VITE_CONVEX_URL` is present.

## Verification

```bash
npm run lint
npm run build
```
