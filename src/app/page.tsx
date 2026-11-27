'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import Manifesto from '@/components/Manifesto'
import Billboard from '@/components/Billboard'
import VenueAndCountdown from '@/components/VenueAndCountdown'
import PassesSection from '@/components/PassesSection'
import HouseRules from '@/components/HouseRules'
import OrganizerProfile from '@/components/OrganizerProfile'
import Footer from '@/components/Footer'
import CheckoutModal from '@/components/CheckoutModal'
import TicketSuccessModal from '@/components/TicketSuccessModal'
import { BookingRecord } from '@/lib/types'
import { PassType } from '@/lib/passes'

export default function Home() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [selectedPassType, setSelectedPassType] = useState<PassType>('OTAKU')
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null)

  const handleOpenCheckout = (passType: PassType = 'OTAKU') => {
    setSelectedPassType(passType)
    setIsCheckoutOpen(true)
  }

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false)
  }

  const handleCheckoutSuccess = (booking: BookingRecord) => {
    setConfirmedBooking(booking)
  }

  const handleCloseSuccess = () => {
    setConfirmedBooking(null)
  }

  return (
    <>
      <Header onOpenCheckout={() => handleOpenCheckout('OTAKU')} />
      <main>
        <Hero onOpenCheckout={() => handleOpenCheckout('OTAKU')} />
        <Ticker />
        <Manifesto />
        <Billboard />
        <VenueAndCountdown />
        <PassesSection onOpenCheckout={handleOpenCheckout} />
        <HouseRules />
        <OrganizerProfile />
      </main>
      <Footer />

      {/* Checkout and Attendee Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        initialPassType={selectedPassType}
        onClose={handleCloseCheckout}
        onSuccess={handleCheckoutSuccess}
      />

      {/* Ticket Confirmation Modal */}
      <TicketSuccessModal
        booking={confirmedBooking}
        onClose={handleCloseSuccess}
      />
    </>
  )
}
