import React from 'react'
import Link from 'next/link'
import { Check, Download, MapPin } from 'lucide-react'
import { getBookingByPassId } from '@/lib/storage'
import { getPassOption } from '@/lib/passes'
import PrintButton from './PrintButton'

interface TicketPageProps {
  params: Promise<{
    passId: string
  }>
}

const STEPS = ['PASS', 'DETAILS', 'VERIFY', 'CONFIRM', 'PAY', 'DONE']

export default async function TicketPage({ params }: TicketPageProps) {
  const { passId } = await params
  const booking = getBookingByPassId(passId)

  return (
    <div className="min-h-screen bg-[#05070b] text-white flex flex-col items-center justify-center p-3 sm:p-6 relative selection:bg-amber-400 selection:text-black">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#070910]/95 shadow-2xl z-10 my-4 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-[0.22em] text-neutral-400 uppercase">
              LAUGH TALE · DEC 06 · PAWFFE, VIZAG
            </div>
            <h1 className="text-2xl sm:text-3xl font-editorial text-white mt-1 tracking-tight">
              You&apos;re on the list
            </h1>
          </div>
        </div>

        {/* 6-Step Progress Bar */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {STEPS.map((label) => (
              <div key={label} className="flex flex-col">
                <div className="h-[2px] w-full rounded-full bg-white" />
                <span className="mt-2 text-[9px] sm:text-[10px] font-mono tracking-[0.16em] uppercase text-neutral-200 font-semibold">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-400/40 shadow-[0_0_25px_rgba(52,211,153,0.3)] flex items-center justify-center mb-4">
            <Check className="w-5 h-5 text-emerald-300 stroke-[2.5]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-editorial text-white">See you Sunday</h2>

          <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-md mx-auto leading-relaxed">
            {booking?.quantity || 1} × {getPassOption(booking?.passType).shortName} is with us for{' '}
            <span className="text-white font-medium">{booking?.name || 'Grand Line Crew'}</span>.{' '}
            {booking?.status === 'in_review'
              ? "We're checking the UPI screenshot. When it clears, your barcode pass lands in "
              : 'Your official barcode pass has been sent to '}
            <span className="text-white font-medium">
              {booking?.email || 'your registered email'}
            </span>
            .
          </p>

          {/* Perforated Ticket Reference Card */}
          <div className="mt-6 rounded-xl border border-white/15 bg-black/50 flex flex-col sm:flex-row overflow-hidden text-left">
            <div className="p-5 sm:p-6 flex-1">
              <div className="text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
                YOUR REFERENCE
              </div>
              <div className="text-2xl sm:text-3xl font-cinzel font-semibold tracking-wider text-white mt-1 mb-5 select-all">
                {passId.toUpperCase()}
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
                    {booking?.quantity || 1} × {getPassOption(booking?.passType).shortName}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] tracking-[0.2em] text-neutral-400 uppercase">TOTAL</div>
                  <div className="text-xs text-white font-semibold mt-0.5">
                    ₹{booking?.amount || 549}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-dashed border-white/15 p-5 sm:p-6 sm:w-36 flex flex-col items-center justify-center text-center bg-white/[0.01]">
              <div className="text-[9px] font-mono tracking-[0.22em] text-neutral-400 uppercase">
                STATUS
              </div>
              {booking?.status === 'in_review' ? (
                <>
                  <div className="text-xl font-cinzel font-semibold text-amber-300 mt-1">IN</div>
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

          <div className="mt-4 text-xs text-neutral-400">
            Questions?{' '}
            <a
              href="mailto:untold@untoldentertainments.in"
              className="underline text-neutral-300 hover:text-amber-300"
            >
              untold@untoldentertainments.in
            </a>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.18em] text-neutral-400 uppercase">
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
            <span>PAWFFE, VIZAG</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <a
              href={`/api/pass-image/${passId}?type=${booking?.passType || 'OTAKU'}`}
              download={`laugh-tale-pass-${passId.toUpperCase()}.png`}
              className="px-4 py-2.5 rounded-full bg-amber-400 text-black hover:bg-white text-[11px] font-mono font-bold tracking-[0.15em] uppercase transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PASS PNG</span>
            </a>
            <PrintButton />
            <Link
              href="/"
              className="px-6 py-2.5 rounded-full border border-white/25 text-white hover:bg-white hover:text-black text-[11px] font-mono font-bold tracking-[0.2em] uppercase transition-colors text-center"
            >
              DONE
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
