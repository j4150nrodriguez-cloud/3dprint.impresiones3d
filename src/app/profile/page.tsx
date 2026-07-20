'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { MapPin, Plus, Trash2, Pencil, Star, X, Loader2, User as UserIcon, Save } from 'lucide-react'
import { locationService } from '@/lib/locationService'
import { ICountry, IState, ICity } from 'country-state-city'

export default function ProfilePage() {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal State
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  // Geographic Data State
  const [countries, setCountries] = useState<ICountry[]>([])
  const [departments, setDepartments] = useState<IState[]>([])
  const [cities, setCities] = useState<ICity[]>([])

  // Form State
  const [formCountryCode, setFormCountryCode] = useState<string>('')
  const [formStateCode, setFormStateCode] = useState<string>('')
  const [formCityName, setFormCityName] = useState<string>('')
  const [formAlias, setFormAlias] = useState('')
  const [formAddressLine, setFormAddressLine] = useState('')
  const [formReference, setFormReference] = useState('')
  const [formPhone, setFormPhone] = useState('')

  useEffect(() => {
    if (user) fetchAddresses()
  }, [user])

  useEffect(() => {
    locationService.getCountries().then(setCountries).catch(console.error)
  }, [])

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

  const fetchAddresses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('addresses')
      .select(`
        *
      `)
      .eq('user_id', user?.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (!error && data) {
      setAddresses(data)
    }
    setLoading(false)
  }

  const handleOpenModal = (address?: any) => {
    if (address) {
      setEditingAddress(address)
      setFormAlias(address.alias)
      // For editing, we try to match the stored names to the codes
      const countryCode = countries.find(c => c.name === address.country)?.isoCode || ''
      setFormCountryCode(countryCode)
      if (countryCode) {
        const states = locationService.getDepartments(countryCode)
        const stateCode = states.find(s => s.name === address.state)?.isoCode || ''
        setFormStateCode(stateCode)
      } else {
        setFormStateCode('')
      }
      setFormCityName(address.city || '')
      setFormAddressLine(address.address_line)
      setFormReference(address.reference || '')
      setFormPhone(address.phone)
    } else {
      setEditingAddress(null)
      setFormAlias('Casa')
      setFormCountryCode(countries.length > 0 ? countries[0].isoCode : '')
      setFormStateCode('')
      setFormCityName('')
      setFormAddressLine('')
      setFormReference('')
      setFormPhone('')
    }
    setShowAddressModal(true)
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      user_id: user?.id,
      alias: formAlias,
      country: countries.find(c => c.isoCode === formCountryCode)?.name || '',
      state: departments.find(s => s.isoCode === formStateCode)?.name || '',
      city: formCityName,
      address_line: formAddressLine,
      reference: formReference,
      phone: formPhone,
      is_default: addresses.length === 0 ? true : (editingAddress ? editingAddress.is_default : false)
    }

    if (editingAddress) {
      await supabase.from('addresses').update(payload).eq('id', editingAddress.id)
    } else {
      await supabase.from('addresses').insert([payload])
    }

    await fetchAddresses()
    setSaving(false)
    setShowAddressModal(false)
  }

  const handleDeleteAddress = async (id: string) => {
    if(confirm("¿Estás seguro de eliminar esta dirección?")) {
      await supabase.from('addresses').delete().eq('id', id)
      fetchAddresses()
    }
  }

  const handleSetDefault = async (id: string) => {
    // Primero, quitar el default a todos
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user?.id)
    // Luego, ponérselo al seleccionado
    await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    fetchAddresses()
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-electric-cyan mx-auto mb-4" />
          <p className="text-on-surface-variant">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen text-on-surface relative">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-electric-cyan/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        
        {/* Panel Izquierdo: Información Personal */}
        <div className="glass-card p-8 rounded-3xl border border-white/5 h-fit flex flex-col items-center text-center shadow-2xl">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-electric-cyan/30 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
            {user.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <UserIcon size={48} className="text-white/40" />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{user.user_metadata?.full_name || user.user_metadata?.name || 'Cliente'}</h2>
          <p className="text-on-surface-variant bg-white/5 px-4 py-1.5 rounded-full text-sm font-mono border border-white/5">
            {user.email}
          </p>

          <div className="w-full mt-8 pt-8 border-t border-white/10 text-left">
            <h3 className="font-semibold text-electric-cyan text-sm uppercase tracking-wider mb-4">Información de Google</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Tus datos principales como nombre y foto de perfil se sincronizan directamente de forma segura desde tu cuenta de Google.
            </p>
          </div>
        </div>

        {/* Panel Derecho: Direcciones */}
        <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <MapPin className="text-electric-cyan" size={24} />
              Mis Direcciones de Envío
            </h2>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-electric-cyan hover:bg-cyan-400 text-surface-container font-bold py-2 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Plus size={18} />
              Añadir Dirección
            </button>
          </div>

          {loading ? (
            <div className="animate-pulse flex flex-col items-center justify-center py-12 gap-3 text-on-surface-variant">
              <Loader2 className="animate-spin text-electric-cyan" size={32} />
              Cargando direcciones...
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
              <MapPin size={48} className="mx-auto text-white/20 mb-4" />
              <p className="text-on-surface-variant mb-4">Aún no tienes direcciones de envío guardadas.</p>
              <button onClick={() => handleOpenModal()} className="text-electric-cyan font-semibold hover:underline">
                ¡Añade tu primera dirección!
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className={`p-5 rounded-2xl border transition-all ${addr.is_default ? 'bg-electric-cyan/5 border-electric-cyan/30 shadow-[0_0_20px_rgba(0,229,255,0.05)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-lg">{addr.alias}</h4>
                      {addr.is_default && (
                        <span className="bg-electric-cyan text-surface-container text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star size={10} fill="currentColor" /> Principal
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(addr)} className="text-on-surface-variant hover:text-electric-cyan transition-colors" title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="text-on-surface-variant hover:text-red-400 transition-colors" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-on-surface-variant text-sm space-y-1 mb-4">
                    <p>{addr.address_line}</p>
                    {addr.reference && <p className="text-white/50 italic text-xs">Ref: {addr.reference}</p>}
                    <p>{addr.city}, {addr.state}</p>
                    <p>{addr.country}</p>
                    <p className="font-mono text-white/70 mt-2">📞 {addr.phone}</p>
                  </div>

                  {!addr.is_default && (
                    <button 
                      onClick={() => handleSetDefault(addr.id)}
                      className="w-full py-2 rounded-xl text-xs font-semibold text-electric-cyan bg-electric-cyan/10 hover:bg-electric-cyan/20 transition-colors"
                    >
                      Convertir en Principal
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Dirección */}
      <AnimatePresence>
        {showAddressModal && (
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
              className="bg-surface border border-white/10 p-6 rounded-3xl w-full max-w-xl shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin size={20} className="text-electric-cyan" />
                  {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
                </h3>
                <button onClick={() => setShowAddressModal(false)} className="text-on-surface-variant hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Nombre (Ej: Casa, Oficina)</label>
                    <input 
                      type="text" 
                      required
                      value={formAlias}
                      onChange={(e) => setFormAlias(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Teléfono de Contacto</label>
                    <input 
                      type="tel" 
                      required
                      autoComplete="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">País</label>
                    <select
                      required
                      autoComplete="country"
                      value={formCountryCode}
                      onChange={(e) => { setFormCountryCode(e.target.value); setFormStateCode(''); setFormCityName(''); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors"
                    >
                      <option value="">Selecciona...</option>
                      {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">{locationService.getStateLabel(formCountryCode)}</label>
                    <select
                      required
                      autoComplete="address-level1"
                      value={formStateCode}
                      disabled={!formCountryCode}
                      onChange={(e) => { setFormStateCode(e.target.value); setFormCityName(''); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors disabled:opacity-50"
                    >
                      <option value="">Selecciona...</option>
                      {departments.map(d => <option key={d.isoCode} value={d.isoCode}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Ciudad</label>
                    <select
                      required
                      autoComplete="address-level2"
                      value={formCityName}
                      disabled={!formStateCode}
                      onChange={(e) => setFormCityName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors disabled:opacity-50"
                    >
                      <option value="">Selecciona...</option>
                      {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1">Dirección (Calle, Carrera, Número)</label>
                  <input 
                    type="text" 
                    required
                    autoComplete="street-address"
                    value={formAddressLine}
                    onChange={(e) => setFormAddressLine(e.target.value)}
                    placeholder="Ej: Calle 123 #45-67 Apto 801"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1">Referencia o Indicaciones (Opcional)</label>
                  <input 
                    type="text" 
                    value={formReference}
                    onChange={(e) => setFormReference(e.target.value)}
                    placeholder="Ej: Conjunto Torres del Sol, Torre 2"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                  <button 
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    disabled={saving}
                    className="px-6 py-3 rounded-xl font-semibold text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={saving || !formCountryCode || !formStateCode || !formCityName}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-electric-cyan text-surface-container hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Guardando...' : 'Guardar Dirección'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
