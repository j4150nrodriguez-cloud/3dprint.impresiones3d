'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Hexagon, Layers, Zap, ShieldCheck } from 'lucide-react'

const categories = [
  {
    key: 'mascotas',
    label: 'Mascotas',
    tagline: 'CUIDADO & ESTILO',
    description: 'Camas geométricas, comederos y juguetes diseñados para el confort y la estética.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsg2jEfc1ihlrO4RDqMfB1co1PQFQZfIYBwxpBO_ZLvJFIbQC2GImkLt61_P6CM_RoMcoW70_PKrZwYVipLxyfnNmK9_kLzCc5fqmtBeE0zw93DeErvOrz03OPnqAh0vhQl1RcnT572nqQmeVFAiOU9JVr-gbgrX-i7VgZV8DbSdX70NCsOteZVdVdAlVmgRdG67-GrMhUgipth3z1wx5MEcqd6eUjkAbPVqvout-_-bnaWqgmzFGBLJ8zbjDfEB6s4dGBqW15VA',
    colorClass: 'text-filament-orange',
  },
  {
    key: 'cocina',
    label: 'Cocina',
    tagline: 'FUNCIONALIDAD',
    description: 'Organizadores modulares y accesorios ergonómicos que optimizan tu espacio.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOGedFo0O3tk3cOt8gNcWbb5KTT4ZTH1cVhDWkMLv3tLyhqebQDA6UAOEP6p8RUOVzPgLqvC6NC3qSHMfwYJCn3NTAWnQZ0JxjXL0v4-obrVFz82UVnXRzUXb_bizkXDj28e_WXb6OBbSfq0C0E2MTOkS1NMaGfnBuD_ck2-B2aVMJksn0-PurfdW25o6EZpLLjeYkauSLpVVqx0Uvp5zvIdREHhMTkkLKS8RBi_25TQmA5fvdnU9wZYj4Kvd3nDJEfKewumilvw',
    colorClass: 'text-tertiary',
  },
  {
    key: 'corporativo',
    label: 'Corporativo',
    tagline: 'EXCLUSIVIDAD',
    description: 'Trofeos, llaveros y artículos de marca personalizados con precisión quirúrgica.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBnPRjoGbHbqVYtypEcdBdJdDNHifbwRdzUpn19MQA7FXUhzErm4Dapgu-TN9RBiyM_PZ7bwakLP5rh_0BPOKbYqgaNCgOxczAghnEuK0TpJLrCTK-g_xOmsukg-L20WbJvG-q8DjQ8kzfUIom9IZKzByDslRpZMGlREK8sPOk2eQnSB9Vl8KlhR8op-3SFNEC2pPR3ue1Ki9R_zYWUmanWtzSqfLppGRh46mB-S8mlx5oLKLqTlxD3nKhKZYfLHQo36Ajaj3Uow',
    colorClass: 'text-secondary-fixed-dim',
  },
]

const fadeInUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

export default function HomePage() {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  })

  // Simple parallax for the hero image
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 300])

  return (
    <div className="min-h-screen relative z-1 text-on-surface font-body-lg text-body-lg" ref={container}>

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-32 pb-20 px-6 md:px-16 overflow-hidden">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Column content */}
          <motion.div 
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-electric-cyan font-label-caps text-[12px] tracking-wide">
              <Sparkles size={14} className="text-electric-cyan" />
              <span>✦ Impresión FDM / FFF Premium</span>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="glass p-8 md:p-12 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-electric-cyan" />
              <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Objetos únicos <br />
                <span className="text-electric-cyan text-glow">capa por capa</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-8">
                Diseños exclusivos impresos en filamento PLA, PETG y materiales especiales. Mascotas, cocina y regalos corporativos. Cada pieza es una obra de precisión industrial.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link className="px-8 py-4 bg-primary-container text-on-primary-container font-semibold rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-electric-cyan/20 text-center" href="/catalogo">
                  Ver Catálogo →
                </Link>
                <Link className="px-8 py-4 border border-electric-cyan text-electric-cyan font-semibold rounded-lg hover:bg-electric-cyan/5 active:scale-95 transition-all backdrop-blur-sm text-center" href="/catalogo?cat=corporativo">
                  Regalos Empresariales
                </Link>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex gap-12 pt-4">
              <div>
                <p className="font-label-caps text-[12px] text-on-surface-variant mb-1 uppercase tracking-widest">Materiales</p>
                <p className="font-title-md text-lg font-bold text-electric-cyan">PLA · PETG · TPU</p>
              </div>
              <div>
                <p className="font-label-caps text-[12px] text-on-surface-variant mb-1 uppercase tracking-widest">Tecnología</p>
                <p className="font-title-md text-lg font-bold text-electric-cyan">FDM / FFF</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column visual */}
          <motion.div 
            className="relative group flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            style={{ y: heroImageY }}
          >
            <div className="absolute -inset-4 bg-electric-cyan/20 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />
            <div className="relative glass-card w-full max-w-[450px] aspect-square rounded-full flex items-center justify-center p-8 border-white/5 overflow-hidden">
              <img 
                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(0,229,255,0.3)] transition-transform duration-[1.5s] hover:scale-110" 
                alt="3D Printed geometric vase" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQaAl6oIRG4xQ6wKZRbQBRVvmJHc19QNgJ_OKjA4D8wZ7ltFHjPC3iUewl8gP1Dft6wWhsy1D4ZGvdeGZsTEefNTNXppUTb89sh8U0rX6d4zVE-39IGkHlVbiENDT2tsUWXZ1oae4zKUQTpVsvK-AVM0ByU0doDWf0HeKPcrKvZME5k1fiQrBgGbKxrSuItSnTJGkT0CdO5kwG20kjwM_Jq7qBtK_llv4HZLz1wKjPwq1WZTbv7xJ-klmdzRo1NB0qiGLF8LaDIw"
              />
            </div>
            
            {/* Floating Detail Tag */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="absolute top-1/2 -right-4 md:-right-8 glass px-4 py-2 rounded-lg border-white/10 hidden sm:block"
            >
              <p className="font-label-caps text-[12px] text-status-green flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
                Calibración 100%
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-surface-container-lowest/50 backdrop-blur-sm border-y border-white/5">
        <motion.div 
          className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={staggerContainer}
        >
          {[
            ['PLA · PETG · TPU', 'Materiales'],
            ['FDM / FFF', 'Tecnología'],
            ['3 Categorías', 'Nichos'],
            ['100% Colombiano', 'Origen']
          ].map(([val, label]) => (
            <motion.div key={label} variants={fadeInUp} className="text-center py-4">
              <span className="block text-electric-cyan font-bold font-title-md text-xl mb-1">{val}</span>
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-24 px-6 md:px-16 bg-surface/30 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-16 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-headline-lg text-3xl font-semibold mb-4 text-on-surface">Explora por categoría</h2>
            <div className="line-glow mb-4 max-w-xs mx-auto md:mx-0" />
            <p className="font-body-lg text-body-lg text-on-surface-variant">Tres mundos de posibilidades, todos impresos en filamento de alta calidad.</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {categories.map(cat => (
              <motion.div key={cat.key} variants={fadeInUp}>
                <Link 
                  href={`/catalogo?cat=${cat.key}`} 
                  className="group relative h-[500px] rounded-2xl overflow-hidden glass-card flex flex-col justify-end block"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] group-hover:scale-110" 
                    style={{ backgroundImage: `url('${cat.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
                  <div className="absolute bottom-0 p-8 w-full transform transition-transform duration-500 group-hover:translate-y-[-10px] z-10">
                    <span className={`font-label-caps text-[12px] ${cat.colorClass} mb-2 block tracking-wider font-semibold`}>{cat.tagline}</span>
                    <h3 className="font-headline-lg text-2xl font-bold mb-3 text-white">{cat.label}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {cat.description}
                    </p>
                    <span className="inline-flex items-center text-electric-cyan font-semibold group-hover:underline">
                      Ver productos
                      <motion.span 
                        className="ml-1"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        →
                      </motion.span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION (Bento Grid) */}
      <section className="py-24 px-6 md:px-16 bg-transparent">
        <motion.div 
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {/* Headline Card */}
          <motion.div variants={fadeInUp} className="md:col-span-2 glass-card p-12 rounded-3xl flex flex-col justify-center">
            <h2 className="font-headline-lg text-3xl font-semibold mb-6 text-on-surface">¿Por qué elegir 3DPrint?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Fusionamos tecnología de punta con talento local para crear piezas imposibles de fabricar por métodos tradicionales.</p>
          </motion.div>
          
          {/* Feature 1 */}
          <motion.div variants={fadeInUp} className="glass-card p-8 rounded-3xl text-center group">
            <div className="w-16 h-16 bg-electric-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-electric-cyan/20 transition-colors">
              <Hexagon className="text-electric-cyan" size={32} />
            </div>
            <h4 className="font-title-md text-lg font-bold mb-3 text-white">Diseño Personalizado</h4>
            <p className="font-body-sm text-sm text-on-surface-variant">Cada pieza se diseña pensando en tu necesidad específica.</p>
          </motion.div>
          
          {/* Feature 2 */}
          <motion.div variants={fadeInUp} className="glass-card p-8 rounded-3xl text-center group">
            <div className="w-16 h-16 bg-secondary-container/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-container/20 transition-colors">
              <Layers className="text-secondary" size={32} />
            </div>
            <h4 className="font-title-md text-lg font-bold mb-3 text-white">Filamentos Premium</h4>
            <p className="font-body-sm text-sm text-on-surface-variant">PLA, PETG, TPU y materiales de ingeniería avanzados.</p>
          </motion.div>
          
          {/* Feature 3 */}
          <motion.div variants={fadeInUp} className="glass-card p-8 rounded-3xl text-center group">
            <div className="w-16 h-16 bg-status-green/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-status-green/20 transition-colors">
              <Zap className="text-status-green" size={32} />
            </div>
            <h4 className="font-title-md text-lg font-bold mb-3 text-white">Entrega Rápida</h4>
            <p className="font-body-sm text-sm text-on-surface-variant">Producción local en Colombia con tiempos competitivos.</p>
          </motion.div>
          
          {/* Feature 4 */}
          <motion.div variants={fadeInUp} className="glass-card p-8 rounded-3xl text-center group">
            <div className="w-16 h-16 bg-tertiary-container/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-tertiary-container/20 transition-colors">
              <ShieldCheck className="text-tertiary" size={32} />
            </div>
            <h4 className="font-title-md text-lg font-bold mb-3 text-white">Pago Seguro</h4>
            <p className="font-body-sm text-sm text-on-surface-variant">Integración con Wompi para transacciones 100% seguras.</p>
          </motion.div>

          {/* CTA Banner */}
          <motion.div variants={fadeInUp} className="md:col-span-2 bg-primary-container p-12 rounded-3xl flex items-center justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-on-primary-container font-headline-lg text-2xl font-bold mb-2">¿Tienes un proyecto?</h3>
              <p className="text-on-primary-container/80 font-body-lg text-body-lg">Hagamos realidad tu idea en 3D.</p>
            </div>
            <Link className="relative z-10 bg-on-primary-container text-primary-container px-8 py-4 rounded-xl font-bold transition-transform group-hover:scale-105 text-center" href="/catalogo">
              Cotizar Ahora
            </Link>
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
              <Hexagon size={240} className="text-on-primary-container" />
            </div>
          </motion.div>
          
        </motion.div>
      </section>

    </div>
  )
}
