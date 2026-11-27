import { PassType } from './passes'

export interface AttendeeData {
  name: string
  email: string
  phone: string
  quantity: number
  passType?: PassType
}

export interface BookingRecord extends AttendeeData {
  passId: string
  passType: PassType
  orderId: string
  paymentId: string
  utrNumber?: string
  promoCode?: string
  discountPercent?: number
  amount: number // in INR
  status: 'confirmed' | 'in_review' | 'pending' | 'failed'
  createdAt: string
  eventDate: string
  venue: string
}

export interface CreateOrderRequest {
  name: string
  email: string
  phone: string
  quantity: number
  passType?: PassType
  promoCode?: string
}

export interface CreateOrderResponse {
  success: boolean
  orderId?: string
  amount?: number
  currency?: string
  redirectUrl?: string
  testMode?: boolean
  error?: string
}

export interface VerifyPaymentRequest {
  transactionId: string
  paymentId?: string
  utrNumber?: string
  promoCode?: string
  screenshotBase64?: string
  screenshotFilename?: string
  name: string
  email: string
  phone: string
  quantity: number
  passType?: PassType
  amount: number
  isMockPayment?: boolean
  paymentMethod?: 'phonepe' | 'upi_screenshot'
}

export interface VerifyPaymentResponse {
  success: boolean
  passId?: string
  booking?: BookingRecord
  emailStatus?: {
    buyerSent: boolean
    organizerSent: boolean
    details?: string
  }
  sheetStatus?: {
    synced: boolean
    details?: string
  }
  error?: string
}
