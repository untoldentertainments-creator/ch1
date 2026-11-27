import { NextResponse } from 'next/server'
import { getAllBookings } from '@/lib/storage'

export async function GET() {
  const bookings = getAllBookings()
  return NextResponse.json({
    totalBookings: bookings.length,
    totalPasses: bookings.reduce((acc, b) => acc + (b.quantity || 1), 0),
    totalRevenue: bookings.reduce((acc, b) => acc + (b.amount || 0), 0),
    bookings,
  })
}
