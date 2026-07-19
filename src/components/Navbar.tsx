'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import CarritoModal from './CarritoModal'
import AuthModal from './AuthModal'

export default function Navbar() {
  const { totalItems } = useCart()
  const { user, signOut } = useAuth()
  const [showCart, setShowCart] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="bg-surface/60 backdrop-blur-xl text-electric-cyan font-body-lg text-body-lg top-0 sticky z-50 border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,229,255,0.1)]">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="font-display-lg text-2xl md:text-3xl font-bold text-electric-cyan tracking-tighter">
            3DPrint
          </Link>
          
          <button 
            className="md:hidden text-on-surface hover:text-electric-cyan transition-colors" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <span className="material-symbols-outlined text-2xl">{menuOpen ? 'close' : 'menu'}</span>
          </button>

          <div className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 w-full md:w-auto bg-surface md:bg-transparent border-b md:border-b-0 border-white/10 p-6 md:p-0 space-y-4 md:space-y-0 md:space-x-8 z-40`}>
            <Link className="text-on-surface/70 hover:text-on-surface transition-colors pb-1 text-sm font-semibold" href="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link className="text-on-surface/70 hover:text-on-surface transition-colors pb-1 text-sm font-semibold" href="/catalogo" onClick={() => setMenuOpen(false)}>Catálogo</Link>
            <Link className="text-on-surface/70 hover:text-on-surface transition-colors pb-1 text-sm font-semibold" href="/catalogo?cat=mascotas" onClick={() => setMenuOpen(false)}>🐾 Mascotas</Link>
            <Link className="text-on-surface/70 hover:text-on-surface transition-colors pb-1 text-sm font-semibold" href="/catalogo?cat=cocina" onClick={() => setMenuOpen(false)}>🍳 Cocina</Link>
            <Link className="text-on-surface/70 hover:text-on-surface transition-colors pb-1 text-sm font-semibold" href="/catalogo?cat=corporativo" onClick={() => setMenuOpen(false)}>🏢 Corporativo</Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <button 
                className="px-4 py-2 border border-electric-cyan/30 text-electric-cyan text-sm font-semibold rounded-lg hover:bg-electric-cyan/5 transition-all cursor-pointer"
                onClick={signOut}
              >
                Salir
              </button>
            ) : (
              <button 
                className="px-4 py-2 border border-electric-cyan/30 text-electric-cyan text-sm font-semibold rounded-lg hover:bg-electric-cyan/5 transition-all cursor-pointer"
                onClick={() => setShowAuth(true)}
              >
                Ingresar
              </button>
            )}
            <button 
              className="material-symbols-outlined text-on-surface/70 hover:text-electric-cyan transition-colors relative cursor-pointer" 
              onClick={() => setShowCart(true)}
            >
              shopping_cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-filament-orange text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {showCart && <CarritoModal onClose={() => setShowCart(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
