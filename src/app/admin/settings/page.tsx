'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link as LinkIcon, Plus, Trash2, Save, Globe, Instagram, Facebook, Twitter, Youtube, Linkedin, Github } from 'lucide-react'

// Función para detectar la plataforma desde la URL
const detectPlatform = (url: string) => {
  const lowerUrl = url.toLowerCase()
  if (lowerUrl.includes('instagram.com')) return 'Instagram'
  if (lowerUrl.includes('facebook.com')) return 'Facebook'
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'Twitter / X'
  if (lowerUrl.includes('youtube.com')) return 'YouTube'
  if (lowerUrl.includes('linkedin.com')) return 'LinkedIn'
  if (lowerUrl.includes('tiktok.com')) return 'TikTok'
  if (lowerUrl.includes('github.com')) return 'GitHub'
  if (lowerUrl.includes('whatsapp.com') || lowerUrl.includes('wa.me')) return 'WhatsApp'
  if (url.trim() === '') return 'Nueva Red Social'
  return 'Sitio Web (Otro)'
}

export default function AdminSettingsPage() {
  const [socialLinks, setSocialLinks] = useState<{ id: string, platform: string, url: string }[]>([])
  
  useEffect(() => {
    // Cargar enlaces desde localStorage si existen
    const saved = localStorage.getItem('social_links')
    if (saved) {
      setSocialLinks(JSON.parse(saved))
    } else {
      setSocialLinks([
        { id: '1', platform: 'Facebook', url: 'https://facebook.com/3dprint' },
        { id: '2', platform: 'Instagram', url: 'https://instagram.com/3dprint' },
      ])
    }
  }, [])

  const handleAddLink = () => {
    setSocialLinks([...socialLinks, { id: Date.now().toString(), platform: 'Nueva Red Social', url: '' }])
  }

  const handleRemoveLink = (id: string) => {
    setSocialLinks(socialLinks.filter(l => l.id !== id))
  }

  const handleUrlChange = (id: string, newUrl: string) => {
    const platform = detectPlatform(newUrl)
    setSocialLinks(socialLinks.map(l => l.id === id ? { ...l, url: newUrl, platform } : l))
  }

  const handleSave = () => {
    // Filtrar enlaces vacíos y guardar
    const validLinks = socialLinks.filter(l => l.url.trim() !== '')
    localStorage.setItem('social_links', JSON.stringify(validLinks))
    setSocialLinks(validLinks) // Actualizar UI a los válidos
    alert('¡Ajustes guardados! Los enlaces de redes sociales ahora aparecerán en toda la página (Footer).')
  }

  return (
    <div className="text-on-surface relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
          <Globe className="text-white" size={24} />
        </div>
        <h1 className="text-3xl md:text-4xl font-display-lg font-bold text-white tracking-tight">Redes Sociales</h1>
      </div>

      <div className="glass-card rounded-2xl p-8 border-white/5 max-w-3xl">
        <div className="mb-6 pb-6 border-b border-white/10">
          <p className="text-sm text-on-surface-variant mt-1">Simplemente pega el enlace de tu perfil y nosotros detectaremos automáticamente qué red social es. Aparecerán en el pie de página público.</p>
        </div>

        <div className="space-y-4 mb-8">
          <AnimatePresence>
            {socialLinks.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-white/5 p-4 rounded-xl border border-white/5 relative overflow-hidden"
              >
                <div className="w-48 flex items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/10 text-white`}>
                    {link.platform}
                  </div>
                </div>
                
                <div className="w-full md:flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LinkIcon className="text-on-surface-variant" size={16} />
                    </div>
                    <input 
                      type="url" 
                      placeholder="Ej: https://instagram.com/tu-tienda"
                      value={link.url}
                      onChange={(e) => handleUrlChange(link.id, e.target.value)}
                      className="w-full bg-surface-container border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <button 
                    onClick={() => handleRemoveLink(link.id)}
                    className="w-12 h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all hover:scale-110 active:scale-95" 
                    title="Eliminar"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-white/10">
          <button 
            onClick={handleAddLink}
            className="px-5 py-3 rounded-xl font-semibold text-electric-cyan hover:bg-electric-cyan/10 border border-electric-cyan/20 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Añadir Red Social
          </button>
          
          <button 
            onClick={handleSave}
            className="px-6 py-3 rounded-xl font-bold bg-electric-cyan text-surface-container hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <Save size={20} />
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  )
}
