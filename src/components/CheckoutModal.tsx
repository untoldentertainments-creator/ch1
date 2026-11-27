'use client'

import React, { useState, useEffect } from 'react'
import { Check, Copy, Download, MapPin, Upload, X, ArrowLeft, ArrowRight } from 'lucide-react'
import { BookingRecord, VerifyPaymentResponse } from '@/lib/types'
import { PASS_CATALOG, PASS_LIST, PassType, calculateDiscountedTotal, validatePromoCode } from '@/lib/passes'

interface CheckoutModalProps {
  isOpen: boolean
  initialPassType?: PassType
  onClose: () => void
  onSuccess?: (booking: BookingRecord) => void
}

type StepKey = 'PASS' | 'DETAILS' | 'VERIFY' | 'CONFIRM' | 'PAY' | 'DONE'

const STEPS: StepKey[] = ['PASS', 'DETAILS', 'VERIFY', 'CONFIRM', 'PAY', 'DONE']

const STEP_TITLES: Record<StepKey, string> = {
  PASS: 'Choose your pass',
  DETAILS: 'Attendee details',
  VERIFY: 'Verify your email',
  CONFIRM: 'Confirm your order',
  PAY: 'Complete payment',
  DONE: "You're on the list",
}

export default function CheckoutModal({
  isOpen,
  initialPassType = 'OTAKU',
  onClose,
}: CheckoutModalProps) {
  const [step, setStep] = useState<StepKey>('PASS')
  const [passType, setPassType] = useState<PassType>(initialPassType)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [quantity, setQuantity] = useState(1)

  // Step 3: Verify OTP state
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [isOtpTestMode, setIsOtpTestMode] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)

  // Promo code state
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: 5 | 10 } | null>(null)
  const [promoError, setPromoError] = useState('')

  // Step 5: Payment method state (Single UPI QR Method)
  const [utrNumber, setUtrNumber] = useState('')
  const [screenshotFileName, setScreenshotFileName] = useState('')
  const [screenshotBase64, setScreenshotBase64] = useState('')

  // Step 6: Done / Ticket state
  const [completedBooking, setCompletedBooking] = useState<BookingRecord | null>(null)
  const [copiedRef, setCopiedRef] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Reset modal when closed/opened
  useEffect(() => {
    if (isOpen) {
      setStep('PASS')
      setPassType(initialPassType)
      setErrorMessage('')
      setIsLoading(false)
      setOtpInput('')
      setGeneratedOtp('')
      setPromoInput('')
      setAppliedPromo(null)
      setPromoError('')
      setUtrNumber('')
      setScreenshotFileName('')
      setScreenshotBase64('')
      setCompletedBooking(null)
      setCopiedRef(false)
    }
  }, [isOpen, initialPassType])

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  const currentStepIndex = STEPS.indexOf(step)
  const selectedPass = PASS_CATALOG[passType] || PASS_CATALOG.OTAKU
  const subtotalAmount = quantity * selectedPass.price
  const totalAmount = calculateDiscountedTotal(
    selectedPass.price,
    quantity,
    appliedPromo?.discountPercent || 0
  )

  const handleApplyPromo = () => {
    setPromoError('')
    const res = validatePromoCode(promoInput)
    if (!res.valid || !res.code || res.discountPercent === 0) {
      setAppliedPromo(null)
      setPromoError('Invalid promo code.')
      return
    }
    setAppliedPromo({ code: res.code, discountPercent: res.discountPercent })
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
    setPromoError('')
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)))
  }

  const sendVerificationOtp = async () => {
    setIsSendingOtp(true)
    setErrorMessage('')
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), name: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Could not send verification email.')
      }
      setGeneratedOtp(data.otp || '1234')
      setIsOtpTestMode(Boolean(data.testMode))
    } catch {
      setGeneratedOtp('1234')
      setIsOtpTestMode(true)
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleNextFromDetails = async () => {
    setErrorMessage('')
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp phone number.')
      return
    }
    setStep('VERIFY')
    await sendVerificationOtp()
  }

  const handleVerifyOtp = () => {
    setErrorMessage('')
    if (!otpInput.trim() || otpInput.trim() !== generatedOtp) {
      setErrorMessage('Invalid verification code. Please check your code and try again.')
      return
    }
    setStep('CONFIRM')
  }

  const handleCompletePayment = async () => {
    setErrorMessage('')

    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      setErrorMessage('Please enter a valid UTR / Transaction Reference Number (required).')
      return
    }
    if (!screenshotFileName || !screenshotBase64) {
      setErrorMessage('Please upload your UPI payment screenshot (required).')
      return
    }

    setIsLoading(true)

    try {
      const transactionId = `LT_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`

      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          utrNumber: utrNumber.trim(),
          promoCode: appliedPromo?.code,
          screenshotBase64,
          screenshotFilename: screenshotFileName,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          quantity,
          passType,
          amount: totalAmount,
          isMockPayment: false,
          paymentMethod: 'upi_screenshot',
        }),
      })

      const verifyData: VerifyPaymentResponse = await verifyRes.json()

      if (!verifyRes.ok || !verifyData.success || !verifyData.booking) {
        throw new Error(verifyData.error || 'Payment verification could not be completed.')
      }

      setCompletedBooking(verifyData.booking)
      setIsLoading(false)
      setStep('DONE')
    } catch (err: any) {
      console.error('[Checkout Error]', err)
      setErrorMessage(err.message || 'An error occurred during checkout. Please try again.')
      setIsLoading(false)
    }
  }

  const handleCopyReference = () => {
    if (!completedBooking?.passId) return
    navigator.clipboard.writeText(completedBooking.passId)
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#070910] shadow-2xl z-10 my-4 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-[0.22em] text-neutral-400 uppercase">
              LAUGH TALE · DEC 06 · PAWFFE, VIZAG
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial text-white mt-1 tracking-tight">
              {STEP_TITLES[step]}
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.03] hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 6-Step Progress Bar */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {STEPS.map((label, idx) => {
              const isCompletedOrActive = idx <= currentStepIndex
              return (
                <div key={label} className="flex flex-col">
                  <div
                    className={`h-[2px] w-full rounded-full transition-all duration-300 ${
                      isCompletedOrActive ? 'bg-white' : 'bg-white/15'
                    }`}
                  />
                  <span
                    className={`mt-2 text-[9px] sm:text-[10px] font-mono tracking-[0.16em] uppercase transition-colors ${
                      isCompletedOrActive ? 'text-neutral-200 font-semibold' : 'text-neutral-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Body */}
        <div className="px-6 py-4 flex-1">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-start space-x-2">
              <span className="font-bold">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: PASS */}
          {step === 'PASS' && (
            <div className="space-y-4">
              {/* 3 Pass Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {PASS_LIST.map((option) => {
                  const isSelected = passType === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPassType(option.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/10'
                          : 'border-white/15 bg-white/[0.02] hover:border-white/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-cinzel font-bold text-sm sm:text-base text-white">
                            {option.name}
                          </span>
                          <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                            {option.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-300 mt-1">{option.subtitle}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="text-lg sm:text-xl font-cinzel font-bold text-amber-300">
                          ₹{option.price}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Quantity Stepper */}
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Quantity ({selectedPass.shortName})
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8 rounded-md bg-white/5 border border-white/15 text-white flex items-center justify-center font-mono hover:bg-white/15 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-base text-white w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= 10}
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8 rounded-md bg-white/5 border border-white/15 text-white flex items-center justify-center font-mono hover:bg-white/15 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Have a promo code?"
                    value={promoInput}
                    disabled={Boolean(appliedPromo)}
                    onChange={(e) => {
                      setPromoInput(e.target.value)
                      setPromoError('')
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-amber-400 disabled:opacity-60"
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="px-4 py-2 rounded-lg border border-red-400/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 text-[11px] font-mono uppercase tracking-wider font-bold"
                    >
                      REMOVE
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-amber-400 hover:text-black text-[11px] font-mono uppercase tracking-wider font-bold transition-colors"
                    >
                      APPLY
                    </button>
                  )}
                </div>
                {promoError && (
                  <p className="text-[11px] font-mono text-red-400">{promoError}</p>
                )}
                {appliedPromo && (
                  <p className="text-[11px] font-mono text-emerald-400 font-semibold">
                    ✓ Promo applied: {appliedPromo.code} ({appliedPromo.discountPercent}% OFF)
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between font-mono text-xs">
                <span className="text-neutral-300 uppercase tracking-wider">
                  {quantity} × {selectedPass.shortName}
                </span>
                <div className="flex items-baseline space-x-2">
                  {appliedPromo && (
                    <span className="text-xs text-neutral-500 line-through">
                      ₹{subtotalAmount}
                    </span>
                  )}
                  <span className="text-xl font-cinzel font-bold text-amber-300">₹{totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 'DETAILS' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-300 mb-1.5">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monkey D. Luffy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-300 mb-1.5">
                  Email Address <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="name@example.com (Pass QR sent here)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-300 mb-1.5">
                  Phone Number (WhatsApp) <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 3: VERIFY */}
          {step === 'VERIFY' && (
            <div className="space-y-5 py-2">
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono space-y-1.5">
                <div className="text-neutral-400">VERIFYING EMAIL ADDRESS</div>
                <div className="text-white font-semibold text-sm">{email}</div>
                <p className="text-neutral-400 text-[11px] pt-1">
                  {isSendingOtp
                    ? 'Sending a 4-digit verification code...'
                    : isOtpTestMode
                    ? `Sandbox Preview Mode — enter code: ${generatedOtp}`
                    : 'Enter the 4-digit verification code sent to your email.'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-300">
                    4-Digit Verification Code
                  </label>
                  {isOtpTestMode && generatedOtp && (
                    <button
                      type="button"
                      onClick={() => setOtpInput(generatedOtp)}
                      className="text-[10px] font-mono text-amber-400 hover:underline uppercase tracking-wider"
                    >
                      Auto-fill ({generatedOtp})
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="• • • •"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/15 text-white text-center text-2xl tracking-[0.6em] font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  disabled={isSendingOtp}
                  onClick={sendVerificationOtp}
                  className="text-[11px] font-mono text-neutral-400 hover:text-amber-300 underline"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRM */}
          {step === 'CONFIRM' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/15 bg-black/50 divide-y divide-white/10 font-mono text-xs">
                <div className="p-3.5 flex justify-between">
                  <span className="text-neutral-400 uppercase">Attendee</span>
                  <span className="text-white font-semibold">{name}</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-neutral-400 uppercase">Email</span>
                  <span className="text-white">{email}</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-neutral-400 uppercase">WhatsApp</span>
                  <span className="text-white">{phone}</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-neutral-400 uppercase">Pass Tier</span>
                  <span className="text-amber-300 font-semibold">{quantity} × {selectedPass.shortName}</span>
                </div>
                <div className="p-3.5 flex justify-between">
                  <span className="text-neutral-400 uppercase">Event</span>
                  <span className="text-white">SUN 06 DEC · 5:30 PM – 10:30 PM</span>
                </div>
                {appliedPromo && (
                  <div className="p-3.5 flex justify-between">
                    <span className="text-neutral-400 uppercase">Promo Applied</span>
                    <span className="text-emerald-400 font-semibold">
                      {appliedPromo.code} ({appliedPromo.discountPercent}% OFF)
                    </span>
                  </div>
                )}
                <div className="p-3.5 flex justify-between items-baseline bg-white/[0.02]">
                  <span className="text-neutral-200 font-bold uppercase">Total Payable</span>
                  <div className="flex items-baseline space-x-2">
                    {appliedPromo && (
                      <span className="text-xs text-neutral-500 line-through">
                        ₹{subtotalAmount}
                      </span>
                    )}
                    <span className="text-xl font-cinzel font-bold text-amber-300">₹{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PAY */}
          {step === 'PAY' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-xl border border-white/15 bg-white/[0.02] space-y-4">
                {/* Scan & Pay QR Card */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-white/10">
                  <div className="bg-white p-2 rounded-xl shadow-lg shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/upi-qr.jpg"
                      alt="PhonePe UPI QR - Sekarmantri Anusha"
                      className="w-40 h-40 sm:w-44 sm:h-44 object-contain"
                    />
                  </div>
                  <div className="text-center sm:text-left space-y-1.5">
                    <div className="text-[10px] font-mono tracking-[0.2em] text-emerald-300 uppercase font-bold">
                      SCAN &amp; PAY VIA ANY UPI APP
                    </div>
                    <div className="text-3xl font-cinzel font-bold text-amber-300">
                      ₹{totalAmount}
                    </div>
                    <div className="text-xs font-mono text-white font-semibold">
                      Payee: SEKARMANTRI ANUSHA
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      Scan with PhonePe, GPay, Paytm, or any UPI app. Then enter the 12-digit UTR number and upload your payment screenshot below.
                    </p>
                  </div>
                </div>

                {/* Required UTR Number */}
                <div>
                  <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-300 mb-1.5">
                    UTR / Transaction Number <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 432918273645 (12-digit UTR)"
                    value={utrNumber}
                    onChange={(e) => {
                      setUtrNumber(e.target.value)
                      setErrorMessage('')
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <p className="text-[10px] font-mono text-neutral-400 mt-1">
                    Required: Enter the 12-digit UTR / UPI Ref No. from your payment receipt.
                  </p>
                </div>

                {/* Required UPI Screenshot */}
                <div>
                  <label className="block text-[11px] font-mono tracking-widest uppercase text-neutral-300 mb-1.5">
                    UPI Payment Screenshot <span className="text-amber-400">*</span>
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-amber-400/60 bg-black/40 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-amber-400 mb-1.5" />
                    <span className="text-xs font-mono text-white">
                      {screenshotFileName ? `✓ ${screenshotFileName}` : 'Upload UPI Payment Screenshot (Required)'}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 mt-1">
                      PNG, JPG up to 5MB
                    </span>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          if (file.size > 4 * 1024 * 1024) {
                            setErrorMessage('Screenshot must be under 4MB. Please choose a smaller image.')
                            return
                          }
                          setScreenshotFileName(file.name)
                          setErrorMessage('')
                          const reader = new FileReader()
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setScreenshotBase64(reader.result)
                            }
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: DONE */}
          {step === 'DONE' && completedBooking && (
            <div className="text-center pt-1 pb-2">
              {/* Centered Checkmark Icon */}
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-400/40 shadow-[0_0_25px_rgba(52,211,153,0.3)] flex items-center justify-center mb-4">
                <Check className="w-5 h-5 text-emerald-300 stroke-[2.5]" />
              </div>

              <h3 className="text-3xl sm:text-4xl font-editorial text-white">
                See you Sunday
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-md mx-auto leading-relaxed">
                {completedBooking.quantity} × {PASS_CATALOG[completedBooking.passType || 'OTAKU'].shortName} is with us for{' '}
                <span className="text-white font-medium">{completedBooking.name}</span>.{' '}
                {completedBooking.status === 'in_review'
                  ? "We're checking the UPI screenshot. When it clears, your barcode pass lands in "
                  : 'Your official barcode pass has been sent to '}
                <span className="text-white font-medium">{completedBooking.email}</span>.
              </p>

              {/* Perforated Ticket Reference Card */}
              <div className="mt-6 rounded-xl border border-white/15 bg-black/50 flex flex-col sm:flex-row overflow-hidden text-left">
                {/* Left Section */}
                <div className="p-5 sm:p-6 flex-1">
                  <div className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                    YOUR REFERENCE
                  </div>
                  <div className="text-2xl sm:text-3xl font-cinzel font-semibold tracking-wider text-white mt-1 mb-5 select-all">
                    {completedBooking.passId}
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-6 font-mono">
                    <div>
                      <div className="text-[9px] tracking-[0.2em] text-neutral-400 uppercase">DATE</div>
                      <div className="text-xs text-white font-semibold mt-0.5">SUN 06 DEC</div>
                    </div>
                    <div>
                      <div className="text-[9px] tracking-[0.2em] text-neutral-400 uppercase">DOORS</div>
                      <div className="text-xs text-white font-semibold mt-0.5">5:30 PM</div>
                    </div>
                    <div>
                      <div className="text-[9px] tracking-[0.2em] text-neutral-400 uppercase">PASS</div>
                      <div className="text-xs text-white font-semibold mt-0.5">
                        {completedBooking.quantity} × {PASS_CATALOG[completedBooking.passType || 'OTAKU'].shortName}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] tracking-[0.2em] text-neutral-400 uppercase">TOTAL</div>
                      <div className="text-xs text-white font-semibold mt-0.5">
                        ₹{completedBooking.amount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perforated Dashed Divider + Right Status Stub */}
                <div className="border-t sm:border-t-0 sm:border-l border-dashed border-white/15 p-5 sm:p-6 sm:w-36 flex flex-col items-center justify-center text-center bg-white/[0.01]">
                  <div className="text-[9px] font-mono tracking-[0.22em] text-neutral-400 uppercase">
                    STATUS
                  </div>
                  {completedBooking.status === 'in_review' ? (
                    <>
                      <div className="text-xl font-cinzel font-semibold text-amber-300 mt-1">
                        IN
                      </div>
                      <div className="text-[9px] font-mono tracking-[0.22em] text-neutral-400 uppercase mt-0.5">
                        REVIEW
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-cinzel font-bold text-emerald-400 mt-1 tracking-wider">
                        PASS
                      </div>
                      <div className="text-[9px] font-mono tracking-[0.18em] text-emerald-300/80 uppercase mt-0.5">
                        CONFIRMED
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Copy Reference & Download Pass Actions */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
                <button
                  type="button"
                  onClick={handleCopyReference}
                  className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-300 hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedRef ? 'COPIED TO CLIPBOARD' : 'COPY REFERENCE'}</span>
                </button>
                <a
                  href={`/api/pass-image/${completedBooking.passId}?type=${completedBooking.passType || 'OTAKU'}`}
                  download={`laugh-tale-pass-${completedBooking.passId}.png`}
                  className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-[0.2em] uppercase text-amber-300 hover:text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD PASS</span>
                </a>
              </div>

              <div className="mt-3 text-xs text-neutral-400">
                Questions?{' '}
                <a
                  href="mailto:untold@untoldentertainments.in"
                  className="underline text-neutral-300 hover:text-amber-300"
                >
                  untold@untoldentertainments.in
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer Bar */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.18em] text-neutral-400 uppercase">
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
            <span>PAWFFE, VIZAG</span>
          </div>

          <div className="flex items-center space-x-3">
            {step !== 'PASS' && step !== 'DONE' && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setErrorMessage('')
                  setStep(STEPS[currentStepIndex - 1])
                }}
                className="px-4 py-2 rounded-full border border-white/15 text-neutral-300 hover:text-white hover:border-white/30 text-[11px] font-mono tracking-[0.15em] uppercase transition-colors flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>BACK</span>
              </button>
            )}

            {step === 'PASS' && (
              <button
                type="button"
                onClick={() => setStep('DETAILS')}
                className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-amber-300 text-[11px] font-mono font-bold tracking-[0.18em] uppercase transition-colors flex items-center space-x-1.5"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 'DETAILS' && (
              <button
                type="button"
                onClick={handleNextFromDetails}
                className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-amber-300 text-[11px] font-mono font-bold tracking-[0.18em] uppercase transition-colors flex items-center space-x-1.5"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 'VERIFY' && (
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-amber-300 text-[11px] font-mono font-bold tracking-[0.18em] uppercase transition-colors flex items-center space-x-1.5"
              >
                <span>VERIFY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 'CONFIRM' && (
              <button
                type="button"
                onClick={() => setStep('PAY')}
                className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-amber-300 text-[11px] font-mono font-bold tracking-[0.18em] uppercase transition-colors flex items-center space-x-1.5"
              >
                <span>PROCEED TO PAY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 'PAY' && (
              <button
                type="button"
                disabled={isLoading}
                onClick={handleCompletePayment}
                className="px-6 py-2.5 rounded-full bg-amber-400 text-black hover:bg-white text-[11px] font-mono font-bold tracking-[0.18em] uppercase transition-colors disabled:opacity-50"
              >
                {isLoading ? 'PROCESSING...' : 'SUBMIT PAYMENT'}
              </button>
            )}

            {step === 'DONE' && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full border border-white/25 text-white hover:bg-white hover:text-black text-[11px] font-mono font-bold tracking-[0.2em] uppercase transition-colors"
              >
                DONE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
