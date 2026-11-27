import React from 'react'

export default function Footer() {
  return (
    <footer className="pt-20 pb-12 bg-[#030508] relative overflow-hidden" data-purpose="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Top Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16 border-b border-white/15">
          {/* Col 1: About Blurb */}
          <div className="md:col-span-2 space-y-4">
            <div className="font-cinzel tracking-[0.2em] text-white font-bold text-lg drop-shadow-sm">UNTOLD</div>
            <p className="text-xs text-neutral-200 leading-relaxed max-w-sm font-normal">
              LAUGH TALE is our December chapter — one Sunday evening, open-air by the beach, and a crowd that came to dive headfirst into the grand line sound. If that sounds like your people, you already know what to do.
            </p>
            <div className="pt-2">
              <a
                className="text-xs font-mono text-amber-300 hover:underline font-bold"
                href="mailto:untold@untoldentertainments.in"
              >
                UNTOLD@UNTOLDENTERTAINMENTS.IN ↗
              </a>
            </div>
          </div>

          {/* Col 2: Social / Contact */}
          <div className="space-y-3">
            <div className="text-[10px] font-mono tracking-widest uppercase text-neutral-200 font-bold">FOLLOW &amp; CONTACT</div>
            <ul className="text-xs font-mono space-y-2 text-neutral-200 font-medium">
              <li>
                <a
                  className="hover:text-amber-300 transition-colors"
                  href="https://www.instagram.com/untold.co_?utm_source=ig_web_button_share_sheet&bqrl=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @UNTOLD.CO_ ↗
                </a>
              </li>
              <li>
                <a className="hover:text-amber-300 transition-colors" href="tel:+917207881635">
                  +91 72078 81635
                </a>
              </li>
              <li>
                <a
                  className="hover:text-emerald-300 transition-colors"
                  href="https://wa.me/917207881635"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WHATSAPP SUPPORT ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Coordinates */}
          <div className="space-y-3">
            <div className="text-[10px] font-mono tracking-widest uppercase text-neutral-200 font-bold">THE DETAILS</div>
            <div className="text-xs font-mono space-y-1 text-white font-semibold">
              <p>SUNDAY, DECEMBER 06</p>
              <p>5:30 PM – 10:30 PM</p>
              <p>PAWFFE, BEACH RD, SAGAR NAGAR, VIZAG</p>
            </div>
            <div className="pt-2">
              <a
                className="text-xs font-mono text-amber-400 hover:text-white transition-colors font-bold"
                href="https://www.google.com/maps/search/?api=1&query=Pawffe,+Beach+Rd,+Gudla+Vani+Palem,+Sagar+Nagar,+Endada,+Visakhapatnam,+Andhra+Pradesh+530045"
                target="_blank"
                rel="noopener noreferrer"
              >
                OPEN IN MAPS ↗
              </a>
            </div>
          </div>
        </div>

        {/* Giant Monolithic Footer Typography Stamp */}
        <div className="pt-12 select-none overflow-hidden text-center">
          <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[13rem] font-cinzel font-black tracking-tight text-white/[0.04] leading-none uppercase">
            LAUGH TALE
          </h2>
        </div>

        {/* Copyright Bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-neutral-400 tracking-wider">
          <div>© 2026 UNTOLD ENTERTAINMENTS. ALL RIGHTS RESERVED.</div>
          <div className="text-center">
            DEVELOPED BY <span className="text-neutral-200 font-semibold">HANISH</span> ·{' '}
            <a
              href="mailto:hanishtompla@gmail.com"
              className="text-amber-300 hover:underline"
            >
              hanishtompla@gmail.com
            </a>{' '}
            ·{' '}
            <a
              href="tel:+919347977703"
              className="text-neutral-200 hover:text-amber-300 hover:underline"
            >
              +91 9347977703
            </a>{' '}
            ·{' '}
            <a
              href="https://www.instagram.com/hanishh.w_w/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:underline"
            >
              @hanishh.w_w ↗
            </a>
          </div>
          <div className="uppercase">THE PARTY FOR THE RIGHT PEOPLE.</div>
        </div>
      </div>
    </footer>
  )
}
