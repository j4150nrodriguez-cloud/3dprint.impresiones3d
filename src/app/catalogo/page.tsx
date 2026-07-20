import Link from 'next/link'
import Image from 'next/image'
import { getSupabase } from '@/lib/supabase'
import TarjetaProducto from '@/components/TarjetaProducto'
import { Box, Dog, Utensils, Briefcase } from 'lucide-react'

interface Props {
  searchParams: Promise<{ cat?: string }>
}

export const dynamic = 'force-dynamic'

const bannerInfo = {
  todos: {
    tagline: 'INDUSTRIAL MANUFACTURING',
    title: 'Catálogo de Precisión',
    description: 'Explora nuestra colección de componentes de ingeniería y diseños premium, fabricados con tolerancias de grado micrónico y materiales de alta resistencia.',
    img1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXZntETjUg9pQvJGaomfoS1qyuZkKenL69B0PqkqlEIfzjo8r7nSKpayqXfCTsko0NUmxHXbdjnQ38ocThzAUPMXFDifoCiXrtGug42csLplAt3td28paP7pxNPpo6AJV2XeCJoofgp-ou0chZTf8thvA7LKtpHGRsiczV67ejXFXmGJsebZui3h9TS9LN-pUde1rRK2v7iYrcmB0PxS0HPNGf_Nh9vinxQzfFfbQMs90uTNR37VcDEu-srILO4hF2g660E8pVxw',
    img2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWjoROknNoHMeyfv4XBVMnaF-tLGqFTAjUtIBA2wIpE0eKKm1IYnU2Teub5fF9H3ScDgX4eSkYpinN1V88czv0-h4r_uo_MbstpZyZQwcL3ey9CduQmGlm-CnFKSmtHQtbUAhp_l3a9bICyEiqIGsAhgLGe7-4jInXNhpEOVIrbyQsLUunIq4AbU18lTK-FcPNM-7SzpR8KZx3EjYJb7_ljEM1VFFwQLAhkU6H3TTL4clioqzfzYv4JWQe36Q5CAChkKOaI4j-7Q'
  },
  mascotas: {
    tagline: 'NUEVA COLECCIÓN MASCOTAS',
    title: 'Cuidado & Estilo Geométrico',
    description: 'Elevamos el entorno de tu mascota con ingeniería de precisión. Nuestra línea de accesorios modulares utiliza fabricación aditiva de alto rendimiento para fusionar ergonomía animal y estética brutalista.',
    img1: 'https://lh3.googleusercontent.com/aida/AP1WRLvAF0f2E9IbJBz46OUdo3dKrgDNxrnvH0mo3zCahcie_DhXX4zsrxYHKpVhKh0wY3h5NP0r_deuVueuqVtmmyzVup4FsUXhNs2kAzUoD_QnsuuFupOccPjKgESZy4W-WBQgOmNryiwTkJB8Np3LST_7l_VngkDZIDYY6EbC4b1Zep4YdDGxxdD6YiUZ9qqb10ZzFIGEVw4tF23K4kAdG8yqvHC1lzRmHBbgICImpKrdU1ehSabvNag6',
    img2: 'https://lh3.googleusercontent.com/aida/AP1WRLtv5UlovWSV7W_fiMcMOIu8E6Guz0y1v4sj8EDYPMtp7XKfsBRkRlH5J82owlAJR48vtCtcvXfKMay32D4MojcH-6LYrBL9fuhvn3CLsSeK34CkVgTxx3kRcG2w-cSwn1mfZYoR_lin7WD9K6NPxHkdmEyn5F19q1HVS5BdCUHJH7mxaQsh7Y6Sy2FmmGlhdwKPOSlXoEjEHBZWPBC7gP843qKpbUly9oGZgnn2Y-91nj3LoAjfzlsMTg'
  },
  cocina: {
    tagline: 'COCINA INDUSTRIAL',
    title: 'Funcionalidad & Precisión',
    description: 'Soluciones modulares de fabricación aditiva diseñadas para optimizar el flujo de trabajo culinario. Ingeniería de precisión aplicada al entorno doméstico más exigente.',
    img1: 'https://lh3.googleusercontent.com/aida/AP1WRLsPW2kXH-eikuXp8NNQZ0O0jlk7jxvj_fKA_BDg0Xr_NcZEOYFcEZ-ToPoF5jexgp_BVPO9BiZ_PRyEXJUZ3vNX9un5rYu4eT8K08vLNZDEBGCgkJTsW1ThL_Ahe-TQxfNvw0YZZ0g8eA054xs4gUzN1y6Fj--c65yjiPqG6YOleQlxOopxTxa9ybk-FigqagzPljvFYBauGGPM1nEsB5SpJiMXItky9P2GKupJUmxwYJBhDTnKf5MxPg',
    img2: 'https://lh3.googleusercontent.com/aida/AP1WRLuTFB7_j222tycGRVGc7SgpP-Taw8_Af5-odZ_nbP0DUX2Zcz_Xv6spQ3osr7UN_HS0MwbzaQ4ahqaC9uKNvMwqtpmS_jfWbZZPLcvO9GuNT15G6MDng-tu233qzC1IsjEEy-shqDfQDdydrPWHYHaMxNOzorQZ4fUrNYfzuBbxRLDmAN1h9hhTsU5to22N3PF_kkA6e9wECYae9F7HzyWHkOZMEz8pZzv6GcvBDk4_jOkGiqHV4YYo'
  },
  corporativo: {
    tagline: 'INDUSTRIAL EXCELLENCE 2025',
    title: 'Exclusividad & Identidad Corporativa',
    description: 'Elevating institutional heritage through precision-engineered trophies and premium corporate artifacts. We merge additive manufacturing innovation with the timeless allure of gold silk finishing.',
    img1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWjoROknNoHMeyfv4XBVMnaF-tLGqFTAjUtIBA2wIpE0eKKm1IYnU2Teub5fF9H3ScDgX4eSkYpinN1V88czv0-h4r_uo_MbstpZyZQwcL3ey9CduQmGlm-CnFKSmtHQtbUAhp_l3a9bICyEiqIGsAhgLGe7-4jInXNhpEOVIrbyQsLUunIq4AbU18lTK-FcPNM-7SzpR8KZx3EjYJb7_ljEM1VFFwQLAhkU6H3TTL4clioqzfzYv4JWQe36Q5CAChkKOaI4j-7Q',
    img2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYsmvTAer_e1hQusYwYGL_mr7zwnmPl1BScNmI_qXC2XtDmXassJYynGb6e8m5lVQhxZ7KIdM74KwDKjrjV2Vj9YYc1Qwne6S8OiEvuZszyITI8ZaXyh_9XRKRLCDSoBUxsvJ-PGTW8M6v8zu6EpQFKMF5yrjI8sWh9S7sEJxfaSgbjr_7_BPpHqHbH3LGaJ34Al14sBk8kGInLxXnwZNGKbWBRUE1XDLfYG1yPMCoCTh8VXHzXLqSYucBEYr1Um7m5UhRtXzoOw'
  }
}

export default async function CatalogoPage({ searchParams }: Props) {
  const supabase = getSupabase()
  const params = await searchParams
  const cat = params?.cat

  let query = supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false })
  if (cat) query = query.eq('category', cat)

  const { data: products, error } = await query

  const currentBanner = bannerInfo[cat as keyof typeof bannerInfo] || bannerInfo.todos

  return (
    <div className="min-h-screen text-on-surface pt-32 pb-12 px-6 md:px-16 max-w-[1440px] mx-auto">
      
      {/* Dynamic Header / Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <div className="flex items-center gap-4 mb-4 animate-fade-in">
            <span className="h-[1px] w-12 bg-electric-cyan" />
            <span className="font-label-caps text-xs text-electric-cyan tracking-[0.2em] uppercase">
              {currentBanner.tagline}
            </span>
          </div>
          <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-glow text-white leading-tight">
            {currentBanner.title}
          </h1>
          <p className="text-on-surface-variant font-body-lg max-w-2xl text-base md:text-lg leading-relaxed">
            {currentBanner.description}
          </p>
        </div>

        {/* Header Preview Images */}
        <div className="grid grid-cols-2 gap-4 h-[250px] md:h-[300px]">
          <div className="relative glass-card rounded-xl overflow-hidden aspect-square h-full w-full">
            <Image 
              src={currentBanner.img1} 
              alt="Highlight 1" 
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="33vw"
            />
          </div>
          <div className="relative glass-card rounded-xl overflow-hidden aspect-square h-full w-full mt-6">
            <Image 
              src={currentBanner.img2} 
              alt="Highlight 2" 
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="33vw"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-64 space-y-8 lg:shrink-0">
          <div>
            <h3 className="font-label-caps text-xs text-on-surface mb-6 border-b border-outline-variant pb-2 font-bold tracking-widest">
              CATEGORÍAS
            </h3>
            <div className="space-y-3 flex flex-col">
              <Link 
                href="/catalogo" 
                className={`flex items-center gap-2 text-sm py-2 px-3 rounded transition-all font-semibold ${!cat ? 'text-electric-cyan bg-white/5 border-l-2 border-electric-cyan' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}
              >
                <Box size={16} /> Todos los productos
              </Link>
              <Link 
                href="/catalogo?cat=mascotas" 
                className={`flex items-center gap-2 text-sm py-2 px-3 rounded transition-all font-semibold ${cat === 'mascotas' ? 'text-electric-cyan bg-white/5 border-l-2 border-electric-cyan' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}
              >
                <Dog size={16} /> Mascotas
              </Link>
              <Link 
                href="/catalogo?cat=cocina" 
                className={`flex items-center gap-2 text-sm py-2 px-3 rounded transition-all font-semibold ${cat === 'cocina' ? 'text-electric-cyan bg-white/5 border-l-2 border-electric-cyan' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}
              >
                <Utensils size={16} /> Cocina
              </Link>
              <Link 
                href="/catalogo?cat=corporativo" 
                className={`flex items-center gap-2 text-sm py-2 px-3 rounded transition-all font-semibold ${cat === 'corporativo' ? 'text-electric-cyan bg-white/5 border-l-2 border-electric-cyan' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}
              >
                <Briefcase size={16} /> Corporativo
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-label-caps text-xs text-on-surface mb-6 border-b border-outline-variant pb-2 font-bold tracking-widest">
              MATERIALES DISPONIBLES
            </h3>
            <div className="space-y-3">
              <span className="block w-full text-left px-3 py-2 rounded text-xs bg-white/5 border-l-2 border-electric-cyan text-electric-cyan font-medium font-label-caps">
                PLA Industrial
              </span>
              <span className="block w-full text-left px-3 py-2 rounded text-xs text-on-surface-variant bg-white/3 font-label-caps">
                PETG Carbon Fiber
              </span>
              <span className="block w-full text-left px-3 py-2 rounded text-xs text-on-surface-variant bg-white/3 font-label-caps">
                TPU Flexible
              </span>
            </div>
          </div>

          {/* Filament Status Widget */}
          <div className="p-6 rounded-xl glass-card relative overflow-hidden">
            <div className="relative z-10">
              <span className="font-label-caps text-[10px] text-filament-orange mb-2 block font-bold tracking-wider">
                STATUS DE FILAMENTO
              </span>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-white">Extrusora 01</span>
                <span className="text-status-green flex items-center gap-1.5 text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
                  ACTIVE
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full filament-gradient w-[72%]" />
              </div>
              <span className="text-[10px] text-on-surface-variant mt-2 block font-label-caps">
                72% RESTANTE (PLA)
              </span>
            </div>
          </div>
        </aside>

        {/* Products Grid Section */}
        <div className="flex-1">
          {error && (
            <p className="text-red-400 font-semibold mb-6">
              Error al cargar productos. Intenta de nuevo.
            </p>
          )}

          {products?.length === 0 && (
            <div className="p-12 text-center rounded-2xl glass-card">
              <p className="text-on-surface-variant font-body-lg text-lg">
                No hay productos en esta categoría aún. ¡Pronto añadiremos más!
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products?.map(p => (
              <TarjetaProducto key={p.id} product={p} />
            ))}
          </div>

          {/* Bento-style Custom order card */}
          <div className="mt-12 glass-card rounded-xl p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 max-w-xl mb-6 md:mb-0">
              <h2 className="font-headline-lg text-2xl font-bold mb-2 text-white">Diseños a Medida</h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                ¿Tienes un archivo STL o una idea específica? Sube tu diseño o cotiza con nuestro equipo para una cotización de impresión 3D industrial a medida.
              </p>
            </div>
            <button className="relative z-10 bg-electric-cyan text-on-primary font-bold px-6 py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all whitespace-nowrap cursor-pointer">
              Cotizar Proyecto Personalizado
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
