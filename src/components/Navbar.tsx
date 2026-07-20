'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X, LogIn, LogOut, LayoutDashboard, Search, Sparkles } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import CarritoModal from './CarritoModal'
import AuthModal from './AuthModal'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Todos' },
  { href: '/catalogo?cat=mascotas', label: 'Mascotas' },
  { href: '/catalogo?cat=cocina', label: 'Cocina' },
  { href: '/catalogo?cat=corporativo', label: 'Corporativo' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { user, signOut } = useAuth()
  const [showCart, setShowCart] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  // Cargar rol de forma segura
  useEffect(() => {
    if (user && user.id) {
      import('@/lib/supabase').then(({ supabase }) => {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
          .then(({ data, error }) => {
            if (data && data.role) setUserRole(data.role)
          })
      })
    }
  }, [user])

  // Detectar scroll para cambiar el estilo de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ocultar la barra de navegación pública en el panel de administrador
  // IMPORTANTE: Este early return debe ir DESPUÉS de todos los hooks para no romper las Rules of Hooks
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-surface/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,229,255,0.05)] py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-12 max-w-[1440px] mx-auto">
          
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-electric-cyan to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-electric-cyan/20 group-hover:scale-105 transition-transform">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="font-display-lg text-2xl font-bold text-white tracking-tighter group-hover:text-electric-cyan transition-colors">
              3DPrint
            </span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1 bg-white/5 border border-white/10 p-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-colors ${
                  pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)) 
                    ? 'text-on-surface' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                }`}
              >
                {/* Active pill background using framer-motion */}
                {(pathname === link.href) && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search (visual only) */}
            <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-on-surface-variant hover:text-electric-cyan hover:bg-white/5 transition-colors">
              <Search size={20} />
            </button>

            {/* Auth Actions */}
            <div className="hidden sm:block h-6 w-px bg-white/10 mx-2" />
            
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                
                {/* User Profile Info */}
                <div className="flex items-center gap-2 mr-2 bg-white/5 rounded-full pl-1 pr-3 py-1 border border-white/10">
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Avatar" 
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-electric-cyan flex items-center justify-center text-[10px] font-bold text-on-primary">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-white truncate max-w-[100px]">
                    {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}
                  </span>
                </div>

                {userRole === 'admin' && (
                  <Link 
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-semibold rounded-full hover:bg-purple-500/20 transition-all"
                  >
                    <LayoutDashboard size={16} />
                    <span>Admin</span>
                  </Link>
                )}
                
                <Link 
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan text-sm font-semibold rounded-full hover:bg-electric-cyan/20 transition-all"
                  title="Mi Perfil"
                >
                  <span>Mi Perfil</span>
                </Link>
                <button 
                  className="flex items-center justify-center w-10 h-10 rounded-full text-on-surface-variant hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  onClick={signOut}
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                className="hidden sm:flex items-center gap-2 px-5 py-2 bg-white/10 text-white text-sm font-semibold rounded-full hover:bg-white/20 transition-all"
                onClick={() => setShowAuth(true)}
              >
                <LogIn size={16} />
                <span>Entrar</span>
              </button>
            )}

            {/* Cart Button */}
            <button 
              className="relative flex items-center justify-center w-12 h-12 rounded-full bg-electric-cyan text-on-primary hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]" 
              onClick={() => setShowCart(true)}
            >
              <ShoppingBag size={20} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-filament-orange text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-surface"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-on-surface hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[70px] left-0 w-full bg-surface-container/95 backdrop-blur-3xl border-b border-white/10 z-40 overflow-hidden lg:hidden shadow-2xl"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  className="text-lg font-semibold text-on-surface/80 hover:text-electric-cyan transition-colors" 
                  href={link.href} 
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px w-full bg-white/10 my-4" />
              
              {user ? (
                <div className="flex flex-col gap-4">
                  {userRole === 'admin' && (
                    <Link 
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-purple-500/20 text-purple-400 font-bold rounded-xl"
                    >
                      <LayoutDashboard size={20} /> Panel de Administrador
                    </Link>
                  )}
                  <button 
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-3 border border-red-500/30 text-red-400 font-bold rounded-xl"
                  >
                    <LogOut size={20} /> Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setShowAuth(true); setMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 text-white font-bold rounded-xl"
                >
                  <LogIn size={20} /> Iniciar Sesión / Registro
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showCart && <CarritoModal onClose={() => setShowCart(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
