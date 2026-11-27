import { NextRequest, NextResponse } from 'next/server'
import { checkPhonePeStatus, generatePassId } from '@/lib/phonepe'
import { getPendingOrder, removePendingOrder, saveBooking } from '@/lib/storage'
import { sendDualBookingEmails } from '@/lib/email'
import { BookingRecord } from '@/lib/types'

export async function POST(req: NextRequest) {
  return handlePhonePeCallback(req)
}

export async function GET(req: NextRequest) {
  return handlePhonePeCallback(req)
}

async function handlePhonePeCallback(req: NextRequest) {
  try {
    const url = new URL(req.url)
    let merchantTransactionId = url.searchParams.get('tx')

    // If POST, body might contain base64 response or form data
    if (req.method === 'POST') {
      try {
        const formData = await req.formData()
        const responseData = formData.get('response')?.toString()
        if (responseData) {
          const decoded = JSON.parse(Buffer.from(responseData, 'base64').toString('utf-8'))
          if (decoded.data?.merchantTransactionId) {
            merchantTransactionId = decoded.data.merchantTransactionId
          }
        }
      } catch {
        // Fallback to JSON or query param
      }
    }

    if (!merchantTransactionId) {
      return NextResponse.redirect(new URL('/?error=missing_transaction', req.url))
    }

    // Check payment status with PhonePe server
    const statusRes = await checkPhonePeStatus(merchantTransactionId)

    const isSuccess =
      statusRes &&
      statusRes.success &&
      (statusRes.code === 'PAYMENT_SUCCESS' || statusRes.data?.responseCode === 'SUCCESS')

    const pendingOrder = getPendingOrder(merchantTransactionId)

    if (isSuccess && pendingOrder) {
      const passId = generatePassId()

      const booking: BookingRecord = {
        passId,
        passType: pendingOrder.passType || 'OTAKU',
        orderId: merchantTransactionId,
        paymentId: statusRes.data?.transactionId || `phonepe_${Date.now()}`,
        name: pendingOrder.name,
        email: pendingOrder.email,
        phone: pendingOrder.phone,
        quantity: pendingOrder.quantity,
        amount: pendingOrder.amount,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        eventDate: 'Sunday, Dec 06, 5:30 PM – 10:30 PM',
        venue: 'Pawffe, 2-91 Beach Rd, Sagar Nagar, Endada, Vizag 530045',
      }

      // Save to attendee list & Google Sheets
      await saveBooking(booking)

      // Send dual emails
      await sendDualBookingEmails(booking)

      // Remove from pending
      removePendingOrder(merchantTransactionId)

      // Redirect user to their confirmed ticket page
      const redirectUrl = new URL(`/ticket/${passId}`, req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Payment failed or cancelled
    removePendingOrder(merchantTransactionId)
    const failUrl = new URL(`/?payment_failed=true&reason=${encodeURIComponent(statusRes?.message || 'Payment cancelled')}`, req.url)
    return NextResponse.redirect(failUrl)
  } catch (err: any) {
    console.error('[PhonePe Callback Error]', err)
    return NextResponse.redirect(new URL('/?error=callback_error', req.url))
  }
}
