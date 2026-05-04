/**
 * create-admin.ts â€” CLI to create the first admin user
 * Usage: npm run create-admin
 *   or with args: USERNAME=rivaldi EMAIL=admin@example.com PASSWORD=secret123 npm run create-admin
 */
import 'dotenv/config'
import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '../lib/db'
import { adminUsers } from '../db/schema'
import * as readline from 'readline'

async function prompt(question: string, hidden = false): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: hidden ? undefined : process.stdout })
  if (hidden) {
    process.stdout.write(question)
  }
  return new Promise(resolve => {
    if (hidden) {
      const chars: string[] = []
      process.stdin.setRawMode(true)
      process.stdin.resume()
      process.stdin.on('data', (d) => {
        const char = d.toString()
        if (char === '\r' || char === '\n') {
          process.stdin.setRawMode(false)
          process.stdin.pause()
          process.stdout.write('\n')
          rl.close()
          resolve(chars.join(''))
        } else if (char === '\u0003') {
          process.exit()
        } else if (char === '\u007f') {
          chars.pop()
        } else {
          chars.push(char)
          process.stdout.write('*')
        }
      })
    } else {
      rl.question(question, (answer) => {
        rl.close()
        resolve(answer)
      })
    }
  })
}

async function main() {
  console.log('\nðŸš€ Antigravity Portfolio â€” Create Admin\n')

  const username = process.env.USERNAME || await prompt('Username     : ')
  const email    = process.env.EMAIL    || await prompt('Email        : ')
  const password = process.env.PASSWORD || await prompt('Password     : ', true)

  if (!username || !email || !password) {
    console.error('âŒ Username, email, dan password wajib diisi.')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('âŒ Password minimal 8 karakter.')
    process.exit(1)
  }

  // Check existing
  const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.username, username))
  if (existing) {
    console.error(`âŒ Admin dengan username "${username}" sudah ada.`)
    process.exit(1)
  }

  const passwordHash = await hash(password, 12)
  const [admin] = await db.insert(adminUsers).values({ username, email, passwordHash }).returning()

  console.log('\nâœ… Admin berhasil dibuat!')
  console.log(`   ID       : ${admin.id}`)
  console.log(`   Username : ${admin.username}`)
  console.log(`   Email    : ${admin.email}`)
  console.log(`   Created  : ${admin.createdAt?.toISOString()}\n`)
  process.exit(0)
}

main().catch(err => {
  console.error('âŒ Error:', err.message)
  process.exit(1)
})
