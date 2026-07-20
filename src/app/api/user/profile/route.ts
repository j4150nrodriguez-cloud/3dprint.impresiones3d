import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // 1. Obtener la cookie de sesión o el token de la cabecera si es posible, 
    // pero como en Navbar estamos usando la API desde el cliente de forma simple, 
    // lo ideal es enviar el token en la cabecera (authorization)
    
    const authHeader = req.headers.get('authorization');
    const supabase = getSupabaseAdmin();
    
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    } else {
      // Intento de sacar sesión de la cookie (si el cliente de SSR lo maneja)
      // Como fallback de seguridad, si no hay header, fallamos
      return NextResponse.json({ error: 'Unauthorized, no auth header' }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Obtener el perfil del usuario
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, active_vendedor')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);

  } catch (err) {
    console.error("Profile fetch error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
