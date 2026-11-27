import { NextRequest, NextResponse } from 'next/server'
import { generatePassWithBarcode } from '@/lib/generateTicket'
import { getBookingByPassId } from '@/lib/storage'
import { PassType } from '@/lib/passes'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ passId: string }> }
) {
  try {
    const { passId } = await context.params
    const booking = getBookingByPassId(passId)
    const queryType = req.nextUrl.searchParams.get('type') as PassType | null
    const passType: PassType = booking?.passType || queryType || 'OTAKU'

    const pngBuffer = await generatePassWithBarcode(passId.toUpperCase(), passType)

    return new NextResponse(new Uint8Array(pngBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="laugh-tale-${passId.toUpperCase()}.png"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err: any) {
    console.error('[Pass Image Error]', err)
    return NextResponse.json({ error: 'Failed to generate pass image.' }, { status: 500 })
  }
}
