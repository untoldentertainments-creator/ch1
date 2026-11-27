import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import { BookingRecord } from './types'
import { getPassOption } from './passes'
import { generatePassWithBarcode } from './generateTicket'

interface EmailResult {
  buyerSent: boolean
  organizerSent: boolean
  details?: string
}

function getBuyerEmailHtml(booking: BookingRecord): string {
  const passLabel = getPassOption(booking.passType).shortName
  const isInReview = booking.status === 'in_review'
  const heading = isInReview ? 'Pay on UPI, then we lock it in' : 'Your pass is confirmed'
  const intro = isInReview
    ? `${booking.name}, we're holding ${booking.quantity} × ${passLabel}. We're verifying your UPI payment screenshot. Your pass with barcode is attached below.`
    : `${booking.name}, your ${booking.quantity} × ${passLabel} pass is confirmed for LAUGH TALE. Your official pass with barcode is attached — present it at the main entrance gate.`
  const statusText = isInReview ? "In review · we'll confirm shortly" : 'Confirmed · ready for entry'
  const spacedRef = booking.passId.split('').join(' ')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LAUGH TALE — ${booking.passId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #040509; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #040509; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #0b0d17; border: 1px solid #1b2036; border-radius: 14px;">
          <tr>
            <td style="padding: 36px 32px;">
              <!-- Top Studio Stamp -->
              <div style="font-size: 11px; letter-spacing: 0.22em; color: #34d399; text-transform: uppercase; font-weight: 600; font-family: monospace;">
                UNTOLD ENTERTAINMENTS
              </div>

              <!-- Editorial Heading -->
              <h1 style="margin: 12px 0 14px; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400; color: #ffffff; line-height: 1.2;">
                ${heading}
              </h1>

              <!-- Body Copy -->
              <p style="margin: 0 0 24px; font-size: 14px; color: #94a3b8; line-height: 1.65;">
                ${intro}
              </p>

              <!-- Reference Box -->
              <div style="background-color: #0f1715; border: 1px solid #1f332c; border-radius: 10px; padding: 18px 20px; text-align: center; margin-bottom: 26px;">
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 20px; letter-spacing: 0.24em; color: #fbbf24; font-weight: 600;">
                  ${spacedRef}
                </div>
              </div>

              <!-- Key-Value Summary Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 22px;">
                <tr>
                  <td style="padding: 8px 0; font-family: monospace; font-size: 11px; letter-spacing: 0.16em; color: #64748b; text-transform: uppercase;">
                    PASS
                  </td>
                  <td align="right" style="padding: 8px 0; font-size: 13px; color: #f8fafc; font-weight: 600;">
                    ${booking.quantity} × ${passLabel}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: monospace; font-size: 11px; letter-spacing: 0.16em; color: #64748b; text-transform: uppercase;">
                    QUANTITY
                  </td>
                  <td align="right" style="padding: 8px 0; font-size: 13px; color: #f8fafc; font-weight: 600;">
                    ${booking.quantity}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: monospace; font-size: 11px; letter-spacing: 0.16em; color: #64748b; text-transform: uppercase;">
                    TOTAL
                  </td>
                  <td align="right" style="padding: 8px 0; font-size: 13px; color: #f8fafc; font-weight: 600;">
                    ₹${booking.amount}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: monospace; font-size: 11px; letter-spacing: 0.16em; color: #64748b; text-transform: uppercase;">
                    STATUS
                  </td>
                  <td align="right" style="padding: 8px 0; font-size: 13px; color: #f8fafc; font-weight: 600;">
                    ${statusText}
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="border-top: 1px solid #1b2036; margin: 22px 0;"></div>

              <!-- Reference & Entry Note -->
              <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.65;">
                Your reference <strong style="color: #cbd5e1;">${booking.passId}</strong> is linked to ${booking.email}. Present this reference at the main entrance gate for quick verification.
              </p>

              <!-- Divider -->
              <div style="border-top: 1px solid #1b2036; margin: 22px 0;"></div>

              <!-- Event Logistics -->
              <div style="font-family: monospace; font-size: 11px; letter-spacing: 0.12em; color: #64748b; text-transform: uppercase;">
                SUNDAY, DECEMBER 06 · 5:30 PM — 10:30 PM
              </div>
              <div style="font-size: 13px; color: #94a3b8; margin-top: 6px;">
                Pawffe, 2-91 Beach Rd, Sagar Nagar, Endada, Vizag
              </div>
              <div style="margin-top: 6px;">
                <a href="https://www.google.com/maps/search/?api=1&query=Pawffe,+Beach+Rd,+Gudla+Vani+Palem,+Sagar+Nagar,+Endada,+Visakhapatnam,+Andhra+Pradesh+530045" style="color: #fbbf24; text-decoration: underline; font-size: 13px;">
                  Open in Google Maps
                </a>
              </div>

              <div style="margin-top: 18px; font-size: 13px; color: #94a3b8;">
                Questions: <a href="mailto:untold@untoldentertainments.in" style="color: #cbd5e1; text-decoration: underline;">untold@untoldentertainments.in</a>
              </div>

              <!-- House Rules Policy -->
              <p style="margin: 22px 0 0; font-size: 11px; color: #64748b; line-height: 1.6;">
                LAUGH TALE house rules: No ticket sharing or duplication · No re-entry · Follow event timings (5:30 PM – 10:30 PM) · Respect people's privacy &amp; the core team · Zero tolerance for fighting, bullying, harassment, or property damage · Alcohol, smoking, vaping, and outside food/beverages are strictly prohibited · Keep the venue clean. Violation of serious rules may result in removal without a refund.
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
}

function getOrganizerEmailHtml(booking: BookingRecord, hasScreenshot: boolean = false): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Ticket Sold: ${booking.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #040509; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #040509; padding: 36px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #0b0d17; border: 1px solid #1b2036; border-radius: 14px;">
          <tr>
            <td style="padding: 32px;">
              <div style="font-size: 11px; letter-spacing: 0.22em; color: #34d399; text-transform: uppercase; font-weight: 600; font-family: monospace;">
                UNTOLD · NEW BOOKING
              </div>
              <h2 style="margin: 10px 0 18px; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 400; color: #ffffff;">
                ${booking.name} (${booking.quantity} × ${getPassOption(booking.passType).shortName})
              </h2>

              <div style="background-color: #0f1715; border: 1px solid #1f332c; border-radius: 10px; padding: 14px 18px; text-align: center; margin-bottom: 22px;">
                <div style="font-family: monospace; font-size: 18px; letter-spacing: 0.2em; color: #fbbf24; font-weight: 600;">
                  ${booking.passId}
                </div>
              </div>

              <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 13px;">
                <tr>
                  <td style="color: #64748b; font-family: monospace; font-size: 11px; text-transform: uppercase;">STATUS</td>
                  <td align="right" style="color: #f8fafc; font-weight: 600;">${booking.status.toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-family: monospace; font-size: 11px; text-transform: uppercase;">EMAIL</td>
                  <td align="right"><a href="mailto:${booking.email}" style="color: #fbbf24; text-decoration: none;">${booking.email}</a></td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-family: monospace; font-size: 11px; text-transform: uppercase;">WHATSAPP</td>
                  <td align="right"><a href="https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}" style="color: #34d399; text-decoration: none;">${booking.phone}</a></td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-family: monospace; font-size: 11px; text-transform: uppercase;">QUANTITY</td>
                  <td align="right" style="color: #ffffff; font-weight: 600;">${booking.quantity}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-family: monospace; font-size: 11px; text-transform: uppercase;">TOTAL</td>
                  <td align="right" style="color: #34d399; font-weight: 600;">₹${booking.amount}</td>
                </tr>
                ${
                  booking.promoCode
                    ? `<tr>
                  <td style="color: #64748b; font-family: monospace; font-size: 11px; text-transform: uppercase;">PROMO CODE</td>
                  <td align="right" style="color: #34d399; font-family: monospace; font-size: 12px; font-weight: 600;">${booking.promoCode} (${booking.discountPercent}% OFF)</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="color: #64748b; font-family: monospace; font-size: 11px; text-transform: uppercase;">PAYMENT ID</td>
                  <td align="right" style="color: #94a3b8; font-family: monospace; font-size: 12px;">${booking.paymentId}</td>
                </tr>
                ${
                  booking.utrNumber
                    ? `<tr>
                  <td style="color: #64748b; font-family: monospace; font-size: 11px; text-transform: uppercase;">UTR NUMBER</td>
                  <td align="right" style="color: #fbbf24; font-family: monospace; font-size: 12px; font-weight: 600;">${booking.utrNumber}</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="color: #64748b; font-family: monospace; font-size: 11px; text-transform: uppercase;">TIMESTAMP</td>
                  <td align="right" style="color: #64748b; font-size: 11px;">${booking.createdAt}</td>
                </tr>
                ${
                  hasScreenshot
                    ? `<tr>
                  <td style="color: #64748b; font-family: monospace; font-size: 11px; text-transform: uppercase;">SCREENSHOT</td>
                  <td align="right" style="color: #34d399; font-size: 11px; font-weight: 600;">Attached to this email ✓</td>
                </tr>`
                    : ''
                }
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export interface ScreenshotAttachment {
  base64: string
  filename?: string
}

export async function sendDualBookingEmails(
  booking: BookingRecord,
  screenshot?: ScreenshotAttachment
): Promise<EmailResult> {
  const organizerEmail = process.env.ORGANIZER_EMAIL || 'untold@untoldentertainments.in'
  const screenshotEmail = process.env.SCREENSHOT_EMAIL?.trim() || organizerEmail
  const hasSeparateScreenshotInbox =
    Boolean(screenshot?.base64) &&
    screenshotEmail.toLowerCase() !== organizerEmail.toLowerCase()
  const resendApiKey = process.env.RESEND_API_KEY
  const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'Laugh Tale <onboarding@resend.dev>'

  const buyerSubject =
    booking.status === 'in_review'
      ? `Pay UPI: ${booking.passId} — LAUGH TALE`
      : `Your Pass is Confirmed! 🏴‍☠️ LAUGH TALE – Dec 6`
  const organizerSubject = `New Ticket Sold: ${booking.name} (${booking.quantity}x) – ${booking.passId}`
  const screenshotSubject = `UPI Screenshot: ${booking.name} (UTR: ${booking.utrNumber || 'N/A'}) – ${booking.passId}`

  const buyerHtml = getBuyerEmailHtml(booking)
  const organizerHtml = getOrganizerEmailHtml(booking, Boolean(screenshot?.base64))

  // Parse optional UPI screenshot attachment
  let screenshotBuffer: Buffer | null = null
  const screenshotName = screenshot?.filename || `upi-screenshot-${booking.passId}.png`
  if (screenshot?.base64) {
    try {
      const base64Data = screenshot.base64.includes(',')
        ? screenshot.base64.split(',')[1]
        : screenshot.base64
      screenshotBuffer = Buffer.from(base64Data, 'base64')
    } catch (err) {
      console.error('[Screenshot Parse Error]', err)
    }
  }

  // Generate stamped PNG pass with horizontal Code 128 barcode in bottom-right box
  let passAttachmentBuffer: Buffer | null = null
  try {
    passAttachmentBuffer = await generatePassWithBarcode(booking.passId, booking.passType || 'OTAKU')
  } catch (genErr) {
    console.error('[Pass Generation Error]', genErr)
  }

  const attachmentFilename = `laugh-tale-pass-${booking.passId}.png`

  // 1. Try Resend if API key is provided
  if (resendApiKey && resendApiKey.trim() !== '') {
    try {
      const resend = new Resend(resendApiKey)

      const sends: Promise<any>[] = [
        resend.emails.send({
          from: resendFromEmail,
          to: booking.email,
          subject: buyerSubject,
          html: buyerHtml,
          attachments: passAttachmentBuffer
            ? [{ filename: attachmentFilename, content: passAttachmentBuffer }]
            : undefined,
        }),
        resend.emails.send({
          from: resendFromEmail,
          to: organizerEmail,
          subject: organizerSubject,
          html: organizerHtml,
          attachments:
            !hasSeparateScreenshotInbox && screenshotBuffer
              ? [{ filename: screenshotName, content: screenshotBuffer }]
              : undefined,
        }),
      ]

      if (hasSeparateScreenshotInbox && screenshotBuffer) {
        sends.push(
          resend.emails.send({
            from: resendFromEmail,
            to: screenshotEmail,
            subject: screenshotSubject,
            html: organizerHtml,
            attachments: [{ filename: screenshotName, content: screenshotBuffer }],
          })
        )
      }

      const results = await Promise.allSettled(sends)
      const buyerSent = results[0].status === 'fulfilled' && !results[0].value.error
      const organizerSent = results[1].status === 'fulfilled' && !results[1].value.error

      return {
        buyerSent,
        organizerSent,
        details: `Sent via Resend (Buyer: ${buyerSent ? 'OK' : 'Error'}, Organizer: ${organizerSent ? 'OK' : 'Error'})`,
      }
    } catch (err: any) {
      console.error('[Resend Error]', err)
    }
  }

  // 2. Try SMTP via Nodemailer if SMTP credentials are provided
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort) || 587,
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      const fromAddress = `"${process.env.SMTP_FROM_NAME || 'Laugh Tale UNTOLD'}" <${smtpUser}>`

      const smtpSends: Promise<any>[] = [
        transporter.sendMail({
          from: fromAddress,
          to: booking.email,
          subject: buyerSubject,
          html: buyerHtml,
          attachments: passAttachmentBuffer
            ? [
                {
                  filename: attachmentFilename,
                  content: passAttachmentBuffer,
                },
              ]
            : undefined,
        }),
        transporter.sendMail({
          from: fromAddress,
          to: organizerEmail,
          subject: organizerSubject,
          html: organizerHtml,
          attachments:
            !hasSeparateScreenshotInbox && screenshotBuffer
              ? [
                  {
                    filename: screenshotName,
                    content: screenshotBuffer,
                  },
                ]
              : undefined,
        }),
      ]

      if (hasSeparateScreenshotInbox && screenshotBuffer) {
        smtpSends.push(
          transporter.sendMail({
            from: fromAddress,
            to: screenshotEmail,
            subject: screenshotSubject,
            html: organizerHtml,
            attachments: [
              {
                filename: screenshotName,
                content: screenshotBuffer,
              },
            ],
          })
        )
      }

      const [buyerRes, organizerRes] = await Promise.allSettled(smtpSends)

      const buyerSent = buyerRes.status === 'fulfilled'
      const organizerSent = organizerRes.status === 'fulfilled'

      return {
        buyerSent,
        organizerSent,
        details: `Sent via SMTP (Buyer: ${buyerSent ? 'OK' : 'Error'}, Organizer: ${organizerSent ? 'OK' : 'Error'})`,
      }
    } catch (smtpErr: any) {
      console.error('[SMTP Error]', smtpErr)
    }
  }

  // 3. Simulated mode (No credentials configured yet)
  console.log('---------------------------------------------------------')
  console.log('[Email Simulation: No Resend/SMTP configured yet]')
  console.log(`To Buyer (${booking.email}): ${buyerSubject}`)
  console.log(`To Organizer (${organizerEmail}): ${organizerSubject}`)
  console.log(`Pass ID: ${booking.passId} | Amount: ₹${booking.amount}`)
  console.log('---------------------------------------------------------')

  return {
    buyerSent: true,
    organizerSent: true,
    details: 'Simulated dispatch (Add RESEND_API_KEY or SMTP credentials in .env to deliver live emails)',
  }
}
