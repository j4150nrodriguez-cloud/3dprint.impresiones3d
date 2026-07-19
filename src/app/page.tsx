import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'

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
  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>✦ Impresión FDM / FFF Premium</span>
            <h1 className={styles.heroTitle}>
              Objetos únicos<br />
              <span className={styles.heroAccent}>capa por capa</span>
            </h1>
            <p className={styles.heroDesc}>
              Diseños exclusivos impresos en filamento PLA, PETG y materiales especiales.
              Mascotas, cocina y regalos corporativos. Cada pieza es una obra de precisión.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/catalogo" className={styles.ctaPrimary}>Ver Catálogo →</Link>
              <Link href="/catalogo?cat=corporativo" className={styles.ctaSecondary}>Regalos empresariales</Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroImageWrap}>
              <Image src="/pet_toy.png" alt="Producto 3D destacado" fill className={styles.heroImage} priority />
            </div>
            <div className={styles.heroDeco1} />
            <div className={styles.heroDeco2} />
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {[['PLA · PETG · TPU', 'Materiales'], ['FDM / FFF', 'Tecnología'], ['3 Categorías', 'Nichos'], ['100% Colombiano', 'Origen']].map(([val, label]) => (
            <div key={label} className={styles.stat}>
              <span className={styles.statVal}>{val}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Explora por categoría</h2>
          <p>Tres mundos de posibilidades, todos impresos en filamento de alta calidad.</p>
        </div>
        <div className={styles.catGrid}>
          {categories.map(cat => (
            <Link href={`/catalogo?cat=${cat.key}`} key={cat.key} className={styles.catCard} style={{ '--cat-color': cat.color } as React.CSSProperties}>
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
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>¿Por qué elegirnos?</h2>
        </div>
        <div className={styles.featGrid}>
          {[
            ['🎯', 'Diseño Personalizado', 'Cada pieza se diseña pensando en tu necesidad específica.'],
            ['🧱', 'Filamentos Premium', 'PLA, PETG, TPU y materiales de ingeniería para cada aplicación.'],
            ['⚡', 'Entrega Rápida', 'Producción local en Colombia con tiempos de entrega competitivos.'],
            ['🔒', 'Pago Seguro', 'Integración con Wompi para transacciones seguras en pesos colombianos.'],
          ].map(([icon, title, desc]) => (
            <div key={title as string} className={styles.featCard}>
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
