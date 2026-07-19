'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  {
    key: 'mascotas',
    label: '🐾 Mascotas',
    description: 'Accesorios únicos para tus compañeros. Camas geométricas, comederos, juguetes y más.',
    image: '/pet_bed.png',
    color: '#f97316',
  },
  {
    key: 'cocina',
    label: '🍳 Cocina',
    description: 'Organizadores, cortadores de galletas temáticos y accesorios funcionales para el hogar.',
    image: '/kitchen_organizer.png',
    color: '#22c55e',
  },
  {
    key: 'corporativo',
    label: '🏢 Corporativo',
    description: 'Regalos empresariales únicos para fechas especiales. Llaveros, trofeos y artículos con tu marca.',
    image: '/corporate_award.png',
    color: '#a78bfa',
  },
]

export default function HomePage() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Hero Animations
    const heroTl = gsap.timeline()
    
    heroTl.from('.hero-elem', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    })
    
    heroTl.from('.hero-img', {
      scale: 0.9,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
    }, '-=0.8')

    // Stats Animations
    gsap.from('.stat-item', {
      scrollTrigger: {
        trigger: '.stats-container',
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
    })

    // Categories Animations
    gsap.from('.cat-item', {
      scrollTrigger: {
        trigger: '.cat-container',
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    })

    // Features Animations
    gsap.from('.feat-item', {
      scrollTrigger: {
        trigger: '.feat-container',
        start: 'top 80%',
      },
      scale: 0.9,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'back.out(1.5)',
    })
  }, { scope: container })

  return (
    <div className={styles.page} ref={container}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <span className={`${styles.heroBadge} hero-elem`}>✦ Impresión FDM / FFF Premium</span>
            <h1 className={`${styles.heroTitle} hero-elem`}>
              Objetos únicos<br />
              <span className={styles.heroAccent}>capa por capa</span>
            </h1>
            <p className={`${styles.heroDesc} hero-elem`}>
              Diseños exclusivos impresos en filamento PLA, PETG y materiales especiales.
              Mascotas, cocina y regalos corporativos. Cada pieza es una obra de precisión.
            </p>
            <div className={`${styles.heroCtas} hero-elem`}>
              <Link href="/catalogo" className={styles.ctaPrimary}>Ver Catálogo →</Link>
              <Link href="/catalogo?cat=corporativo" className={styles.ctaSecondary}>Regalos empresariales</Link>
            </div>
          </div>
          <div className={`${styles.heroVisual} hero-img`}>
            <div className={styles.heroImageWrap}>
              <Image src="/pet_toy.png" alt="Producto 3D destacado" fill className={styles.heroImage} priority sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className={styles.heroDeco1} />
            <div className={styles.heroDeco2} />
          </div>
        </div>

        {/* Stats */}
        <div className={`${styles.stats} stats-container`}>
          {[['PLA · PETG · TPU', 'Materiales'], ['FDM / FFF', 'Tecnología'], ['3 Categorías', 'Nichos'], ['100% Colombiano', 'Origen']].map(([val, label]) => (
            <div key={label} className={`${styles.stat} stat-item`}>
              <span className={styles.statVal}>{val}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className={`${styles.section} cat-container`}>
        <div className={`${styles.sectionHead} cat-item`}>
          <h2>Explora por categoría</h2>
          <p>Tres mundos de posibilidades, todos impresos en filamento de alta calidad.</p>
        </div>
        <div className={styles.catGrid}>
          {categories.map(cat => (
            <Link href={`/catalogo?cat=${cat.key}`} key={cat.key} className={`${styles.catCard} cat-item`} style={{ '--cat-color': cat.color } as React.CSSProperties}>
              <div className={styles.catImageWrap}>
                <Image src={cat.image} alt={cat.label} fill className={styles.catImage} sizes="(max-width: 768px) 100vw, 33vw" />
                <div className={styles.catOverlay} />
              </div>
              <div className={styles.catInfo}>
                <h3>{cat.label}</h3>
                <p>{cat.description}</p>
                <span className={styles.catLink}>Ver productos →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className={`${styles.section} feat-container`}>
        <div className={`${styles.sectionHead} feat-item`}>
          <h2>¿Por qué elegirnos?</h2>
        </div>
        <div className={styles.featGrid}>
          {[
            ['🎯', 'Diseño Personalizado', 'Cada pieza se diseña pensando en tu necesidad específica.'],
            ['🧱', 'Filamentos Premium', 'PLA, PETG, TPU y materiales de ingeniería para cada aplicación.'],
            ['⚡', 'Entrega Rápida', 'Producción local en Colombia con tiempos de entrega competitivos.'],
            ['🔒', 'Pago Seguro', 'Integración con Wompi para transacciones seguras en pesos colombianos.'],
          ].map(([icon, title, desc]) => (
            <div key={title as string} className={`${styles.featCard} feat-item`}>
              <span className={styles.featIcon}>{icon}</span>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© 2025 3DPrint Impresiones · Hecho con precisión en Colombia 🇨🇴</p>
      </footer>
    </div>
  )
}
