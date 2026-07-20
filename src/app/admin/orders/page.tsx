'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Receipt, Eye, Printer, CheckCircle, X } from 'lucide-react'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingOrder, setViewingOrder] = useState<any>(null)

  useEffect(() => {
    // Simulando fetch de órdenes
    setTimeout(() => {
      setOrders([
        { 
          id: 'ORD-001', 
          date: '2023-11-20', 
          customer: 'Juan Pérez', 
          email: 'juan.perez@example.com',
          phone: '+573001234567',
          address: 'Calle Falsa 123, Bogotá',
          total: 45.0, 
          status: 'completado', 
          seller: 'Directo' 
        },
        { 
          id: 'ORD-002', 
          date: '2023-11-21', 
          customer: 'Ana Gómez', 
          email: 'ana.gomez@example.com',
          phone: '+573109876543',
          address: 'Cra 45 # 12-34, Medellín',
          total: 15.0, 
          status: 'pendiente', 
          seller: 'Ana Gómez (Vend.)' 
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleMarkCompleted = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'completado' } : o))
  }

  const handlePrint = (id: string) => {
    alert(`Imprimiendo recibo para la orden ${id}... (Simulación)`)
    // Aquí iría window.print() u otra lógica de generación de PDF
  }

  return (
    <div className="text-on-surface relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-filament-orange to-red-500 flex items-center justify-center shadow-lg shadow-filament-orange/20">
          <Receipt className="text-white" size={24} />
        </div>
        <h1 className="text-3xl md:text-4xl font-display-lg font-bold text-white tracking-tight">Gestión de Órdenes</h1>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-on-surface-variant text-sm tracking-wider uppercase">
                <th className="p-5 font-semibold">ID Orden</th>
                <th className="p-5 font-semibold">Fecha</th>
                <th className="p-5 font-semibold">Cliente</th>
                <th className="p-5 font-semibold">Total</th>
                <th className="p-5 font-semibold">Vendedor / Origen</th>
                <th className="p-5 font-semibold">Estado</th>
                <th className="p-5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-on-surface-variant">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin" />
                      Cargando órdenes...
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((o, index) => (
                  <motion.tr 
                    key={o.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-5 font-mono font-bold text-electric-cyan">{o.id}</td>
                    <td className="p-5 text-on-surface-variant">{o.date}</td>
                    <td className="p-5 font-bold text-white">{o.customer}</td>
                    <td className="p-5 font-mono font-bold text-status-green text-base">${o.total.toFixed(2)}</td>
                    <td className="p-5 text-on-surface-variant">{o.seller}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider border ${
                        o.status === 'completado' ? 'bg-status-green/10 text-status-green border-status-green/20' : 'bg-filament-orange/10 text-filament-orange border-filament-orange/20'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2 transition-opacity">
                        <button 
                          onClick={() => setViewingOrder(o)}
                          className="w-10 h-10 rounded-full bg-white/5 hover:bg-electric-cyan/20 text-on-surface-variant hover:text-electric-cyan flex items-center justify-center transition-all hover:scale-110 active:scale-95" 
                          title="Ver Detalles"
                        >
                          <Eye size={18} />
                        </button>
                        {o.status === 'pendiente' && (
                          <button 
                            onClick={() => handleMarkCompleted(o.id)}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-status-green/20 text-on-surface-variant hover:text-status-green flex items-center justify-center transition-all hover:scale-110 active:scale-95" 
                            title="Marcar Completada"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handlePrint(o.id)}
                          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 text-on-surface-variant hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95" 
                          title="Imprimir Ticket"
                        >
                          <Printer size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles de Orden */}
      <AnimatePresence>
        {viewingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setViewingOrder(null)} 
                className="absolute top-6 right-6 text-on-surface-variant hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <Receipt className="text-electric-cyan" size={24} />
                <h3 className="text-2xl font-bold text-white">Detalles de la Orden</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">ID de Orden:</span>
                  <span className="font-mono font-bold text-electric-cyan">{viewingOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Fecha:</span>
                  <span className="text-white">{viewingOrder.date}</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 my-4">
                  <h4 className="text-electric-cyan font-semibold mb-2">Datos del Cliente</h4>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Nombre:</span>
                    <span className="font-bold text-white">{viewingOrder.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Email:</span>
                    <span className="text-white">{viewingOrder.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Teléfono:</span>
                    <span className="text-white">{viewingOrder.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Dirección de Envío:</span>
                    <span className="text-white text-right max-w-[200px]">{viewingOrder.address}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-4">
                  <span className="text-on-surface-variant font-bold">TOTAL A PAGAR:</span>
                  <span className="font-mono font-bold text-status-green text-2xl">${viewingOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <a 
                  href={`https://wa.me/${viewingOrder.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl font-semibold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                  </svg>
                  Contactar por WhatsApp
                </a>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setViewingOrder(null)}
                    className="flex-1 py-3 rounded-xl font-semibold bg-white/5 text-white hover:bg-white/10 transition-colors"
                  >
                    Cerrar
                  </button>
                  <button 
                    onClick={() => handlePrint(viewingOrder.id)}
                    className="flex-1 py-3 rounded-xl font-semibold bg-electric-cyan text-surface-container hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer size={18} />
                    Imprimir Recibo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
