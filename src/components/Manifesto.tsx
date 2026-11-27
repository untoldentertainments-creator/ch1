import React from 'react'

export default function Manifesto() {
  const attractions = [
    { name: 'LIVE BAND', highlighted: false },
    { name: 'DJ NIGHT', highlighted: true, color: 'amber' },
    { name: 'ANIME STALLS', highlighted: false },
    { name: 'COSPLAY SHOWCASE', highlighted: false },
    { name: 'GAMING STATIONS', highlighted: false },
    { name: 'CRACKER SHOW', highlighted: false },
    { name: '+ MORE REVEALING SOON', highlighted: true, color: 'sky' },
  ]

  return (
    <section className="py-24 border-b border-white/[0.06] relative" data-purpose="manifesto-section" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Index Identifier */}
        <div className="font-mono text-xs text-amber-400 font-bold tracking-[0.25em] mb-8">
          [ 01 ] WHAT THIS IS
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Manifesto Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-neutral-100 tracking-tight leading-tight">
              An outdoor festival for everyone{' '}
              <span className="font-editorial-italic text-amber-300">dreaming of the Grand Line</span> and raw collective sound.
            </h2>

            <div className="space-y-5 text-neutral-200 text-base sm:text-lg leading-relaxed max-w-3xl font-normal drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              <p>
                LAUGH TALE isn't an awkward convention floor. It's a five-hour explosive open-air anime gathering packed with high-octane DJ performances, live musical acts, curated merchandise booths, gaming zones, and cosplay energy that doesn't hold back.
              </p>
              <p>
                Gates open at 5:30 PM as the sun goes down, lights come alive, and the whole crowd moves as one under the night sky. No corporate fluff—just sound, lights, anime fever, and people who share the exact same obsession.
              </p>
              <p className="text-white font-semibold pt-2 text-lg">
                Bring the crew you actually like. That's the whole guest policy.
              </p>
            </div>

            {/* Attractions Badges Teaser */}
            <div className="pt-4">
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-200 font-bold mb-3">
                CONFIRMED ATTRACTIONS
              </div>
              <div className="flex flex-wrap gap-2.5">
                {attractions.map((attr, idx) => {
                  let badgeStyle = 'bg-white/[0.03] border-white/10 text-neutral-300'
                  if (attr.color === 'amber') {
                    badgeStyle = 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                  } else if (attr.color === 'sky') {
                    badgeStyle = 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300'
                  }
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono border ${badgeStyle}`}
                    >
                      {attr.name}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Manifesto Right Column: Minimalist Numbers */}
          <div className="lg:col-span-4 flex flex-col justify-start lg:pl-12 space-y-10 border-t lg:border-t-0 lg:border-l border-white/15 pt-10 lg:pt-0">
            <div>
              <div className="text-5xl sm:text-6xl font-cinzel font-light text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">5</div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-neutral-200 font-bold mt-1">
                HOURS OF RAW ENERGY
              </div>
            </div>

            <div>
              <div className="text-5xl sm:text-6xl font-cinzel font-light text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">0</div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-neutral-200 font-bold mt-1">
                GATEKEEPING OR ELITISM
              </div>
            </div>

            <div>
              <div className="text-5xl sm:text-6xl font-cinzel font-light text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">∞</div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-neutral-200 font-bold mt-1">
                MEMORIES &amp; HIGH-OCTANE NOSTALGIA
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
