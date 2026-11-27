'use client'

import React from 'react'
import { PASS_LIST, PassType } from '@/lib/passes'

interface PassesSectionProps {
  onOpenCheckout: (passType?: PassType) => void
}

export default function PassesSection({ onOpenCheckout }: PassesSectionProps) {
  const sharedPerks = [
    'Guaranteed entry from 5:30 PM onwards',
    'Full access to Live Band & high-voltage DJ Night sets',
    'Anime merch stalls, cosplay showcase & gaming zones',
    'Barcode pass delivered to email',
  ]

  return (
    <section className="py-24 border-b border-white/[0.06] relative" data-purpose="ticketing-passes" id="passes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Index Identifier */}
        <div className="font-mono text-xs text-amber-400 font-bold tracking-[0.25em] mb-4">
          [ 03 ] THE PASSES
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl font-light text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Three tiers. <span className="font-editorial-italic text-amber-300">Claim your bounty.</span>
            </h2>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-xs text-neutral-200 font-mono font-medium">
              Early Bird tier is the lowest rate — price increases as tiers fill up.
            </p>
            <div className="flex items-center space-x-4 mt-2 text-[10px] font-mono text-neutral-200 font-bold">
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span> EMAIL VERIFIED
              </span>
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span> INSTANT PASS HOLD
              </span>
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span> BARCODE ENTRY
              </span>
            </div>
          </div>
        </div>

        {/* 3 Pass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PASS_LIST.map((pass, idx) => {
            const isFeatured = pass.id === 'TWINFLAME'
            return (
              <div
                key={pass.id}
                className={`glass-card rounded-2xl p-7 bg-black/75 backdrop-blur-md relative shadow-2xl glass-card-hover flex flex-col justify-between ${
                  isFeatured
                    ? 'border-2 border-amber-400/70'
                    : 'border border-white/15'
                }`}
              >
                <div>
                  {/* Tier Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[11px] text-neutral-200 font-bold uppercase tracking-widest">
                      0{idx + 1} / {pass.admits}
                    </span>
                    <span className="px-3 py-1 text-[10px] font-mono tracking-widest text-amber-300 bg-amber-400/15 border border-amber-400/40 rounded-full font-bold uppercase shadow-sm">
                      {pass.badge}
                    </span>
                  </div>

                  {/* Pass Title & Price */}
                  <div className="border-b border-white/15 pb-5 mb-5">
                    <h3 className="text-2xl font-cinzel font-bold text-white tracking-wide uppercase">
                      {pass.name}
                    </h3>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-4xl font-cinzel font-extrabold text-amber-300">
                        ₹{pass.price}
                      </span>
                      <span className="text-xs font-mono text-neutral-200 font-bold tracking-wider uppercase">
                        / {pass.admits}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-200 mt-2 font-medium">
                      {pass.subtitle}
                    </p>
                  </div>

                  {/* Detailed Perks Checklist */}
                  <div className="space-y-3 mb-7 text-xs font-mono text-white font-medium">
                    {sharedPerks.map((perk, index) => (
                      <div key={index} className="flex items-start space-x-2.5">
                        <span className="text-amber-400 font-bold">✓</span>
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  <button
                    onClick={() => onOpenCheckout(pass.id)}
                    className={`w-full py-3.5 px-5 rounded-lg font-mono font-bold text-xs uppercase tracking-[0.22em] transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                      isFeatured
                        ? 'bg-amber-400 text-black hover:bg-white shadow-xl shadow-amber-400/25'
                        : 'bg-white text-black hover:bg-amber-400 shadow-lg shadow-white/10'
                    }`}
                  >
                    BUY {pass.shortName} — ₹{pass.price}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Assurance Text */}
        <div className="text-center text-xs font-mono text-neutral-300 font-medium mt-8">
          Passes are issued in strictly limited batches. Contact:{' '}
          <a className="underline hover:text-amber-300 text-white font-semibold" href="mailto:untold@untoldentertainments.in">
            untold@untoldentertainments.in
          </a>
        </div>
      </div>
    </section>
  )
}
