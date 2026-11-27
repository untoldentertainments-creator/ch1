import { NextRequest, NextResponse } from 'next/server'
import { getPhonePeConfig, initiatePhonePePayment } from '@/lib/phonepe'
import { getPassOption } from '@/lib/passes'
import { savePendingOrder } from '@/lib/storage'
import { CreateOrderRequest, CreateOrderResponse } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderRequest = await req.json()
    const { name, email, phone, quantity, passType } = body

    if (!name || !email || !phone || !quantity || quantity < 1) {
      return NextResponse.json<CreateOrderResponse>(
        { success: false, error: 'Please provide all required fields (Name, Email, Phone, and Quantity >= 1).' },
        { status: 400 }
      )
    }

    const selectedPass = getPassOption(passType)
    const totalAmount = quantity * selectedPass.price
    const amountInPaise = totalAmount * 100
    const merchantTransactionId = `LT_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    const merchantUserId = `MUID_${phone.replace(/\D/g, '').slice(-10) || Date.now()}`

    const phonePeConfig = getPhonePeConfig()

    // If PhonePe credentials are set
    if (phonePeConfig) {
      const origin = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin || 'http://localhost:3000'
      const redirectUrl = `${origin}/api/phonepe/callback?tx=${merchantTransactionId}`
      const callbackUrl = `${origin}/api/phonepe/callback?tx=${merchantTransactionId}`

      // Pre-save pending order details so callback can match transaction
      savePendingOrder({
        transactionId: merchantTransactionId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        quantity: Number(quantity),
        passType: selectedPass.id,
        amount: totalAmount,
        createdAt: new Date().toISOString(),
      })

      const response = await initiatePhonePePayment({
        merchantTransactionId,
        merchantUserId,
        amountInPaise,
        phone,
        redirectUrl,
        callbackUrl,
      })

      if (response && response.success && response.data?.instrumentResponse?.redirectInfo?.url) {
        return NextResponse.json<CreateOrderResponse>({
          success: true,
          orderId: merchantTransactionId,
          amount: totalAmount,
          currency: 'INR',
          redirectUrl: response.data.instrumentResponse.redirectInfo.url,
          testMode: false,
        })
      }

      console.error('[PhonePe Init Failed]', response)
      return NextResponse.json<CreateOrderResponse>(
        { success: false, error: response?.message || 'PhonePe payment gateway initialization failed.' },
        { status: 502 }
      )
    }

    // Fallback Sandbox Test Mode if PhonePe credentials are not in .env yet
    savePendingOrder({
      transactionId: merchantTransactionId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      quantity: Number(quantity),
      passType: selectedPass.id,
      amount: totalAmount,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json<CreateOrderResponse>({
      success: true,
      orderId: merchantTransactionId,
      amount: totalAmount,
      currency: 'INR',
      testMode: true,
    })
  } catch (err: any) {
    console.error('[API create-order error]', err)
    return NextResponse.json<CreateOrderResponse>(
      { success: false, error: err.message || 'Failed to initialize payment order.' },
      { status: 500 }
    )
  }
}
