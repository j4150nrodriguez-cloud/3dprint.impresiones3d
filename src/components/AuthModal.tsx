'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import styles from './AuthModal.module.css'
import { getRecaptchaToken } from '@/lib/recaptcha'

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const { signIn, signUp } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const action = tab === 'login' ? 'login' : 'register'
    const token = await getRecaptchaToken(action)

    if (token) {
      const verifyRes = await fetch('/api/recaptcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyData.success) {
        setError('Verificación de seguridad fallida. Intenta de nuevo.')
        setLoading(false)
        return
      }
    }

    if (tab === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError(error)
      else onClose()
    } else {
      const { error } = await signUp(email, password, name)
      if (error) setError(error)
      else setSuccess('Revisa tu correo para confirmar tu cuenta.')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <h2 className={styles.title}>
          {tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>

        {/* Google Login */}
        <button className={styles.googleBtn} onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continuar con Google
        </button>

        <div className={styles.divider}><span>o</span></div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'login' ? styles.active : ''}`} onClick={() => setTab('login')}>Ingresar</button>
          <button className={`${styles.tab} ${tab === 'register' ? styles.active : ''}`} onClick={() => setTab('register')}>Registrarse</button>
        </div>

        {success ? (
          <p className={styles.success}>{success}</p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {tab === 'register' && (
              <input className={styles.input} type="text" placeholder="Nombre completo" value={name} onChange={e => setName(e.target.value)} required />
            )}
            <input className={styles.input} type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className={styles.input} type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? 'Cargando...' : tab === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
