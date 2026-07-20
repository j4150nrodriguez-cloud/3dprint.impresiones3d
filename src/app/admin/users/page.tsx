'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, CheckCircle, Clock, ShieldCheck, ShieldAlert } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulando fetch de usuarios
    setTimeout(() => {
      setUsers([
        { id: '1', email: 'j4150nrodriguez@gmail.com', name: 'Jaison', role: 'admin', active_vendedor: false },
        { id: '2', email: 'cliente@ejemplo.com', name: 'Cliente Feliz', role: 'cliente', active_vendedor: false },
        { id: '3', email: 'vendedor_nuevo@ejemplo.com', name: 'Nuevo Vendedor', role: 'vendedor', active_vendedor: false },
        { id: '4', email: 'vendedor_pro@ejemplo.com', name: 'Vendedor Pro', role: 'vendedor', active_vendedor: true },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleApproveSeller = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active_vendedor: true } : u))
  }

  const handleRevokeSeller = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active_vendedor: false } : u))
  }

  return (
    <div className="text-on-surface">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Users className="text-white" size={24} />
        </div>
        <h1 className="text-3xl md:text-4xl font-display-lg font-bold text-white tracking-tight">Gestión de Usuarios</h1>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-on-surface-variant text-sm tracking-wider uppercase">
                <th className="p-5 font-semibold">Usuario</th>
                <th className="p-5 font-semibold">Correo</th>
                <th className="p-5 font-semibold">Rol</th>
                <th className="p-5 font-semibold">Estado Vendedor</th>
                <th className="p-5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-on-surface-variant">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin" />
                      Cargando usuarios...
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u, index) => (
                  <motion.tr 
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-5 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-electric-cyan">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      {u.name}
                    </td>
                    <td className="p-5 text-on-surface-variant">{u.email}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider border ${
                        u.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        u.role === 'vendedor' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-5">
                      {u.role === 'vendedor' ? (
                        <span className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center w-fit gap-1.5 border ${
                          u.active_vendedor ? 'bg-status-green/10 text-status-green border-status-green/20' : 'bg-filament-orange/10 text-filament-orange border-filament-orange/20'
                        }`}>
                          {u.active_vendedor ? (
                            <><CheckCircle size={14} /> Aprobado</>
                          ) : (
                            <><Clock size={14} /> Pendiente</>
                          )}
                        </span>
                      ) : (
                        <span className="text-on-surface-variant text-xs">-</span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2 transition-opacity">
                        {u.role === 'vendedor' && !u.active_vendedor && (
                          <button 
                            onClick={() => handleApproveSeller(u.id)}
                            className="w-10 h-10 rounded-full bg-status-green/10 hover:bg-status-green/20 text-status-green flex items-center justify-center transition-all hover:scale-110 active:scale-95" 
                            title="Aprobar Vendedor"
                          >
                            <ShieldCheck size={18} />
                          </button>
                        )}
                        {u.role === 'vendedor' && u.active_vendedor && (
                          <button 
                            onClick={() => handleRevokeSeller(u.id)}
                            className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all hover:scale-110 active:scale-95" 
                            title="Revocar Vendedor"
                          >
                            <ShieldAlert size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
