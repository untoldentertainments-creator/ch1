import React from 'react'

export default function Ticker() {
  const tickerItems = [
    'SUN 06 DEC',
    '5:30 – 10:30 PM',
    'PAWFFE',
    'UNTOLD PRESENTS',
    'LAUGH TALE',
    'LIVE BAND & DJ NIGHT',
    'ANIME STALLS',
    'COSPLAY SHOWCASE',
    'GAMES & CRACKER SHOW',
  ]

  return (
    <div className="border-y border-white/[0.08] bg-[#070b12] overflow-hidden py-3" data-purpose="announcement-ticker">
      <div className="flex whitespace-nowrap marquee-inner">
        <div className="flex items-center space-x-8 text-xs font-mono tracking-[0.25em] uppercase text-neutral-200 font-bold shrink-0">
          {tickerItems.map((item, idx) => (
            <React.Fragment key={`ticker-1-${idx}`}>
              <span className={item === 'LAUGH TALE' ? 'text-amber-300 font-extrabold' : ''}>{item}</span>
              <span className="text-amber-400">•</span>
            </React.Fragment>
          ))}
        </div>
        {/* Duplicate for continuous loop */}
        <div className="flex items-center space-x-8 text-xs font-mono tracking-[0.25em] uppercase text-neutral-200 font-bold shrink-0 pl-8">
          {tickerItems.map((item, idx) => (
            <React.Fragment key={`ticker-2-${idx}`}>
              <span className={item === 'LAUGH TALE' ? 'text-amber-300 font-extrabold' : ''}>{item}</span>
              <span className="text-amber-400">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
