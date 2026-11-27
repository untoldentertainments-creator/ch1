import React from 'react'

export default function Billboard() {
  return (
    <section
      className="relative py-24 md:py-32 bg-black/35 backdrop-blur-[2px] overflow-hidden border-y border-white/[0.08]"
      data-purpose="giant-billboard"
    >
      {/* Soft ambient emerald & amber glow blending seamlessly with the background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.10)_0%,rgba(245,158,11,0.06)_35%,transparent_75%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-[0.3em] uppercase text-emerald-300/90 border border-emerald-400/25 rounded-full px-3.5 py-1 bg-black/40 mb-5">
          <span>DEC 06</span>
          <span className="text-amber-400">•</span>
          <span>5:30 PM – 10:30 PM</span>
          <span className="text-amber-400">•</span>
          <span>PAWFFE, VIZAG</span>
        </div>

        {/* Giant Editorial Centerpiece Title */}
        <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-cinzel font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-400 drop-shadow-[0_0_35px_rgba(245,158,11,0.3)] leading-none select-none uppercase">
          LAUGH TALE
        </h2>

        <p className="font-mono text-xs sm:text-base md:text-lg tracking-[0.35em] sm:tracking-[0.45em] text-white font-bold uppercase mt-5 md:mt-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          THE PARTY FOR THE RIGHT PEOPLE.
        </p>

        <p className="font-editorial-italic text-neutral-100 text-lg sm:text-xl mt-3 max-w-xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] font-medium">
          &ldquo;One piece of advice: bring your stamina, wear your best fit, and leave nothing behind.&rdquo;
        </p>
      </div>
    </section>
  )
}
