# Build Notes

- The project pins the package manager via `"packageManager": "pnpm@10.0.0"` in `package.json` so local installs match CI.
- Vercel detects the lockfile v9 format and selects pnpm 10 automatically; enable the same version locally with Corepack for consistent behavior.
- When switching Prisma to Postgres for production, update the `DATABASE_URL` accordingly and run `prisma migrate deploy` to apply migrations.
