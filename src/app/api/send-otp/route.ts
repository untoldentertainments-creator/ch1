import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email is required.' }, { status: 400 })
    }

    const otp = String(Math.floor(1000 + Math.random() * 9000))
    const subject = `${otp} is your LAUGH TALE verification code`
    const spacedOtp = otp.split('').join(' ')
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #040509; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #040509; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #0b0d17; border: 1px solid #1b2036; border-radius: 14px;">
          <tr>
            <td style="padding: 36px 32px;">
              <div style="font-size: 11px; letter-spacing: 0.22em; color: #34d399; text-transform: uppercase; font-weight: 600; font-family: monospace;">
                UNTOLD ENTERTAINMENTS
              </div>
              <h1 style="margin: 12px 0 14px; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400; color: #ffffff; line-height: 1.2;">
                Verify your email
              </h1>
              <p style="margin: 0 0 24px; font-size: 14px; color: #94a3b8; line-height: 1.65;">
                ${name || 'Crewmate'}, enter this 4-digit verification code in checkout to continue your LAUGH TALE booking.
              </p>
              <div style="background-color: #0f1715; border: 1px solid #1f332c; border-radius: 10px; padding: 18px 20px; text-align: center; margin-bottom: 24px;">
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 24px; letter-spacing: 0.35em; color: #fbbf24; font-weight: 600;">
                  ${spacedOtp}
                </div>
              </div>
              <div style="border-top: 1px solid #1b2036; margin: 20px 0;"></div>
              <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.6;">
                SUNDAY, DECEMBER 06 · 5:30 PM — 10:30 PM · Pawffe, Vizag<br>
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    const resendApiKey = process.env.RESEND_API_KEY
    const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'Laugh Tale <onboarding@resend.dev>'

    if (resendApiKey && resendApiKey.trim() !== '') {
      const resend = new Resend(resendApiKey)
      const { data, error } = await resend.emails.send({
        from: resendFromEmail,
        to: [email],
        subject,
        html,
      })

      if (error) {
        console.error('[Resend OTP Error]', error)
        return NextResponse.json(
          { success: false, error: error.message || 'Resend failed to send verification email.' },
          { status: 400 }
        )
      }

      return NextResponse.json({ success: true, otp, sent: true, id: data?.id })
    }

    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      })
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Laugh Tale UNTOLD'}" <${smtpUser}>`,
        to: email,
        subject,
        html,
      })
      return NextResponse.json({ success: true, otp, sent: true })
    }

    // Simulated sandbox mode when no email keys are configured yet
    return NextResponse.json({ success: true, otp, sent: false, testMode: true })
  } catch (err: any) {
    console.error('[OTP Error]', err)
    return NextResponse.json({ success: true, otp: '1234', sent: false, testMode: true })
  }
}
