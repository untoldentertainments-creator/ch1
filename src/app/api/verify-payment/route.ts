import { NextRequest, NextResponse } from 'next/server'
import { checkPhonePeStatus, generatePassId, getPhonePeConfig } from '@/lib/phonepe'
import { calculateDiscountedTotal, getPassOption, validatePromoCode } from '@/lib/passes'
import { removePendingOrder, saveBooking } from '@/lib/storage'
import { sendDualBookingEmails } from '@/lib/email'
import { BookingRecord, VerifyPaymentRequest, VerifyPaymentResponse } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body: VerifyPaymentRequest = await req.json()
    const {
      transactionId,
      paymentId,
      utrNumber,
      promoCode,
      screenshotBase64,
      screenshotFilename,
      name,
      email,
      phone,
      quantity,
      passType,
      isMockPayment,
      paymentMethod = 'phonepe',
    } = body

    if (!transactionId || !name || !email) {
      return NextResponse.json<VerifyPaymentResponse>(
        { success: false, error: 'Missing required payment verification parameters.' },
        { status: 400 }
      )
    }

    if (paymentMethod === 'upi_screenshot' && (!utrNumber || utrNumber.trim().length < 6)) {
      return NextResponse.json<VerifyPaymentResponse>(
        { success: false, error: 'A valid UTR / Transaction Reference Number is required.' },
        { status: 400 }
      )
    }

    const phonePeConfig = getPhonePeConfig()

    // If live PhonePe keys are present and this is a PhonePe PG payment (not mock or manual UPI screenshot)
    if (phonePeConfig && !isMockPayment && paymentMethod === 'phonepe') {
      const statusRes = await checkPhonePeStatus(transactionId)
      const isSuccess =
        statusRes &&
        statusRes.success &&
        (statusRes.code === 'PAYMENT_SUCCESS' || statusRes.data?.responseCode === 'SUCCESS')

      if (!isSuccess) {
        return NextResponse.json<VerifyPaymentResponse>(
          { success: false, error: statusRes?.message || 'Payment not verified by PhonePe.' },
          { status: 400 }
        )
      }
    }

    // Generate unique Pass ID (LT-XXXX-XXXX) and enforce server-side promo calculation
    const passId = generatePassId()
    const selectedPass = getPassOption(passType)
    const qty = Number(quantity) || 1
    const promoCheck = validatePromoCode(promoCode)
    const finalAmount = calculateDiscountedTotal(
      selectedPass.price,
      qty,
      promoCheck.discountPercent
    )
    const bookingStatus = paymentMethod === 'upi_screenshot' ? 'in_review' : 'confirmed'

    const booking: BookingRecord = {
      passId,
      passType: selectedPass.id,
      orderId: transactionId,
      paymentId:
        paymentId ||
        (paymentMethod === 'upi_screenshot'
          ? `UTR:${utrNumber?.trim()}`
          : `phonepe_pay_${Date.now()}`),
      utrNumber: utrNumber?.trim() || undefined,
      promoCode: promoCheck.valid ? promoCheck.code : undefined,
      discountPercent: promoCheck.valid ? promoCheck.discountPercent : undefined,
      name,
      email,
      phone,
      quantity: qty,
      amount: finalAmount,
      status: bookingStatus,
      createdAt: new Date().toISOString(),
      eventDate: 'Sunday, Dec 06, 5:30 PM – 10:30 PM',
      venue: 'Pawffe, 2-91 Beach Rd, Sagar Nagar, Endada, Vizag 530045',
    }

    // 1. Save to local attendees registry & Google Sheets webhook
    await saveBooking(booking)

    // 2. Dispatch dual emails (Buyer Confirmation + Organizer Notification with Screenshot)
    const emailResult = await sendDualBookingEmails(
      booking,
      screenshotBase64
        ? { base64: screenshotBase64, filename: screenshotFilename || `upi-${passId}.png` }
        : undefined
    )

    // Clean pending order if exists
    removePendingOrder(transactionId)

    return NextResponse.json<VerifyPaymentResponse>({
      success: true,
      passId,
      booking,
      emailStatus: emailResult,
      sheetStatus: {
        synced: Boolean(process.env.GOOGLE_SHEET_WEBHOOK_URL),
        details: process.env.GOOGLE_SHEET_WEBHOOK_URL
          ? 'Synced to Google Sheet'
          : 'Saved locally (Add GOOGLE_SHEET_WEBHOOK_URL in .env to sync live sheet)',
      },
    })
  } catch (err: any) {
    console.error('[API verify-payment error]', err)
    return NextResponse.json<VerifyPaymentResponse>(
      { success: false, error: err.message || 'Payment processing encountered an unexpected error.' },
      { status: 500 }
    )
  }
}
