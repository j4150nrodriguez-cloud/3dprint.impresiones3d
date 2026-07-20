import { getSupabaseAdmin } from './supabase'

export async function getUserProfile(userId: string) {
  const supabase = getSupabaseAdmin()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return profile
}

export async function isAdmin(userId: string) {
  const profile = await getUserProfile(userId)
  return profile?.role === 'admin'
}

export async function isVendedor(userId: string) {
  const profile = await getUserProfile(userId)
  return profile?.role === 'vendedor' && profile?.active_vendedor === true
}
