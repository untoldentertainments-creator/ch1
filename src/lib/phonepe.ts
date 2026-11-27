import crypto from 'crypto'

export const TICKET_PRICE = 549 // in INR

export interface PhonePeConfig {
  merchantId: string
  saltKey: string
  saltIndex: string
  env: 'UAT' | 'PROD'
}

export function getPhonePeConfig(): PhonePeConfig | null {
  const merchantId = process.env.PHONEPE_MERCHANT_ID
  const saltKey = process.env.PHONEPE_SALT_KEY
  const saltIndex = process.env.PHONEPE_SALT_INDEX || '1'
  const env = (process.env.PHONEPE_ENV || 'UAT').toUpperCase() === 'PROD' ? 'PROD' : 'UAT'

  if (!merchantId || !saltKey) {
    return null
  }

  return {
    merchantId,
    saltKey,
    saltIndex,
    env,
  }
}

export function getPhonePeHost(env: 'UAT' | 'PROD'): string {
  return env === 'PROD'
    ? 'https://api.phonepe.com/apis/hermes'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox'
}

export function generatePassId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  const segment = (len: number) => {
    let s = ''
    for (let i = 0; i < len; i++) {
      s += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return s
  }
  return `LT-${segment(4)}-${segment(4)}`
}

/**
 * Initiates PhonePe Standard PG Checkout
 */
export async function initiatePhonePePayment(params: {
  merchantTransactionId: string
  merchantUserId: string
  amountInPaise: number
  phone: string
  redirectUrl: string
  callbackUrl: string
}) {
  const config = getPhonePeConfig()
  if (!config) {
    throw new Error('PhonePe credentials are not configured.')
  }

  const payload = {
    merchantId: config.merchantId,
    merchantTransactionId: params.merchantTransactionId,
    merchantUserId: params.merchantUserId,
    amount: params.amountInPaise,
    redirectUrl: params.redirectUrl,
    redirectMode: 'POST',
    callbackUrl: params.callbackUrl,
    mobileNumber: params.phone.replace(/\D/g, '').slice(-10),
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  }

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')
  const endpoint = '/pg/v1/pay'
  const stringToHash = base64Payload + endpoint + config.saltKey
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex')
  const xVerify = `${sha256}###${config.saltIndex}`

  const host = getPhonePeHost(config.env)
  const response = await fetch(`${host}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
    },
    body: JSON.stringify({
      request: base64Payload,
    }),
  })

  const data = await response.json()
  return data
}

/**
 * Checks transaction status with PhonePe Server
 */
export async function checkPhonePeStatus(merchantTransactionId: string) {
  const config = getPhonePeConfig()
  if (!config) {
    throw new Error('PhonePe credentials are not configured.')
  }

  const endpoint = `/pg/v1/status/${config.merchantId}/${merchantTransactionId}`
  const stringToHash = endpoint + config.saltKey
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex')
  const xVerify = `${sha256}###${config.saltIndex}`

  const host = getPhonePeHost(config.env)
  const response = await fetch(`${host}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      'X-MERCHANT-ID': config.merchantId,
    },
  })

  const data = await response.json()
  return data
}

/**
 * Validates callback signature from PhonePe
 */
export function verifyPhonePeCallback(base64Response: string, xVerifyHeader: string): boolean {
  const config = getPhonePeConfig()
  if (!config || !xVerifyHeader) return false

  const stringToHash = base64Response + config.saltKey
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex')
  const expectedChecksum = `${sha256}###${config.saltIndex}`

  return expectedChecksum === xVerifyHeader
}
