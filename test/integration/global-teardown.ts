import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const statePath = path.join(__dirname, 'containers-state.json')
const envPath = path.join(__dirname, 'test-env.json')

module.exports = async () => {
    if (fs.existsSync(statePath)) {
        const { postgresId, redisId } = JSON.parse(fs.readFileSync(statePath, 'utf8')) as {
            postgresId: string
            redisId: string
        }

        const ids = [postgresId, redisId].filter(Boolean).join(' ')
        if (ids) {
            execSync(`docker rm -f ${ids}`, { stdio: 'ignore' })
        }
    }

    if (fs.existsSync(statePath)) fs.unlinkSync(statePath)
    if (fs.existsSync(envPath)) fs.unlinkSync(envPath)
}
