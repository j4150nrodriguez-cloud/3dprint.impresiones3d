import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Script from 'next/script'
import InteractiveBackground from '@/components/InteractiveBackground'
import WhatsAppButton from '@/components/WhatsAppButton'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: {
    default: '3DPrint Impresiones | Fabricación Aditiva y Diseños 3D',
    template: '%s | 3DPrint'
  },
  description: 'Servicio profesional de impresión 3D en Colombia. Fabricación de piezas industriales, regalos corporativos y accesorios con PLA, PETG y materiales avanzados. Entregas rápidas y precisión milimétrica.',
  keywords: ['impresión 3D', 'PLA', 'PETG', 'fabricación aditiva', 'regalos corporativos', 'accesorios 3D', 'Colombia', 'modelado 3D', 'piezas a medida'],
  authors: [{ name: '3DPrint Impresiones' }],
  creator: '3DPrint Impresiones',
  publisher: '3DPrint Impresiones',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: '3DPrint Impresiones | Fabricación Aditiva y Diseños 3D',
    description: 'Servicio profesional de impresión 3D en Colombia. Fabricación de piezas industriales, regalos corporativos y accesorios con precisión milimétrica.',
    url: 'https://3dprint-impresiones3d.vercel.app',
    siteName: '3DPrint',
    images: [
      {
        url: '/og-image.jpg', // Asumiendo que crearás una imagen OG
        width: 1200,
        height: 630,
        alt: '3DPrint Impresiones - Taller de Fabricación Aditiva',
      },
    ],
    locale: 'es_CO',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Generative Engine Optimization (GEO) & Schema.org Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: '3DPrint Impresiones',
  image: 'https://3dprint-impresiones3d.vercel.app/logo.png',
  description: 'Taller especializado en impresión 3D FDM/FFF de alta resolución. Creamos piezas a medida, regalos corporativos y productos funcionales en polímeros avanzados.',
  '@id': 'https://3dprint-impresiones3d.vercel.app',
  url: 'https://3dprint-impresiones3d.vercel.app',
  telephone: '+573105786524',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Colombia',
    addressCountry: 'CO'
  },
  priceRange: '$$',
  sameAs: [
    'https://www.instagram.com/3dprint_impresiones', // Ejemplo
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
        <InteractiveBackground />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
