'use client'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types/product'

const categoryLabel: Record<string, string> = {
  mascotas: 'PETS',
  cocina: 'KITCHEN',
  corporativo: 'CORPORATE',
}

const materialLabel: Record<string, string> = {
  mascotas: 'PLA MATTE',
  cocina: 'PETG FOOD-SAFE',
  corporativo: 'PLA GOLD',
}

export default function TarjetaProducto({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <div className="group glass-card rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,229,255,0.15)] flex flex-col h-full border border-white/5">
      <div className="relative h-64 overflow-hidden bg-surface-container-high">
        <Image
          src={product.image_url || '/placeholder.png'}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-4 left-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <span className="font-label-caps text-[10px] text-electric-cyan tracking-wider font-bold">
            {categoryLabel[product.category] || 'PRODUCT'}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-headline-lg text-lg font-bold group-hover:text-electric-cyan transition-colors text-white">
            {product.title}
          </h3>
          <span className="font-label-caps text-electric-cyan font-bold whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-auto space-y-4">
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-label-caps text-on-surface-variant border border-white/5 uppercase">
              {materialLabel[product.category] || 'PLA'}
            </span>
            <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-label-caps text-on-surface-variant border border-white/5 uppercase">
              {product.stock > 0 ? 'EN STOCK' : 'AGOTADO'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
              className="w-full bg-electric-cyan text-on-primary py-2.5 rounded font-label-caps text-[11px] font-bold hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {product.stock === 0 ? 'AGOTADO' : 'COMPRAR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
