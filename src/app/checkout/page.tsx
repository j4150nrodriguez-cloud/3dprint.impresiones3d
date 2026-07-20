'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MapPin, ShieldCheck, Lock, CheckCircle2, Plus, Loader2 } from 'lucide-react'
import { locationService } from '@/lib/locationService'
import { ICountry, IState, ICity } from 'country-state-city'

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [fetchingAddresses, setFetchingAddresses] = useState(true)
  const [error, setError] = useState('')
  const [isVendedor, setIsVendedor] = useState(false)

  // New Address Form State
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [countries, setCountries] = useState<ICountry[]>([])
  const [departments, setDepartments] = useState<IState[]>([])
  const [cities, setCities] = useState<ICity[]>([])
  const [formCountryCode, setFormCountryCode] = useState<string>('')
  const [formStateCode, setFormStateCode] = useState<string>('')
  const [formCityName, setFormCityName] = useState<string>('')
  const [formAlias, setFormAlias] = useState('Mi Dirección')
  const [formAddressLine, setFormAddressLine] = useState('')
  const [formReference, setFormReference] = useState('')
  const [formPhone, setFormPhone] = useState('')

  useEffect(() => {
    if (user) {
      checkVendedor()
      fetchAddresses()
    } else {
      setFetchingAddresses(false)
    }
  }, [user])

  useEffect(() => {
    if (isAddingNew && countries.length === 0) {
      setCountries(locationService.getCountries())
    }
  }, [isAddingNew])

  useEffect(() => {
    if (formCountryCode) {
      setDepartments(locationService.getDepartments(formCountryCode))
    } else {
      setDepartments([])
    }
  }, [formCountryCode])

  useEffect(() => {
    if (formCountryCode && formStateCode) {
      setCities(locationService.getCities(formCountryCode, formStateCode))
    } else {
      setCities([])
    }
  }, [formCountryCode, formStateCode])

  const checkVendedor = async () => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (token) {
      fetch(`/api/user/profile`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data?.role === 'vendedor' && data?.active_vendedor) setIsVendedor(true)
        }).catch(console.error)
    }
  }

  const fetchAddresses = async () => {
    setFetchingAddresses(true)
    const { data, error } = await supabase
      .from('addresses')
      .select(`*`)
      .eq('user_id', user?.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (!error && data) {
      setAddresses(data)
      if (data.length > 0) {
        setSelectedAddressId(data[0].id)
      } else {
        setIsAddingNew(true)
      }
    } else {
      setIsAddingNew(true)
    }
    setFetchingAddresses(false)
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setLoading(true)
    setError('')

    let finalShippingData = {
      direccion: '',
      telefono: '',
      ciudad: '',
      departamento: ''
    }

    if (isAddingNew) {
      if (!formCountryCode || !formStateCode || !formCityName || !formAddressLine || !formPhone) {
        setError('Por favor completa todos los datos obligatorios de la dirección.')
        setLoading(false)
        return
      }

      const payload = {
        user_id: user?.id,
        alias: formAlias,
        country: countries.find(c => c.isoCode === formCountryCode)?.name || '',
        state: departments.find(s => s.isoCode === formStateCode)?.name || '',
        city: formCityName,
        address_line: formAddressLine,
        reference: formReference,
        phone: formPhone,
        is_default: addresses.length === 0
      }
      
      const { data: newAddrData, error: insErr } = await supabase.from('addresses').insert([payload]).select('*').single()
      
      if (!insErr && newAddrData) {
        finalShippingData = {
          direccion: `${newAddrData.address_line} ${newAddrData.reference ? '('+newAddrData.reference+')' : ''}`,
          telefono: newAddrData.phone,
          ciudad: newAddrData.city || '',
          departamento: newAddrData.state || ''
        }
      } else {
        // Fallback si falla insertar
        const d = departments.find(d => d.isoCode === formStateCode)
        finalShippingData = {
          direccion: formAddressLine,
          telefono: formPhone,
          ciudad: formCityName || '',
          departamento: d?.name || ''
        }
      }
    } else {
      const selected = addresses.find(a => a.id === selectedAddressId)
      if (!selected) {
        setError('Selecciona una dirección o crea una nueva.')
        setLoading(false)
        return
      }
      finalShippingData = {
        direccion: `${selected.address_line} ${selected.reference ? '('+selected.reference+')' : ''}`,
        telefono: selected.phone,
        ciudad: selected.city || '',
        departamento: selected.state || ''
      }
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingData: finalShippingData,
          userId: user?.id,
          isVendedor
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el pago')
      }

      const wompiUrl = new URL('https://checkout.wompi.co/p/')
      wompiUrl.searchParams.set('public-key', process.env.NEXT_PUBLIC_WOMPI_PUB_KEY || 'pub_test_X')
      wompiUrl.searchParams.set('currency', data.currency)
      wompiUrl.searchParams.set('amount-in-cents', data.amountInCents)
      wompiUrl.searchParams.set('reference', data.orderId)
      wompiUrl.searchParams.set('signature:integrity', data.signature)
      wompiUrl.searchParams.set('redirect-url', `${window.location.origin}/checkout/success`)

      clearCart()
      window.location.href = wompiUrl.toString()
      
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-4 container mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Tu carrito está vacío</h1>
        <Link href="/" className="px-6 py-3 bg-electric-cyan text-surface-container font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)]">
          Descubrir Productos Increíbles
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 container mx-auto relative text-on-surface">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-sm font-semibold mb-4">
            <Lock size={16} /> Compra 100% Segura y Encriptada
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white mb-6">
            ¡Estás a un paso de <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-purple-500">Completar Tu Pedido</span>!
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Garantizamos la calidad de nuestros productos y un envío rápido. Completa tus datos para enviártelo lo antes posible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Lado Izquierdo: Formulario de Envío (Toma 2 columnas) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-cyan to-purple-500"></div>
              
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <MapPin className="text-electric-cyan" />
                ¿A dónde enviamos tu pedido?
              </h2>

              {fetchingAddresses ? (
                <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant">
                  <Loader2 className="animate-spin text-electric-cyan mb-2" size={32} />
                  Cargando tus direcciones...
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Selector de Direcciones Guardadas */}
                  {addresses.length > 0 && (
                    <div className="space-y-3">
                      {!isAddingNew && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {addresses.map(addr => (
                            <div 
                              key={addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'bg-electric-cyan/10 border-electric-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-white">{addr.alias}</h4>
                                {selectedAddressId === addr.id && <CheckCircle2 size={18} className="text-electric-cyan" />}
                              </div>
                              <p className="text-sm text-on-surface-variant">{addr.address_line}</p>
                              <p className="text-sm text-on-surface-variant">{addr.city}, {addr.state}</p>
                              <p className="text-xs text-white/50 mt-2 font-mono">📞 {addr.phone}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <button 
                        type="button"
                        onClick={() => setIsAddingNew(!isAddingNew)}
                        className={`text-sm font-semibold flex items-center gap-2 mt-4 transition-colors ${isAddingNew ? 'text-red-400 hover:text-red-300' : 'text-electric-cyan hover:text-cyan-400'}`}
                      >
                        {isAddingNew ? <><MapPin size={16}/> Cancelar Nueva Dirección (Usar guardadas)</> : <><Plus size={16}/> Añadir Nueva Dirección</>}
                      </button>
                    </div>
                  )}

                  {/* Formulario de Nueva Dirección */}
                  {(isAddingNew || addresses.length === 0) && (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Registrar Nueva Dirección</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-on-surface-variant mb-1">Nombre (Ej: Casa)</label>
                          <input type="text" required value={formAlias} onChange={e => setFormAlias(e.target.value)} className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-on-surface-variant mb-1">Teléfono</label>
                          <input type="tel" required autoComplete="tel" value={formPhone} onChange={e => setFormPhone(e.target.value)} className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-on-surface-variant mb-1">País</label>
                          <select required autoComplete="country" value={formCountryCode} onChange={e => {setFormCountryCode(e.target.value); setFormStateCode(''); setFormCityName('');}} className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-3 text-white focus:border-electric-cyan focus:outline-none">
                            <option value="" className="bg-[#121212]">Selecciona...</option>
                            {countries.map(c => <option key={c.isoCode} value={c.isoCode} className="bg-[#121212]">{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-on-surface-variant mb-1">{locationService.getStateLabel(formCountryCode)}</label>
                          <select required autoComplete="address-level1" value={formStateCode} disabled={!formCountryCode} onChange={e => {setFormStateCode(e.target.value); setFormCityName('');}} className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-3 text-white focus:border-electric-cyan focus:outline-none disabled:opacity-50">
                            <option value="" className="bg-[#121212]">Selecciona...</option>
                            {departments.map(d => <option key={d.isoCode} value={d.isoCode} className="bg-[#121212]">{d.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-on-surface-variant mb-1">Ciudad</label>
                          <select required autoComplete="address-level2" value={formCityName} disabled={!formStateCode} onChange={e => setFormCityName(e.target.value)} className="w-full bg-surface-container border border-white/10 rounded-xl px-3 py-3 text-white focus:border-electric-cyan focus:outline-none disabled:opacity-50">
                            <option value="" className="bg-[#121212]">Selecciona...</option>
                            {cities.map(c => <option key={c.name} value={c.name} className="bg-[#121212]">{c.name}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-on-surface-variant mb-1">Dirección Exacta (Calle, Carrera, Nro)</label>
                        <input type="text" required autoComplete="street-address" value={formAddressLine} onChange={e => setFormAddressLine(e.target.value)} placeholder="Ej: Calle 123 #45-67 Apto 801" className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Beneficios Neuromarketing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center text-center border border-white/5">
                <ShieldCheck size={28} className="text-electric-cyan mb-2" />
                <h4 className="font-bold text-white text-sm">Garantía Total</h4>
                <p className="text-xs text-on-surface-variant mt-1">Satisfacción 100% garantizada en todos tus productos.</p>
              </div>
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center text-center border border-white/5">
                <Lock size={28} className="text-purple-400 mb-2" />
                <h4 className="font-bold text-white text-sm">Pago Seguro</h4>
                <p className="text-xs text-on-surface-variant mt-1">Tu dinero está protegido con la tecnología de Wompi.</p>
              </div>
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center text-center border border-white/5">
                <CheckCircle2 size={28} className="text-green-400 mb-2" />
                <h4 className="font-bold text-white text-sm">Envío Rápido</h4>
                <p className="text-xs text-on-surface-variant mt-1">Procesamos tu pedido de inmediato para que llegue pronto.</p>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Resumen del Pedido (Toma 1 columna) */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 sticky top-28 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Tu Orden</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-14 h-14 object-cover rounded-lg bg-black/20" />
                    ) : (
                      <div className="w-14 h-14 bg-black/20 rounded-lg flex items-center justify-center border border-white/10">
                         <span className="text-xs text-white/40">Img</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-white line-clamp-1">{item.title}</h4>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-on-surface-variant">Cant: {item.quantity}</span>
                        <span className="text-sm font-mono text-electric-cyan font-bold">${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3 mb-6">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-mono">${totalPrice.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Envío</span>
                  <span className="text-green-400">Por calcular</span>
                </div>
                <div className="flex justify-between items-center text-xl text-white font-bold pt-3 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-purple-400 font-mono text-2xl">
                    ${totalPrice.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
              
              {isVendedor && (
                 <div className="mb-6 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-200 text-xs text-center">
                   🌟 Compra como vendedor. Comisión garantizada.
                 </div>
              )}

              {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">{error}</div>}

              <button 
                onClick={handleCheckout}
                disabled={loading || fetchingAddresses || (!isAddingNew && !selectedAddressId)}
                className="w-full bg-electric-cyan hover:bg-cyan-400 text-surface-container font-bold py-4 px-6 rounded-2xl transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-95 text-lg"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={24} /> Procesando...</>
                ) : (
                  <>Completar Mi Pedido Ahora <ShieldCheck size={20} /></>
                )}
              </button>

              <div className="mt-4 flex justify-center items-center gap-2 text-xs text-white/40">
                <Lock size={12} /> Pagos encriptados de extremo a extremo
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
