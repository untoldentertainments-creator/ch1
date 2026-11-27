'use client'

import React from 'react'

interface HeaderProps {
  onOpenCheckout: () => void
}

export default function Header({ onOpenCheckout }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#05070b]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left brand chapter stamp */}
        <div className="flex items-center space-x-3">
          <span className="font-cinzel tracking-[0.25em] text-white font-bold text-sm">
            UNTOLD
          </span>
          <span className="text-neutral-400 text-xs">/</span>
          <span className="font-mono text-[11px] text-neutral-300 font-bold tracking-wider uppercase">
            CHAPTER 01
          </span>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono uppercase tracking-widest text-neutral-300 font-semibold">
          <a className="hover:text-amber-300 transition-colors duration-200" href="#about">
            About
          </a>
          <a className="hover:text-amber-300 transition-colors duration-200" href="#passes">
            Passes
          </a>
          <a className="hover:text-amber-300 transition-colors duration-200" href="#venue">
            Venue
          </a>
          <a className="hover:text-amber-300 transition-colors duration-200" href="#rules">
            Rules
          </a>
        </nav>

        {/* Right utility items */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-full border border-white/15 bg-black/40 text-[10px] font-mono text-neutral-300 font-semibold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>VIZAG · IST</span>
          </div>
          <button
            onClick={onOpenCheckout}
            className="px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase text-neutral-200 border border-white/20 rounded-md hover:bg-white hover:text-black hover:border-white transition-all duration-200"
          >
            Get Pass
          </button>
        </div>
      </div>
    </header>
  )
}
