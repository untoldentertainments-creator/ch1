import React from 'react'
import Image from 'next/image'

export default function OrganizerProfile() {
  return (
    <section className="py-24 border-b border-white/[0.06] relative" data-purpose="organizer-profile">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Organizer Official Logo Card Left */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md group">
              <div className="glass-card rounded-2xl p-8 border border-white/15 flex items-center justify-center relative overflow-hidden bg-black/75 backdrop-blur-md shadow-2xl">
                <div className="relative w-64 h-32 sm:w-72 sm:h-36">
                  <Image
                    alt="UNTOLD Official Logo"
                    src="/images/untold-logo.png"
                    fill
                    sizes="(max-width: 768px) 250px, 300px"
                    className="object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-3 text-center text-[10px] font-mono tracking-widest text-neutral-200 font-bold uppercase">
                  OFFICIAL EVENT ORGANIZER
                </div>
              </div>
            </div>
          </div>

          {/* Organizer Manifesto Statement Right */}
          <div className="lg:col-span-7 space-y-6">
            <div className="font-mono text-xs text-amber-400 font-bold tracking-[0.25em]">
              [ 05 ] PRODUCED BY
            </div>

            <h3 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              UNTOLD ENTERTAINMENTS
            </h3>

            <p className="text-neutral-100 text-sm sm:text-base leading-relaxed font-normal drop-shadow-sm">
              UNTOLD is a culture collective creating experiential gatherings across sound, anime, art, and high-frequency community. LAUGH TALE is our December chapter — the grand voyage we&apos;ve been teasing on the grid all season long.
            </p>

            <blockquote className="font-editorial-italic text-2xl sm:text-3xl text-amber-300 pt-2 border-l-2 border-amber-400 pl-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              &ldquo;Something different. Something big.&rdquo;
            </blockquote>

            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono tracking-widest text-neutral-200 font-bold uppercase">
              <a
                className="hover:text-amber-300 transition-colors flex items-center"
                href="https://www.instagram.com/untold.co_?utm_source=ig_web_button_share_sheet&bqrl=ZDNlZDc0MzIxNw=="
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>INSTAGRAM (@UNTOLD.CO_)</span>
                <span className="ml-1 text-[10px]">↗</span>
              </a>
              <span>•</span>
              <a className="hover:text-emerald-300 transition-colors flex items-center" href="tel:+917207881635">
                <span>+91 72078 81635</span>
              </a>
              <span>•</span>
              <a className="hover:text-amber-300 transition-colors flex items-center" href="#passes">
                <span>OFFICIAL CHAPTER 01</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
