import path from 'path'
import bwipjs from 'bwip-js'
import sharp from 'sharp'
import { PassType, PASS_CATALOG } from './passes'

export async function generatePassWithBarcode(
  ticketCode: string,
  passType: PassType = 'OTAKU'
): Promise<Buffer> {
  // 1. Generate horizontal Code 128 barcode with white background
  const barcodeBuffer = await bwipjs.toBuffer({
    bcid: 'code128',
    text: ticketCode,
    scale: 3,
    height: 12,
    includetext: true,
    textxalign: 'center',
    backgroundcolor: 'ffffff',
    paddingwidth: 8,
    paddingheight: 6,
  })

  // 2. Load the matching pass template
  const passInfo = PASS_CATALOG[passType] || PASS_CATALOG.OTAKU
  const templatePath = path.join(process.cwd(), 'public', 'passes', passInfo.templateFile)
  const meta = await sharp(templatePath).metadata()
  const width = meta.width || 686
  const height = meta.height || 1024

  // 3. Size barcode to fit the bottom-right box (right of the vertical divider)
  const boxWidth = Math.round(width * 0.35)
  const boxHeight = Math.round(height * 0.095)

  const resizedBarcode = await sharp(barcodeBuffer)
    .resize(boxWidth, boxHeight, { fit: 'contain', background: '#ffffff' })
    .png()
    .toBuffer()

  // Position in the bottom-right box
  const left = Math.round(width * 0.53)
  const top = Math.round(height * 0.835)

  // 4. Composite and return PNG buffer for Resend attachment / download
  return sharp(templatePath)
    .composite([{ input: resizedBarcode, left, top }])
    .png()
    .toBuffer()
}
