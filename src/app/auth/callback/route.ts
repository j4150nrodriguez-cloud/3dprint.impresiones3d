import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // Obtener host y protocolo de los encabezados de reenvío proxy (Vercel) o del requestUrl
  const host = request.headers.get('x-forwarded-host') || requestUrl.host
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  
  let origin = `${protocol}://${host}`

  // Si no estamos en desarrollo local, priorizar las variables de entorno oficiales de producción
  if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      origin = process.env.NEXT_PUBLIC_SITE_URL
    } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      origin = vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`
    }
  }

  if (code) {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/`)
}
