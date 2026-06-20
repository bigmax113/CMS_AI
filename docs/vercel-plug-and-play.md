# CMS AI Vercel Plug-and-Play Profile

This branch contains the same CMS/front/admin code as the Render build, with a Vercel deployment profile added on top.

## Target stack

- Vercel Hobby for the Next.js/Payload application.
- Neon or Supabase Postgres for the database.
- Google Drive-backed cloud media storage, matching the current Render media profile.
- Configurable AI provider variables. The current prototype keeps the xAI-compatible env names, but models are env-driven.

## What is ready in this branch

- `vercel.json` with Vercel install and build commands.
- `.env.vercel.example` with the full required environment variable set.
- `pnpm vercel:build` that validates env, applies the lightweight deploy migration, then builds Next.js.
- `pnpm vercel:check` for a quick env preflight.

## Deployment checklist

1. Create a new Vercel project from this GitHub branch.
2. Create a production Postgres database in Neon or Supabase.
3. Copy `.env.vercel.example` variable names into Vercel Project Settings.
4. Set `DATABASE_URL` and `POSTGRES_URL` to the external Postgres connection string with `sslmode=require`.
5. Set the Google Drive media variables to the same cloud folder/token profile used by the Render prototype.
6. Set `NEXT_PUBLIC_SERVER_URL` and `PAYLOAD_PUBLIC_SERVER_URL` to the Vercel production URL.
7. Deploy.
8. Keep `PAYLOAD_RUN_MIGRATIONS=true` for runtime config compatibility with the existing Payload profile. The Vercel build path uses the lightweight idempotent deploy migration, because the full Payload CLI migration runner is not reliable inside the current serverless build graph.

## Data duplication note

This deployment profile is code-complete. A true Render clone also needs a database copy from the current production database into Neon/Supabase. Media files are already cloud-backed, so they do not need local Render disk storage. The database import is the only part that depends on having source and target database credentials.
