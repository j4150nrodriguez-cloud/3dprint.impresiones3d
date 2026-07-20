'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Box, X, Save, Image as ImageIcon, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import imageCompression from 'browser-image-compression'

export default function AdminCatalogPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [compressionStats, setCompressionStats] = useState<{orig: string, comp: string} | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (!error && data) {
      setProducts(data)
    }
    setLoading(false)
  }

  const handleEditClick = (p: any) => {
    setEditingProduct({ ...p })
    setImageFile(null)
    setImagePreview(p.image_url || null)
    setCompressionStats(null)
  }

  const handleNewProduct = () => {
    setEditingProduct({
      title: '',
      price: 0,
      category: 'mascotas',
      stock: 0,
      comision_tipo: 'porcentaje',
      comision_valor: 10,
      precio_vendedor: 0,
      isNew: true
    })
    setImageFile(null)
    setImagePreview(null)
    setCompressionStats(null)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const originalSize = (file.size / 1024 / 1024).toFixed(2)
      
      try {
        const options = {
          maxSizeMB: 0.5, // 500kb max
          maxWidthOrHeight: 1024,
          useWebWorker: true,
          fileType: 'image/webp'
        }
        
        const compressedFile = await imageCompression(file, options)
        const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2)
        
        setCompressionStats({ orig: originalSize, comp: compressedSize })
        setImageFile(compressedFile)
        setImagePreview(URL.createObjectURL(compressedFile))
      } catch (error) {
        console.error("Error compressing image:", error)
        alert("Error al comprimir la imagen.")
      }
    }
  }

  const handleSaveEdit = async () => {
    setSaving(true)
    let finalImageUrl = editingProduct.image_url

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.webp`
      const filePath = `catalog/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile)

      if (uploadError) {
        console.error(uploadError)
        alert('Error al subir imagen')
        setSaving(false)
        return
      }

      const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(filePath)
      finalImageUrl = publicUrlData.publicUrl
    }

    const payload = {
      title: editingProduct.title,
      price: editingProduct.price,
      category: editingProduct.category,
      stock: editingProduct.stock,
      comision_tipo: editingProduct.comision_tipo,
      comision_valor: editingProduct.comision_valor,
      precio_vendedor: editingProduct.precio_vendedor,
      image_url: finalImageUrl
    }

    if (editingProduct.isNew) {
      const { error } = await supabase.from('products').insert([payload])
      if (error) console.error(error)
    } else {
      const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id)
      if (error) console.error(error)
    }

    await fetchProducts()
    setEditingProduct(null)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if(confirm("¿Estás seguro de eliminar este producto?")) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  const availableCategories = Array.from(new Set(products.map(p => p.category)))
  if (!availableCategories.includes('mascotas')) availableCategories.push('mascotas')
  if (!availableCategories.includes('cocina')) availableCategories.push('cocina')
  if (!availableCategories.includes('corporativo')) availableCategories.push('corporativo')

  return (
    <div className="text-on-surface relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-electric-cyan flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Box className="text-white" size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-display-lg font-bold text-white tracking-tight">Gestión de Catálogo</h1>
        </div>
        
        <button 
          onClick={handleNewProduct}
          className="bg-electric-cyan hover:bg-cyan-400 text-surface-container font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-on-surface-variant text-sm tracking-wider uppercase">
                <th className="p-5 font-semibold">Producto</th>
                <th className="p-5 font-semibold">Categoría</th>
                <th className="p-5 font-semibold">Precio Cliente</th>
                <th className="p-5 font-semibold">Comisión</th>
                <th className="p-5 font-semibold">Stock</th>
                <th className="p-5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-on-surface-variant">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin" />
                      Cargando productos...
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p, index) => (
                  <motion.tr 
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-5 font-bold text-white flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-white/5" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <ImageIcon size={16} className="text-white/20" />
                        </div>
                      )}
                      {p.title}
                    </td>
                    <td className="p-5 uppercase text-xs tracking-wider text-electric-cyan font-bold">{p.category}</td>
                    <td className="p-5 font-mono font-bold text-status-green text-base">${Number(p.price).toFixed(2)}</td>
                    <td className="p-5">
                      {p.comision_tipo === 'porcentaje' ? (
                        <span className="text-purple-400 font-mono bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20">{p.comision_valor}%</span>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-blue-400 font-mono bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 w-fit mb-1">Diferencia</span>
                          <span className="text-xs text-on-surface-variant">Base: ${p.precio_vendedor?.toFixed(2)}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-lg font-mono font-bold border ${p.stock > 0 ? 'bg-status-green/10 text-status-green border-status-green/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {p.stock} uds.
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2 transition-opacity">
                        <button 
                          onClick={() => handleEditClick(p)}
                          className="w-10 h-10 rounded-full bg-white/5 hover:bg-electric-cyan/20 text-on-surface-variant hover:text-electric-cyan flex items-center justify-center transition-all hover:scale-110 active:scale-95" 
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 text-on-surface-variant hover:text-red-400 flex items-center justify-center transition-all hover:scale-110 active:scale-95" 
                        >
                          <Trash2 size={18} />
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

      <AnimatePresence>
        {editingProduct && (
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
              className="bg-surface border border-white/10 p-6 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Pencil size={20} className="text-electric-cyan" />
                  {editingProduct.isNew ? 'Nuevo Producto' : 'Editar Producto'}
                </h3>
                <button onClick={() => setEditingProduct(null)} className="text-on-surface-variant hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                
                {/* Image Upload */}
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/20 rounded-xl hover:border-electric-cyan transition-colors relative group overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-32 object-contain" />
                  ) : (
                    <div className="text-center text-on-surface-variant">
                      <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                      <span className="text-sm">Subir Imagen (WebP Ligero)</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                {compressionStats && (
                  <div className="text-xs text-center text-electric-cyan">
                    Comprimida de {compressionStats.orig}MB a {compressionStats.comp}MB (Súper rápida)
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1">Nombre del producto</label>
                  <input 
                    type="text" 
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1">Categoría</label>
                  <div className="flex gap-2">
                    <select
                      value={availableCategories.includes(editingProduct.category) ? editingProduct.category : 'otra'}
                      onChange={(e) => {
                        if(e.target.value !== 'otra') {
                          setEditingProduct({...editingProduct, category: e.target.value})
                        } else {
                          setEditingProduct({...editingProduct, category: ''})
                        }
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors capitalize"
                    >
                      {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="otra">++ Nueva Categoría ++</option>
                    </select>
                    {(!availableCategories.includes(editingProduct.category) && editingProduct.category !== undefined) && (
                      <input 
                        type="text" 
                        placeholder="Nombre nueva categoría..."
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value.toLowerCase()})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors"
                      />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Precio Cliente Público ($)</label>
                    <input 
                      type="number" 
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Stock Disponible</label>
                    <input 
                      type="number" 
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4 mt-4">
                  <h4 className="text-electric-cyan font-semibold text-sm">Configuración para Asesores/Vendedores</h4>
                  
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Tipo de Comisión</label>
                    <select
                      value={editingProduct.comision_tipo || 'porcentaje'}
                      onChange={(e) => setEditingProduct({...editingProduct, comision_tipo: e.target.value})}
                      className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors"
                    >
                      <option value="porcentaje">Porcentaje Fijo (%)</option>
                      <option value="diferencia">Diferencia (Precio Asesor Especial)</option>
                    </select>
                  </div>

                  {editingProduct.comision_tipo === 'porcentaje' ? (
                    <div>
                      <label className="block text-sm font-semibold text-on-surface-variant mb-1">Porcentaje de Comisión (%)</label>
                      <input 
                        type="number" 
                        value={editingProduct.comision_valor || 0}
                        onChange={(e) => setEditingProduct({...editingProduct, comision_valor: parseFloat(e.target.value)})}
                        className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-on-surface-variant mb-1">Precio Asesor ($)</label>
                      <input 
                        type="number" 
                        value={editingProduct.precio_vendedor || 0}
                        onChange={(e) => setEditingProduct({...editingProduct, precio_vendedor: parseFloat(e.target.value)})}
                        className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:border-electric-cyan focus:outline-none transition-colors font-mono"
                      />
                      <p className="text-xs text-on-surface-variant mt-2">La comisión será la diferencia entre el precio cobrado y este Precio Asesor.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => setEditingProduct(null)}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl font-semibold text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-electric-cyan text-surface-container hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
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
