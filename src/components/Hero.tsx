'use client'

import React from 'react'
import Image from 'next/image'

interface HeroProps {
  onOpenCheckout: () => void
}

export default function Hero({ onOpenCheckout }: HeroProps) {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden" data-purpose="hero-banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Column: Editorial Announcement */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Breadcrumb Badge */}
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-neutral-300 border border-white/15 rounded-full px-3 py-1 bg-black/40 backdrop-blur-sm w-fit shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="tracking-widest uppercase">UNTOLD ENTERTAINMENTS · CHAPTER 01</span>
            </div>

            {/* Massive Stylized Title */}
            <div className="space-y-1">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-cinzel font-black tracking-tight text-white uppercase leading-[0.88] select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                LAUGH<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-white">
                  TALE
                </span>
              </h1>
              <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-neutral-300 font-semibold pt-2 drop-shadow-sm">
                BY UNTOLD ENTERTAINMENTS
              </p>
            </div>

            {/* Editorial Tagline */}
            <div className="pt-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                The party for the right people.{' '}
                <span className="font-editorial-italic text-amber-300 text-3xl sm:text-4xl md:text-5xl font-normal block sm:inline drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                  An anime voyage into the clouds.
                </span>
              </h2>
            </div>

            {/* Narrative Copy */}
            <p className="text-neutral-100 text-sm sm:text-base leading-relaxed max-w-xl font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              Sunday evening, five hours, open-air at Pawffe. Live band, DJ night, high energy anime anthems, cosplay showcase, gaming stalls, and absolute zero compromise on vibes.
            </p>

            {/* Pill Information Bar */}
            <div className="py-2.5 px-4 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 max-w-lg shadow-md">
              <p className="text-[11px] sm:text-xs font-mono text-white font-medium">
                Curated music, anime stalls, food, and high-frequency community energy.
              </p>
            </div>

            {/* Hero Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onOpenCheckout}
                className="inline-flex items-center justify-center px-7 py-3 text-xs font-mono uppercase tracking-[0.2em] font-semibold text-black bg-white rounded-md hover:bg-amber-300 transition-colors shadow-lg shadow-white/10"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                GET PASSES
              </button>
              <a
                className="inline-flex items-center justify-center px-7 py-3 text-xs font-mono uppercase tracking-[0.2em] font-medium text-neutral-300 border border-white/15 rounded-md hover:border-amber-300 hover:text-white transition-colors bg-white/[0.02]"
                href="#venue"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                THE VENUE
              </a>
            </div>

            {/* Meta Quick Details Line */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold border-t border-white/15">
              <div><span className="text-amber-400 font-extrabold mr-1">DATE:</span> SUN 06 DEC</div>
              <div><span className="text-amber-400 font-extrabold mr-1">HOURS:</span> 5:30 – 10:30 PM</div>
              <div><span className="text-amber-400 font-extrabold mr-1">LOCATION:</span> PAWFFE, VIZAG</div>
            </div>
          </div>

          {/* Hero Right Column: Angled Official Poster Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md group">
              {/* Glow accent behind poster */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500/20 via-sky-500/20 to-amber-300/10 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>

              {/* Poster Presentation Box */}
              <div className="relative glass-card rounded-2xl p-3 border border-white/15 overflow-hidden shadow-2xl">
                <div className="relative aspect-[1005/1565] w-full rounded-xl overflow-hidden bg-neutral-950">
                  <Image
                    alt="LAUGH TALE Official Poster by UNTOLD"
                    src="/images/poster.jpg"
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    priority
                    className="w-full h-full object-cover rounded-lg transform transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Poster overlay vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

                  {/* Floating badge inside poster preview */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-300 uppercase px-3 py-1.5 rounded bg-black/60 backdrop-blur-md border border-white/10">
                    <span className="text-amber-400 font-bold">LIMITED ACCESS</span>
                    <span>DEC 06 · PAWFFE</span>
                  </div>
                </div>

                {/* Card footer label */}
                <div className="mt-3 flex items-center justify-between px-2 text-[10px] font-mono tracking-widest text-neutral-200 font-bold uppercase">
                  <span>THE POSTER</span>
                  <span className="text-neutral-400">•</span>
                  <span>DEC 06</span>
                  <span className="text-neutral-400">•</span>
                  <span>VIZAG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
