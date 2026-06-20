const required = [
  'PAYLOAD_SECRET',
  'PAYLOAD_ADMIN_EMAIL',
  'PAYLOAD_ADMIN_PASSWORD',
  'PAYLOAD_DB_SCHEMA',
  'GOOGLE_DRIVE_FOLDER_ID',
  'GOOGLE_DRIVE_OAUTH_CLIENT_JSON_B64',
  'GOOGLE_DRIVE_OAUTH_TOKEN_JSON_B64',
  'XAI_API_KEY',
]

const missing = required.filter((name) => !process.env[name]?.trim())

if (!process.env.DATABASE_URL?.trim() && !process.env.POSTGRES_URL?.trim()) {
  missing.push('DATABASE_URL or POSTGRES_URL')
}

if (process.env.GOOGLE_DRIVE_STORAGE_ENABLED !== 'true') {
  missing.push('GOOGLE_DRIVE_STORAGE_ENABLED=true')
}

if (process.env.PAYLOAD_RUN_MIGRATIONS !== 'true') {
  missing.push('PAYLOAD_RUN_MIGRATIONS=true')
}

if (missing.length > 0) {
  console.error('[vercel-env] Missing required production env:')
  for (const name of missing) {
    console.error(`- ${name}`)
  }
  console.error('[vercel-env] See .env.vercel.example for the plug-and-play variable set.')
  process.exit(1)
}

const dbURL = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
if (!dbURL.includes('sslmode=require') && process.env.PGSSLMODE !== 'require') {
  console.warn(
    '[vercel-env] DATABASE_URL does not include sslmode=require and PGSSLMODE is not require. Neon/Supabase usually need SSL.',
  )
}

if (!process.env.NEXT_PUBLIC_SERVER_URL || !process.env.PAYLOAD_PUBLIC_SERVER_URL) {
  console.warn(
    '[vercel-env] NEXT_PUBLIC_SERVER_URL/PAYLOAD_PUBLIC_SERVER_URL are not set. Public links will fall back to request headers.',
  )
}

console.log('[vercel-env] OK')
