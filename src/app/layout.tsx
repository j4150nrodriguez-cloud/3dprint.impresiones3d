import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Script from 'next/script'
import InteractiveBackground from '@/components/InteractiveBackground'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: '3DPrint Impresiones | Piezas únicas en filamento',
  description: 'Tienda de productos impresos en 3D para mascotas, cocina y regalos corporativos. Filamento PLA, PETG y materiales especiales. Envíos a toda Colombia.',
  keywords: 'impresión 3D, PLA, PETG, filamento, mascotas, cocina, regalos corporativos, Colombia',
  openGraph: {
    title: '3DPrint Impresiones',
    description: 'Piezas únicas impresas en 3D. Mascotas, cocina y corporativo.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.variable}>
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
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
