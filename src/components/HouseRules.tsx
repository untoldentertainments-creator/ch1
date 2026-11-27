import React from 'react'

const RULES_LIST = [
  'No ticket sharing or duplication.',
  'Re-entry is not allowed.',
  'Follow the event timings (5:30 PM – 10:30 PM).',
  "Respect people's privacy.",
  'Fighting, bullying and harassment will not be tolerated.',
  'Respect the core team (founder, co-founders, volunteers).',
  'No damaging event property.',
  'Follow instructions from security and event organisers.',
  'Alcohol, smoking and vaping is strictly prohibited.',
  'Outside food and beverages are not allowed.',
  'Keep the venue clean.',
]

export default function HouseRules() {
  return (
    <section className="py-24 border-b border-white/[0.06] relative" data-purpose="house-rules" id="rules">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Index Identifier */}
        <div className="font-mono text-xs text-amber-400 font-bold tracking-[0.25em] mb-8">
          [ 04 ] HOUSE RULES
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Rules Headline & Statement Left */}
          <div className="lg:col-span-5 space-y-5">
            <h2 className="text-4xl sm:text-5xl font-light text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              House rules. <br />
              <span className="font-editorial-italic text-amber-300">Keep the vibe safe.</span>
            </h2>
            <blockquote className="text-neutral-100 text-sm leading-relaxed max-w-md pt-1 font-medium drop-shadow-sm border-l-2 border-emerald-400/60 pl-4">
              &ldquo;Our goal is to create a safe, inclusive and enjoyable environment for every anime fan. All attendees are expected to respect one another, follow event regulations and cooperate with the organising team. Violation of serious rules may result in removal from the venue without a refund.&rdquo;
            </blockquote>
          </div>

          {/* Rules List Card Right */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/15 bg-black/70 backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300 font-bold">
                  EVENT CODE OF CONDUCT
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                  ZERO TOLERANCE
                </span>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs sm:text-sm text-neutral-100 font-medium">
                {RULES_LIST.map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="w-5 h-5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-snug">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
