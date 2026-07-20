import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Missing Supabase environment variables')
  _supabase = createClient(url, key)
  return _supabase
}

export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase Service Role Key environment variable')
  _supabaseAdmin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  return _supabaseAdmin
}

// Exportación compatible con código existente — lazy para evitar crash en build
export const getSupabaseClient = (): SupabaseClient => getSupabase()

// Proxy que solo instancia el cliente cuando se usa, no en módulo load
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient]
  },
})
