'use client'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types/product'
import styles from './TarjetaProducto.module.css'

const categoryLabel: Record<string, string> = {
  mascotas: '🐾 Mascotas',
  cocina: '🍳 Cocina',
  corporativo: '🏢 Corporativo',
}

export default function TarjetaProducto({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <div className={styles.card}>
      <div className={styles.badge}>{categoryLabel[product.category]}</div>
      <div className={styles.imageBox}>
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className={styles.img}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.desc}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)} <small>USD</small></span>
          <button
            className={styles.btn}
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar 🛒'}
          </button>
        </div>
      </div>
    </div>
  )
}
