'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import styles from './CarritoModal.module.css'

export default function CarritoModal({ onClose }: { onClose: () => void }) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Tu Selección Exclusiva 💎</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>No tienes productos seleccionados.</p>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <Image src={item.image_url} alt={item.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemTitle}>{item.title}</p>
                    <p className={styles.itemPrice}>${item.price.toFixed(2)} USD</p>
                    <div className={styles.qty}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className={styles.remove} onClick={() => removeItem(item.id)}>🗑</button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.total}>
                <span>Total:</span>
                <span className={styles.totalPrice}>${totalPrice.toFixed(2)} USD</span>
              </div>
              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                ¡Completar Mi Pedido Ahora! 🚀
              </button>
              <button className={styles.clearBtn} onClick={clearCart}>Vaciar selección</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
