'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import CarritoModal from './CarritoModal'
import AuthModal from './AuthModal'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { totalItems } = useCart()
  const { user, signOut } = useAuth()
  const [showCart, setShowCart] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoBracket}>[</span>
            3D<span className={styles.logoAccent}>Print</span>
            <span className={styles.logoBracket}>]</span>
          </Link>

          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
            <span /><span /><span />
          </button>

          <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
            <li><Link href="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
            <li><Link href="/catalogo" onClick={() => setMenuOpen(false)}>Catálogo</Link></li>
            <li><Link href="/catalogo?cat=mascotas" onClick={() => setMenuOpen(false)}>🐾 Mascotas</Link></li>
            <li><Link href="/catalogo?cat=cocina" onClick={() => setMenuOpen(false)}>🍳 Cocina</Link></li>
            <li><Link href="/catalogo?cat=corporativo" onClick={() => setMenuOpen(false)}>🏢 Corporativo</Link></li>
          </ul>

          <div className={styles.actions}>
            {user ? (
              <button className={styles.btnSecondary} onClick={signOut}>Salir</button>
            ) : (
              <button className={styles.btnSecondary} onClick={() => setShowAuth(true)}>Ingresar</button>
            )}
            <button className={styles.cartBtn} onClick={() => setShowCart(true)}>
              🛒
              {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
            </button>
          </div>
        </div>
      </nav>

      {showCart && <CarritoModal onClose={() => setShowCart(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
