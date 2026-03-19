import fs from 'node:fs'
import path from 'node:path'

jest.setTimeout(30000)

const envPath = path.join(__dirname, 'test-env.json')
if (fs.existsSync(envPath)) {
    const env = JSON.parse(fs.readFileSync(envPath, 'utf8')) as Record<string, string>
    for (const [key, value] of Object.entries(env)) {
        process.env[key] = value
    }
}
