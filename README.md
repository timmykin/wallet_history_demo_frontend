# Coinbase Wallet History Demo Frontend

## Installation

```bash
pnpm i
```

- Fill in the environment variables in the `.env` file, refer to the `.env.example` file for the required variables.

---

## Development Usage

Start the App

```bash
pnpm run dev
```

---

## Production Build

Build the project:

```bash
pnpm run build
```

## Deploying to Vercel

1. Install Vercel client: `npm i -g vercel`
2. Login on your terminal by running the command: `vercel login` and use the browser to login.
3. Then, on the project folder, run `vercel --prod` to deploy it and it will be deployed after a few seconds. You'll be asked for a few configs the first time, you can use the default ones.
