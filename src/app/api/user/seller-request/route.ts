import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // 1. Validar la sesión
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      // Intento de obtener token de cookies (forma simplificada)
      // Idealmente usaríamos @supabase/ssr aquí
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = getSupabaseAdmin();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Actualizar el perfil (role = vendedor, active_vendedor = false)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'vendedor', active_vendedor: false })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json({ error: 'Error al actualizar perfil' }, { status: 500 });
    }

    // 3. Enviar correo al administrador notificando la nueva solicitud
    const { data: admins } = await supabase
      .from("profiles")
      .select("email")
      .eq("role", "admin");

    if (admins && admins.length > 0 && process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmails = admins.map(a => a.email).filter(Boolean);
        
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: adminEmails,
          subject: `Nueva solicitud de Vendedor: ${user.email}`,
          html: `
            <h2>¡Nueva solicitud de Vendedor!</h2>
            <p>El usuario <strong>${user.email}</strong> ha solicitado unirse al programa "Trabaja con nosotros".</p>
            <p>Ingresa al panel de administrador para revisar y aprobar su solicitud.</p>
          `
        });
      } catch (emailErr) {
        console.error("Error sending admin emails:", emailErr);
      }
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Seller request error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
