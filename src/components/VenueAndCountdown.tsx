'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function VenueAndCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: '12',
    hours: '04',
    minutes: '30',
    seconds: '00',
  })

  useEffect(() => {
    // Target: Dec 06, 5:30 PM IST
    const now = new Date()
    let year = now.getFullYear()
    let target = new Date(`December 6, ${year} 17:30:00 GMT+0530`)

    // If December 6 has already passed this year, target next year or set minimum
    if (target.getTime() - now.getTime() < 0) {
      target = new Date(`December 6, ${year + 1} 17:30:00 GMT+0530`)
    }

    const updateClock = () => {
      const current = new Date().getTime()
      const diff = target.getTime() - current

      if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24))
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const s = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeLeft({
          days: String(d).padStart(2, '0'),
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(s).padStart(2, '0'),
        })
      }
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-24 border-b border-white/[0.06] relative" data-purpose="venue-and-countdown" id="venue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Index Identifier */}
        <div className="font-mono text-xs text-amber-400 font-bold tracking-[0.25em] mb-8">
          [ 02 ] THE LOCATION &amp; TIME
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Venue Description Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-light text-white tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Held open-air under the night sky at <br />
              <span className="font-cinzel font-bold text-amber-300">PAWFFE, VIZAG</span>
            </h2>

            <p className="text-neutral-100 text-base leading-relaxed font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
              We selected Pawffe for its coastal breeze, open-air outdoor grounds, and raw festival energy. Located right along Beach Road in Sagar Nagar—standing room only, right in front of the speakers and the crowd.
            </p>

            {/* Logistics Information Table */}
            <div className="border border-white/15 rounded-xl divide-y divide-white/10 bg-black/70 backdrop-blur-md shadow-2xl">
              <div className="p-4 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-200 font-bold uppercase tracking-wider">Date &amp; Schedule</span>
                <span className="text-white font-semibold">Sunday, December 06 · 5:30 PM – 10:30 PM</span>
              </div>
              <div className="p-4 flex items-start justify-between text-xs font-mono gap-4">
                <span className="text-neutral-200 font-bold uppercase tracking-wider shrink-0">Exact Venue</span>
                <span className="text-white font-semibold text-right">
                  Pawffe, 2-91, Beach Rd, Gudla Vani Palem, Sagar Nagar, Endada, Vizag 530045
                </span>
              </div>
              <div className="p-4 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-200 font-bold uppercase tracking-wider">Navigation</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Pawffe,+Beach+Rd,+Gudla+Vani+Palem,+Sagar+Nagar,+Endada,+Visakhapatnam,+Andhra+Pradesh+530045"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-white transition-colors underline flex items-center space-x-1 font-bold"
                >
                  <span>Open Google Maps</span>
                  <span>↗</span>
                </a>
              </div>
              <div className="p-4 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-200 font-bold uppercase tracking-wider">Entry Gate</span>
                <span className="text-emerald-400 font-bold">Main Foyer · QR Scan Verification</span>
              </div>
              <div className="p-4 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-200 font-bold uppercase tracking-wider">Dress Code</span>
                <span className="text-amber-300 font-bold">Cosplay / Streetwear / Anime Drip</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Countdown + Atmosphere photo */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            {/* Live Synchronized Countdown Widget */}
            <div className="glass-card rounded-2xl p-6 border border-white/15 bg-black/65 backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/15">
                <span className="text-xs font-mono tracking-widest text-white font-bold uppercase">
                  TIME REMAINING UNTIL GATES OPEN
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>

              {/* Countdown Numbers Grid */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-black/80 border border-white/15 rounded-xl p-3 shadow-inner">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-white">
                    {timeLeft.days}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-bold mt-1">DAYS</div>
                </div>

                <div className="bg-black/80 border border-white/15 rounded-xl p-3 shadow-inner">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-white">
                    {timeLeft.hours}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-bold mt-1">HRS</div>
                </div>

                <div className="bg-black/80 border border-white/15 rounded-xl p-3 shadow-inner">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-white">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-bold mt-1">MIN</div>
                </div>

                <div className="bg-black/80 border border-white/15 rounded-xl p-3 shadow-inner">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-amber-400">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-bold mt-1">SEC</div>
                </div>
              </div>
            </div>

            {/* Secondary Atmospheric Image Card */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 overflow-hidden relative group">
              <div className="relative h-60 sm:h-72 w-full rounded-xl overflow-hidden bg-neutral-900">
                <Image
                  alt="Atmosphere at Laugh Tale"
                  src="/images/atmosphere.jpg"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-75 contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                {/* Bottom caption */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                    ANIME RAVE · DEC 06
                  </div>
                  <div className="text-lg font-editorial-italic text-white">Same energy. Earlier start.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
