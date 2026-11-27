import { NextResponse } from 'next/server'
import { getAllBookings } from '@/lib/storage'

function escapeCsvCell(val: string | number | undefined): string {
  const str = String(val ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET() {
  const bookings = getAllBookings()
  const headers = [
    'barcode_id',
    'name',
    'email',
    'phone',
    'pass_type',
    'quantity',
    'amount_paid',
    'utr_number',
    'status',
    'timestamp',
  ]

  const rows = bookings.map((b) =>
    [
      escapeCsvCell(b.passId),
      escapeCsvCell(b.name),
      escapeCsvCell(b.email),
      escapeCsvCell(b.phone),
      escapeCsvCell(b.passType || 'OTAKU'),
      escapeCsvCell(b.quantity),
      escapeCsvCell(b.amount),
      escapeCsvCell(b.utrNumber || b.paymentId),
      escapeCsvCell(b.status),
      escapeCsvCell(b.createdAt),
    ].join(',')
  )

  const csvContent = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="laugh-tale-barcodes.csv"',
    },
  })
}
