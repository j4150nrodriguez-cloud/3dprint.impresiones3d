'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 container mx-auto text-center flex flex-col items-center justify-center">
      <div className="glass-card p-10 rounded-3xl max-w-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>
        
        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">¡Transacción Procesada!</h1>
        <p className="text-gray-300 mb-6">
          Tu pago ha sido procesado por Wompi. En breve recibirás un correo con la confirmación final una vez que el banco apruebe la transacción.
        </p>
        
        {id && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-8">
            <span className="block text-sm text-gray-400 mb-1">ID de Transacción Wompi:</span>
            <span className="font-mono text-white text-lg">{id}</span>
          </div>
        )}

        <Link 
          href="/" 
          className="inline-block bg-white text-black font-semibold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-white">Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
