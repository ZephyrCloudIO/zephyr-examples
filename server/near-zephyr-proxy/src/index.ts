import { Hono } from 'hono'
import { Near, verifyNep413Signature } from 'near-kit'

const ZE_SERVER_TOKEN = process.env.ZE_SERVER_TOKEN
const NETWORK = (process.env.NEAR_NETWORK ?? 'testnet') as 'testnet' | 'mainnet'
const CONTRACT_ID = process.env.DEPLOY_REGISTRY_CONTRACT
const PORT = Number(process.env.PORT ?? 3000)

if (!ZE_SERVER_TOKEN || !CONTRACT_ID) {
  console.error('missing env: ZE_SERVER_TOKEN, DEPLOY_REGISTRY_CONTRACT required')
  process.exit(1)
}

const near = new Near({ network: NETWORK })

const app = new Hono()

app.post('/api/authorize-deploy', async (c) => {
  let body: Record<string, unknown>
  try {
    body = await c.req.json()
  } catch {
    return c.json({ ok: false, error: 'invalid JSON body' }, 400)
  }

  const {
    signedMessage,
    message,
    recipient,
    nonce: nonceHex,
  } = body as {
    signedMessage?: { accountId: string; publicKey: string; signature: string }
    message?: string
    recipient?: string
    nonce?: string
  }

  if (!signedMessage || !message || !recipient || !nonceHex) {
    return c.json(
      { ok: false, error: 'missing fields: signedMessage, message, recipient, nonce' },
      400,
    )
  }

  const nonce = Buffer.from(nonceHex, 'hex')

  try {
    await verifyNep413Signature(
      signedMessage,
      { message, recipient, nonce },
      { near },
    )
  } catch {
    return c.json({ ok: false, error: 'invalid NEAR signature' }, 401)
  }

  const accountId = signedMessage.accountId

  let authorized: boolean
  try {
    authorized =
      (await near.view<boolean>(CONTRACT_ID, 'is_authorized', {
        account: accountId,
      })) ?? false
  } catch {
    return c.json({ ok: false, error: 'contract not reachable' }, 502)
  }

  if (!authorized) {
    return c.json(
      { ok: false, error: `account ${accountId} is not authorized to deploy` },
      403,
    )
  }

  console.log(`[auth] deploy authorized for ${accountId}`)
  return c.json({
    ok: true,
    zephyrToken: ZE_SERVER_TOKEN,
    accountId,
  })
})

console.log(`[near-zephyr-proxy] starting on port ${PORT}`)
export default { fetch: app.fetch, port: PORT }
