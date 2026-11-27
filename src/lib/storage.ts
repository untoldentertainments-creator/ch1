import fs from 'fs'
import path from 'path'
import { BookingRecord } from './types'
import { PassType } from './passes'

const DATA_DIR = path.join(process.cwd(), 'data')
const ATTENDEES_FILE = path.join(DATA_DIR, 'attendees.json')
const PENDING_FILE = path.join(DATA_DIR, 'pending_orders.json')
const BARCODES_CSV_FILE = path.join(DATA_DIR, 'barcodes.csv')
const BARCODES_ONLY_CSV_FILE = path.join(DATA_DIR, 'barcodes-only.csv')

export interface PendingOrder {
  transactionId: string
  name: string
  email: string
  phone: string
  quantity: number
  passType: PassType
  amount: number
  createdAt: string
}

function ensureStorageExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(ATTENDEES_FILE)) {
      fs.writeFileSync(ATTENDEES_FILE, JSON.stringify([], null, 2), 'utf-8')
    }
    if (!fs.existsSync(PENDING_FILE)) {
      fs.writeFileSync(PENDING_FILE, JSON.stringify({}, null, 2), 'utf-8')
    }
    if (!fs.existsSync(BARCODES_CSV_FILE)) {
      fs.writeFileSync(
        BARCODES_CSV_FILE,
        'barcode_id,name,email,phone,pass_type,quantity,amount_paid,utr_number,status,timestamp\n',
        'utf-8'
      )
    }
    if (!fs.existsSync(BARCODES_ONLY_CSV_FILE)) {
      fs.writeFileSync(BARCODES_ONLY_CSV_FILE, 'barcode_id\n', 'utf-8')
    }
  } catch {
    // Read-only filesystem on serverless platforms (e.g. Vercel); Google Sheets & Resend handle persistence
  }
}

function escapeCsvCell(val: string | number | undefined): string {
  const str = String(val ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function savePendingOrder(order: PendingOrder) {
  ensureStorageExists()
  try {
    const raw = fs.readFileSync(PENDING_FILE, 'utf-8')
    const map: Record<string, PendingOrder> = JSON.parse(raw || '{}')
    map[order.transactionId] = order
    fs.writeFileSync(PENDING_FILE, JSON.stringify(map, null, 2), 'utf-8')
  } catch (err) {
    console.error('[Storage Error] Failed to save pending order:', err)
  }
}

export function getPendingOrder(transactionId: string): PendingOrder | null {
  ensureStorageExists()
  try {
    const raw = fs.readFileSync(PENDING_FILE, 'utf-8')
    const map: Record<string, PendingOrder> = JSON.parse(raw || '{}')
    return map[transactionId] || null
  } catch {
    return null
  }
}

export function removePendingOrder(transactionId: string) {
  ensureStorageExists()
  try {
    const raw = fs.readFileSync(PENDING_FILE, 'utf-8')
    const map: Record<string, PendingOrder> = JSON.parse(raw || '{}')
    delete map[transactionId]
    fs.writeFileSync(PENDING_FILE, JSON.stringify(map, null, 2), 'utf-8')
  } catch (err) {
    console.error('[Storage Error] Failed to remove pending order:', err)
  }
}

export async function saveBooking(booking: BookingRecord): Promise<void> {
  ensureStorageExists()
  try {
    const raw = fs.readFileSync(ATTENDEES_FILE, 'utf-8')
    const list: BookingRecord[] = JSON.parse(raw || '[]')
    // Check if duplicate passId or orderId already exists
    const exists = list.some((b) => b.passId === booking.passId || b.orderId === booking.orderId)
    if (!exists) {
      list.unshift(booking)
      fs.writeFileSync(ATTENDEES_FILE, JSON.stringify(list, null, 2), 'utf-8')

      // Append barcode row to local CSV for scanner import
      const csvRow = [
        escapeCsvCell(booking.passId),
        escapeCsvCell(booking.name),
        escapeCsvCell(booking.email),
        escapeCsvCell(booking.phone),
        escapeCsvCell(booking.passType),
        escapeCsvCell(booking.quantity),
        escapeCsvCell(booking.amount),
        escapeCsvCell(booking.utrNumber || booking.paymentId),
        escapeCsvCell(booking.status),
        escapeCsvCell(booking.createdAt),
      ].join(',')
      fs.appendFileSync(BARCODES_CSV_FILE, csvRow + '\n', 'utf-8')
      fs.appendFileSync(BARCODES_ONLY_CSV_FILE, escapeCsvCell(booking.passId) + '\n', 'utf-8')
    }
  } catch (err) {
    console.error('[Storage Error] Failed to write local booking:', err)
  }

  // Also post to Google Sheet webhook if configured (Vercel-safe persistent storage)
  const sheetWebhook = process.env.GOOGLE_SHEET_WEBHOOK_URL?.trim()
  if (sheetWebhook) {
    try {
      const sheetRes = await fetch(sheetWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        body: JSON.stringify({
          barcode_id: booking.passId,
          timestamp: booking.createdAt,
          passId: booking.passId,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          pass_type: booking.passType,
          quantity: booking.quantity,
          amountPaid: `₹${booking.amount}`,
          utrNumber: booking.utrNumber || '',
          paymentId: booking.paymentId,
          orderId: booking.orderId,
          status: booking.status,
          venue: booking.venue,
        }),
      })
      const sheetText = await sheetRes.text()
      console.log(`[Google Sheet] Synced ${booking.passId} (${sheetRes.status}):`, sheetText)
    } catch (sheetErr) {
      console.error('[Google Sheet Error] Failed to sync to Google Sheet:', sheetErr)
    }
  } else {
    console.warn('[Google Sheet] GOOGLE_SHEET_WEBHOOK_URL is not set in environment!')
  }
}

export function getAllBookings(): BookingRecord[] {
  ensureStorageExists()
  try {
    const raw = fs.readFileSync(ATTENDEES_FILE, 'utf-8')
    return JSON.parse(raw || '[]')
  } catch {
    return []
  }
}

export function getBookingByPassId(passId: string): BookingRecord | null {
  const bookings = getAllBookings()
  return bookings.find((b) => b.passId.toUpperCase() === passId.toUpperCase()) || null
}
