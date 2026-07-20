import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingData, userId, isVendedor } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    let total_amount = 0;
    let comision_vendedor = 0;

    // Obtener los precios reales de la BD para prevenir fraude
    const productIds = items.map((i: any) => i.id);
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (dbError || !dbProducts) {
      return NextResponse.json({ error: 'Products not found' }, { status: 400 });
    }

    const orderItemsToInsert = [];

    for (const item of items) {
      const dbProduct = dbProducts.find((p: any) => p.id === item.id);
      if (!dbProduct) continue;

      const price_unit = dbProduct.precio_cliente || dbProduct.price;
      const price_vendedor_unit = dbProduct.precio_vendedor || dbProduct.price;
      
      const itemTotal = price_unit * item.quantity;
      total_amount += itemTotal;

      if (isVendedor) {
        if (dbProduct.comision_tipo === 'diferencia') {
          comision_vendedor += (price_unit - price_vendedor_unit) * item.quantity;
        } else if (dbProduct.comision_tipo === 'porcentaje') {
          const pct = dbProduct.comision_valor || 0;
          comision_vendedor += (price_unit * (pct / 100)) * item.quantity;
        }
      }

      orderItemsToInsert.push({
        product_id: item.id,
        quantity: item.quantity,
        price_unit,
        price_vendedor_unit
      });
    }

    // 1. Crear la orden
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: !isVendedor ? userId : null,
        vendedor_id: isVendedor ? userId : null,
        status: 'pending',
        total_amount,
        comision_vendedor,
        direccion_envio: shippingData.direccion,
        telefono: shippingData.telefono,
        ciudad: shippingData.ciudad,
        departamento: shippingData.departamento
      })
      .select('id')
      .single();

    if (orderError || !orderData) {
      console.error("Order creation error:", orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // 2. Insertar los items
    const itemsWithOrderId = orderItemsToInsert.map(i => ({
      ...i,
      order_id: orderData.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsError) {
      console.error("Order items error:", itemsError);
    }

    // 3. Generar firma de integridad Wompi
    const reference = orderData.id;
    const amountInCents = Math.round(total_amount * 100).toString();
    const currency = 'COP';
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET || '';

    // Cadena concatenada: referencia + monto + moneda + secreto
    const stringToHash = `${reference}${amountInCents}${currency}${integritySecret}`;
    const hashBuffer = crypto.createHash('sha256').update(stringToHash).digest('hex');

    return NextResponse.json({
      orderId: reference,
      amountInCents,
      currency,
      signature: hashBuffer
    });

  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
