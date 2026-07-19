'use client'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import styles from './CarritoModal.module.css'

export default function CarritoModal({ onClose }: { onClose: () => void }) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()

  const handleWompi = () => {
    const pubKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY
    const ref = `3dprint-${Date.now()}`
    const amountCents = Math.round(totalPrice * 100 * 4000) // COP conversion (approx)
    const url = `https://checkout.wompi.co/p/?public-key=${pubKey}&currency=COP&amount-in-cents=${amountCents}&reference=${ref}`
    window.open(url, '_blank')
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Tu Carrito 🛒</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>No tienes productos en el carrito.</p>
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
              <button className={styles.checkoutBtn} onClick={handleWompi}>
                Pagar con Wompi 💳
              </button>
              <button className={styles.clearBtn} onClick={clearCart}>Vaciar carrito</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
