import type { Metadata } from 'next'
import { Cinzel, Instrument_Serif, Plus_Jakarta_Sans, Space_Mono, Bebas_Neue } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '700', '800', '900'],
  variable: '--font-cinzel',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas-neue',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'LAUGH TALE by UNTOLD — Dec 06 Pawffe Vizag',
  description: 'The party for the right people. An anime voyage into the clouds. Sunday, Dec 06 at Pawffe, Beach Rd, Sagar Nagar, Vizag.',
  keywords: ['LAUGH TALE', 'UNTOLD', 'Anime Festival', 'Pawffe', 'Pawffe Vizag', 'Vizag Events', 'Visakhapatnam', 'Cosplay', 'Anime Party'],
  openGraph: {
    title: 'LAUGH TALE by UNTOLD — Dec 06 Pawffe Vizag',
    description: 'The party for the right people. An anime voyage into the clouds. Sunday, Dec 06 at Pawffe, Beach Rd, Sagar Nagar, Vizag.',
    images: ['/images/poster.jpg'],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${cinzel.variable} ${instrumentSerif.variable} ${plusJakartaSans.variable} ${spaceMono.variable} ${bebasNeue.variable}`}
    >
      <body className="font-sans antialiased text-neutral-300 selection:bg-amber-400 selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  )
}
