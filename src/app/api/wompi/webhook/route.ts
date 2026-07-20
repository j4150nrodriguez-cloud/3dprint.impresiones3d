import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("X-Wompi-Webhook-Token");
  if (signature !== process.env.WOMPI_EVENTS_KEY) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    console.log("Wompi webhook received", payload);

    if (payload.event === "transaction.updated") {
      const transaction = payload.data.transaction;
      const orderId = transaction.reference;
      
      let status = "pending";
      if (transaction.status === "APPROVED") {
        status = "paid";
      } else if (transaction.status === "DECLINED" || transaction.status === "ERROR" || transaction.status === "VOIDED") {
        status = "failed";
      }

      const supabase = getSupabaseAdmin();
      const { error } = await supabase
        .from("orders")
        .update({ 
          status, 
          wompi_transaction_id: transaction.id 
        })
        .eq("id", orderId);

      if (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Error updating order" }, { status: 500 });
      }
      
      // Send email notification to admins
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
            subject: `Actualización de Orden ${orderId} - Estado: ${status}`,
            html: `<p>La orden <strong>${orderId}</strong> ha cambiado a estado: <strong>${status}</strong>.</p>
                   <p>Transacción Wompi: ${transaction.id}</p>`
          });
        } catch (emailErr) {
          console.error("Error sending admin emails:", emailErr);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

