import type { Metadata } from 'next'
import './globals.css'

function getSafeMetadataBase(): URL {
  const raw = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').trim()
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    return new URL(withProtocol)
  } catch {
    return new URL('http://localhost:3000')
  }
}

export const metadata: Metadata = {
  metadataBase: getSafeMetadataBase(),
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800;900&family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-neutral-300 selection:bg-amber-400 selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  )
}
