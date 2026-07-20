'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, DollarSign, Users, Store, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, sellers: 0 })

  useEffect(() => {
    // Aquí iría el fetch a un endpoint de API que consolide estadísticas usando la llave de admin
    // Por ahora simularemos los datos para la UI
    setStats({
      orders: 24,
      revenue: 1540000,
      users: 12,
      sellers: 3
    })
  }, [])

  const statCards = [
    { title: 'Total Órdenes', value: stats.orders, icon: Package, color: 'text-electric-cyan', bg: 'bg-electric-cyan/10', border: 'border-electric-cyan/20' },
    { title: 'Ingresos Estimados', value: `$${stats.revenue.toLocaleString('es-CO')}`, icon: DollarSign, color: 'text-status-green', bg: 'bg-status-green/10', border: 'border-status-green/20' },
    { title: 'Usuarios Registrados', value: stats.users, icon: Users, color: 'text-filament-orange', bg: 'bg-filament-orange/10', border: 'border-filament-orange/20' },
    { title: 'Vendedores Activos', value: stats.sellers, icon: Store, color: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/20' },
  ]

  return (
    <div className="text-on-surface">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-electric-cyan to-blue-500 flex items-center justify-center shadow-lg shadow-electric-cyan/20">
          <TrendingUp className="text-white" size={24} />
        </div>
        <h1 className="text-4xl font-display-lg font-bold text-white tracking-tight">Resumen General</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`glass-card p-6 rounded-2xl relative overflow-hidden border-t ${card.border}`}
          >
            {/* Background Glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl ${card.bg} opacity-50`} />
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="text-on-surface-variant text-sm font-semibold mb-2 uppercase tracking-wider">{card.title}</h3>
                <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={card.color} size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
