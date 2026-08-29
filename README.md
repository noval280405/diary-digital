# Nuxt Minimal Starter

## Environment

Copy `.env.example` to `.env` and fill every `NUXT_PUBLIC_FIREBASE_*` value from the Firebase project settings. Firebase web configuration is public by design; authorization is enforced by Security Rules.

## Firebase security

Before publishing, deploy both rule files with `firebase deploy --only firestore:rules,storage`.

- `firestore.rules` restricts diary documents to the authenticated UID.
- `storage.rules` restricts images to `upload/{uid}/...`, validates image MIME types, and limits files to 5 MB.
- Test the rules against the Firebase Emulator Suite before production deployment.

## Release checklist

- Configure an authorized production domain in Firebase Authentication.
- Replace the placeholder legal text with the operator identity and contact details.
- Test registration, login, password reset, journal CRUD, locks, image upload, trash restore, and JSON backup.
- Enable Firebase budget alerts and App Check.
- Run `npm run build` before deployment.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
