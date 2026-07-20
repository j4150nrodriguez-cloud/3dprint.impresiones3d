'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Joyride, STATUS } from 'react-joyride'
import { LayoutDashboard, Receipt, Users, PackageOpen, ArrowLeft, Settings, HelpCircle } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Resumen', icon: LayoutDashboard, targetId: 'tour-resumen' },
  { href: '/admin/orders', label: 'Órdenes', icon: Receipt, targetId: 'tour-orders' },
  { href: '/admin/catalog', label: 'Catálogo', icon: PackageOpen, targetId: 'tour-catalog' },
  { href: '/admin/users', label: 'Usuarios y Vendedores', icon: Users, targetId: 'tour-users' },
  { href: '/admin/settings', label: 'Redes Sociales', icon: Settings, targetId: 'tour-settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [runTour, setRunTour] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const steps = [
    {
      target: '#tour-resumen',
      content: 'Bienvenido al Panel. Aquí podrás ver un resumen de tus ventas, estadísticas clave y la salud general de tu negocio.',
    },
    {
      target: '#tour-orders',
      content: 'Recibe todos los pedidos aquí. Usa el botón del Ojo para ver datos del cliente, contactarlo por WhatsApp, y marca la orden como Completada al enviar.',
    },
    {
      target: '#tour-catalog',
      content: 'Crea y gestiona tus productos. Puedes asignar categorías, precio público y una comisión especial para tus vendedores.',
    },
    {
      target: '#tour-users',
      content: 'Controla el acceso al sistema. Aprueba nuevos vendedores para que empiecen a ganar comisiones vendiendo tus impresiones 3D.',
    },
    {
      target: '#tour-settings',
      content: 'Pega el enlace de tus perfiles aquí. Detectaremos automáticamente la red social y la añadiremos al pie de página público.',
    }
  ]

  const handleJoyrideCallback = (data: any) => {
    const { status, type, index } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]
    
    if (type === 'step:after' || type === 'target:not_found') {
      setStepIndex(index + (data.action === 'prev' ? -1 : 1))
    } else if (finishedStatuses.includes(status)) {
      setRunTour(false)
      setStepIndex(0) // Reiniciar para la próxima vez
    }
  }

  return (
    <div className="min-h-screen bg-background flex text-on-surface relative overflow-hidden">
      
      {mounted && (
        <Joyride
          steps={steps}
          run={runTour}
          stepIndex={stepIndex}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          callback={handleJoyrideCallback}
          styles={{
            options: {
              zIndex: 10000,
              primaryColor: '#00e5ff',
              backgroundColor: '#1E293B',
              textColor: '#fff',
              overlayColor: 'rgba(0, 0, 0, 0.7)',
              arrowColor: '#1E293B'
            },
            beaconInner: {
              backgroundColor: '#00e5ff',
            },
            beaconOuter: {
              border: '2px solid #00e5ff',
              backgroundColor: 'rgba(0, 229, 255, 0.3)',
            },
            tooltip: {
              borderRadius: '16px',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              padding: '24px',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.2)'
            },
            buttonNext: {
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: 'bold',
              backgroundColor: '#00e5ff',
              color: '#000'
            },
            buttonBack: {
              color: '#00e5ff'
            },
            buttonSkip: {
              color: '#94a3b8'
            }
          }}
          locale={{
            back: 'Anterior',
            close: 'Cerrar',
            last: 'Finalizar',
            next: 'Siguiente',
            skip: 'Omitir',
            openDialog: 'Abrir información'
          }}
        />
      )}

      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-electric-cyan/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-filament-orange/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Sidebar Administrador */}
      <aside className="w-72 bg-surface/30 backdrop-blur-3xl border-r border-white/10 p-6 flex flex-col pt-32 h-screen sticky top-0 z-20 flex-shrink-0">
        
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-electric-cyan to-blue-600 flex items-center justify-center shadow-lg shadow-electric-cyan/20">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <span className="font-display-lg text-lg font-bold text-white tracking-tight leading-tight">
            3DPrint <br/> <span className="text-electric-cyan text-sm">Admin Panel</span>
          </span>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} id={item.targetId} className="block relative group">
                {isActive && (
                  <motion.div 
                    layoutId="admin-nav-indicator"
                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/20 z-0 pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'text-white' : 'text-on-surface-variant group-hover:text-white group-hover:bg-white/5'
                }`}>
                  <item.icon size={20} className={isActive ? 'text-electric-cyan' : ''} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto space-y-2">
          <button 
            onClick={() => setRunTour(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-electric-cyan hover:bg-electric-cyan/10 transition-colors font-semibold text-sm text-left border border-electric-cyan/20"
          >
            <HelpCircle size={20} />
            Ver Tutorial (Guía)
          </button>

          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors font-semibold text-sm border border-white/5 bg-white/5">
            <ArrowLeft size={20} />
            Volver a la Tienda
          </Link>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 pt-32 overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
