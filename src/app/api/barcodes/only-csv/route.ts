import { NextResponse } from 'next/server'
import { getAllBookings } from '@/lib/storage'

export async function GET() {
  const bookings = getAllBookings()
  const rows = bookings.map((b) => b.passId)
  const csvContent = ['barcode_id', ...rows].join('\n')

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="laugh-tale-barcodes-only.csv"',
    },
  })
}
