'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function InteractiveBackground() {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return
      const x = e.clientX
      const y = e.clientY
      bgRef.current.style.setProperty('--mouse-x', `${x}px`)
      bgRef.current.style.setProperty('--mouse-y', `${y}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)

    const ctx = gsap.context(() => {
      gsap.to('.bg-orb-1', {
        x: '5vw', y: '10vw', scale: 1.1,
        duration: 8, ease: 'sine.inOut', repeat: -1, yoyo: true
      })
      gsap.to('.bg-orb-2', {
        x: '-5vw', y: '-10vw', scale: 1.2,
        duration: 10, ease: 'sine.inOut', repeat: -1, yoyo: true
      })
      gsap.to('.bg-orb-3', {
        x: '8vw', y: '-8vw', scale: 0.95,
        duration: 12, ease: 'sine.inOut', repeat: -1, yoyo: true
      })
    }, bgRef)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      ctx.revert()
    }
  }, [])

  return (
    <div ref={bgRef} className="fixed inset-0 z-[-1] overflow-hidden bg-surface pointer-events-none">
      {/* Base Dotted Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] bg-center [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,1)_30%,rgba(0,0,0,0)_80%)]" />
      
      {/* Interactive Hover Grid Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,229,255,0.45)_1.5px,transparent_1.5px)] bg-[size:32px_32px] bg-center [mask-image:radial-gradient(circle_120px_at_var(--mouse-x,-999px)_var(--mouse-y,-999px),rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)]" />

      {/* Glowing Orbs */}
      <div className="bg-orb-1 absolute -top-24 -left-24 w-[500px] h-[500px] bg-electric-cyan/15 rounded-full blur-[120px] transform translate-z-0" />
      <div className="bg-orb-2 absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-secondary-container/10 rounded-full blur-[120px] transform translate-z-0" />
      <div className="bg-orb-3 absolute top-[30%] left-[25%] w-[450px] h-[450px] bg-tertiary-container/5 rounded-full blur-[110px] transform translate-z-0" />
    </div>
  )
}
