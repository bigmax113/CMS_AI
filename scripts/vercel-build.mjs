import { existsSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

const requiredForLocal = [
  'PAYLOAD_SECRET',
  'PAYLOAD_ADMIN_EMAIL',
  'PAYLOAD_ADMIN_PASSWORD',
  'PAYLOAD_DB_SCHEMA',
  'GOOGLE_DRIVE_FOLDER_ID',
  'GOOGLE_DRIVE_OAUTH_CLIENT_JSON_B64',
  'GOOGLE_DRIVE_OAUTH_TOKEN_JSON_B64',
]

const hasDatabaseEnv = () => Boolean(process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim())
const needsLocalEnv = () =>
  !hasDatabaseEnv() || requiredForLocal.some((name) => !process.env[name]?.trim())

const parseDotenvLine = (line) => {
  const trimmed = line.trim()

  if (!trimmed || trimmed.startsWith('#')) {
    return null
  }

  const equalsIndex = trimmed.indexOf('=')

  if (equalsIndex === -1) {
    return null
  }

  const name = trimmed.slice(0, equalsIndex).trim()
  let value = trimmed.slice(equalsIndex + 1).trim()

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1)
  }

  return [name, value.replaceAll('\\n', '\n')]
}

const loadLocalVercelEnv = () => {
  if (!needsLocalEnv()) {
    return
  }

  const localEnvPath = path.join(process.cwd(), '.vercel', '.env.production.local')

  if (!existsSync(localEnvPath)) {
    return
  }

  const content = readFileSync(localEnvPath, 'utf8')

  for (const line of content.split(/\r?\n/)) {
    const parsed = parseDotenvLine(line)

    if (!parsed) {
      continue
    }

    const [name, value] = parsed

    if (!process.env[name]) {
      process.env[name] = value
    }
  }

  console.log('[vercel-build] Loaded local Vercel production env file for build verification.')
}

const run = (command, args) => {
  const result = spawnSync(command, args, {
    env: process.env,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

loadLocalVercelEnv()

await import('./check-vercel-env.mjs')

run('pnpm', ['deploy:migrate'])
run('pnpm', ['build'])
