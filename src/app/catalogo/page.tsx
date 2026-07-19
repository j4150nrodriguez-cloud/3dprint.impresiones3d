import { supabase } from '@/lib/supabase'
import TarjetaProducto from '@/components/TarjetaProducto'
import styles from './catalogo.module.css'

interface Props {
  searchParams: Promise<{ cat?: string }>
}

export const dynamic = 'force-dynamic'

export default async function CatalogoPage({ searchParams }: Props) {
  const params = await searchParams
  const cat = params?.cat

  let query = supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false })
  if (cat) query = query.eq('category', cat)

  const { data: products, error } = await query

  const catLabels: Record<string, string> = {
    mascotas: '🐾 Mascotas',
    cocina: '🍳 Cocina',
    corporativo: '🏢 Corporativo',
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{cat ? catLabels[cat] ?? 'Catálogo' : 'Catálogo Completo'}</h1>
          <p>{products?.length ?? 0} productos disponibles</p>
        </div>

        {/* Filtros */}
        <div className={styles.filters}>
          <a href="/catalogo" className={`${styles.filterBtn} ${!cat ? styles.active : ''}`}>Todos</a>
          <a href="/catalogo?cat=mascotas" className={`${styles.filterBtn} ${cat === 'mascotas' ? styles.active : ''}`}>🐾 Mascotas</a>
          <a href="/catalogo?cat=cocina" className={`${styles.filterBtn} ${cat === 'cocina' ? styles.active : ''}`}>🍳 Cocina</a>
          <a href="/catalogo?cat=corporativo" className={`${styles.filterBtn} ${cat === 'corporativo' ? styles.active : ''}`}>🏢 Corporativo</a>
        </div>

        {error && <p className={styles.error}>Error al cargar productos. Intenta de nuevo.</p>}

        {products?.length === 0 && (
          <div className={styles.empty}>
            <p>No hay productos en esta categoría aún. ¡Pronto añadiremos más!</p>
          </div>
        )}

        <div className={styles.grid}>
          {products?.map(p => <TarjetaProducto key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  )
}
