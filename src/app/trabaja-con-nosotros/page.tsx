'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function TrabajaConNosotrosPage() {
  const { user } = useAuth()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSolicitud = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return setError('Debes iniciar sesión primero para enviar la solicitud.')
    
    setLoading(true)
    setError('')
    
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token

      const res = await fetch('/api/user/seller-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const resData = await res.json()
      if (!res.ok) throw new Error(resData.error || 'Error al procesar la solicitud')
      
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
          Únete a la familia 3DPrint
        </h1>
        <p className="text-xl text-gray-300">
          Vende nuestros productos únicos de impresión 3D y gana comisiones por cada venta. Sé tu propio jefe, sin inventario ni riesgos.
        </p>
      </section>

      {/* Beneficios */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="text-5xl mb-4">💰</div>
          <h3 className="text-xl font-bold text-white mb-2">Comisiones Atractivas</h3>
          <p className="text-gray-400">Obtén precios exclusivos de distribuidor y gana el margen sobre el precio final.</p>
        </div>
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-white mb-2">Nosotros Enviamos</h3>
          <p className="text-gray-400">Dropshipping local. Nosotros nos encargamos del embalaje y envío a tu cliente.</p>
        </div>
        <div className="glass-card p-8 rounded-2xl text-center">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="text-xl font-bold text-white mb-2">Catálogo Exclusivo</h3>
          <p className="text-gray-400">Acceso a diseños de tendencia antes que nadie en el mercado.</p>
        </div>
      </section>

      {/* Formulario de Solicitud */}
      <section className="max-w-2xl mx-auto glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Solicitar ser Vendedor
        </h2>

        {!user ? (
          <div className="text-center">
            <p className="text-gray-300 mb-6">Para unirte a nuestro programa de vendedores debes tener una cuenta activa en la plataforma.</p>
            <p className="text-yellow-400 font-semibold">Por favor, inicia sesión o regístrate en el menú superior para continuar.</p>
          </div>
        ) : success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¡Solicitud Enviada!</h3>
            <p className="text-gray-300">
              Nuestro equipo revisará tu perfil. Te notificaremos por correo electrónico cuando tu cuenta de vendedor sea activada.
            </p>
            <Link href="/" className="inline-block mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              Volver a Inicio
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSolicitud} className="space-y-6">
            <p className="text-gray-300 text-center mb-6">
              Estás enviando la solicitud con la cuenta: <br/>
              <strong className="text-white">{user.email}</strong>
            </p>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
              Al hacer clic en "Enviar Solicitud", autorizas a los administradores a revisar tu perfil.
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
