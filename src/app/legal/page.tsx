import React from 'react'
import Link from 'next/link'
import { ShieldCheck, Scale, FileText } from 'lucide-react'

export const metadata = {
  title: 'Términos y Condiciones Legales | Dexora',
  description: 'Términos de servicio, políticas de privacidad y garantías de 3DPrint Impresiones (Una marca de Dexora).',
}

export default function LegalPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-16 max-w-[1024px] mx-auto text-on-surface">
      
      {/* Header */}
      <div className="mb-16 text-center md:text-left">
        <h1 className="font-display-lg text-4xl md:text-5xl font-bold mb-4 text-white">
          Términos Legales y Privacidad
        </h1>
        <p className="font-body-lg text-on-surface-variant text-lg">
          Última actualización: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="mt-6 p-4 glass-card rounded-lg inline-block border-electric-cyan/20 bg-electric-cyan/5">
          <p className="font-semibold text-sm">
            <span className="text-electric-cyan">Aviso Legal Importante:</span> La plataforma tecnológica de <strong>3DPrint Impresiones</strong> fue diseñada y es desarrollada activamente por la agencia de desarrollo <strong>Nexora Digital</strong> (<a href="https://nexora-digital-portal.vercel.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Conoce más aquí</a>). Nexora actúa únicamente como proveedor tecnológico.
          </p>
        </div>
      </div>

      <div className="space-y-16">
        
        {/* Términos de Servicio */}
        <section className="scroll-mt-32" id="terminos">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-electric-cyan">
              <Scale size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">1. Términos de Servicio (TOS)</h2>
          </div>
          <div className="prose prose-invert max-w-none text-on-surface-variant font-body-lg">
            <p>
              Al acceder y utilizar los servicios de <strong>3DPrint Impresiones</strong> (en adelante, "la Tienda" o "el Servicio"), usted acepta estar sujeto a estos términos. Esta plataforma tecnológica es desarrollada por <strong>Nexora Digital</strong>, pero las transacciones comerciales, garantías y entregas son responsabilidad del dueño de la marca 3DPrint Impresiones.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Exactitud de Modelos 3D:</strong> Las imágenes mostradas en el catálogo son renderizados digitales o prototipos. Debido a la naturaleza de la fabricación aditiva (FDM/FFF), pueden existir ligeras variaciones en la textura superficial (líneas de capa) de los productos finales.</li>
              <li><strong>Precios:</strong> Todos los precios están denominados en Pesos Colombianos (COP) salvo que se indique lo contrario. 3DPrint Impresiones se reserva el derecho de modificar los precios sin previo aviso.</li>
              <li><strong>Propiedad Intelectual:</strong> Los diseños personalizados subidos por el cliente son propiedad del cliente. Los diseños del catálogo estándar son propiedad intelectual exclusiva de 3DPrint Impresiones y no pueden ser reproducidos ni comercializados.</li>
            </ul>
          </div>
        </section>

        {/* Políticas de Envíos y Garantías */}
        <section className="scroll-mt-32" id="garantias">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-tertiary">
              <FileText size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">2. Envíos, Tiempos de Fabricación y Garantías</h2>
          </div>
          <div className="prose prose-invert max-w-none text-on-surface-variant font-body-lg">
            <p>
              A diferencia de los comercios tradicionales, nuestros productos se fabrican bajo demanda (Print-On-Demand) a menos que se indique stock disponible.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Tiempos de Producción:</strong> El tiempo estándar de fabricación por pieza es de 2 a 5 días hábiles, dependiendo del volumen de impresión y la carga del taller.</li>
              <li><strong>Envíos:</strong> Realizamos envíos a toda Colombia a través de transportadoras aliadas. El tiempo de tránsito es independiente del tiempo de fabricación.</li>
              <li><strong>Garantía Estructural:</strong> Ofrecemos una garantía de 30 días contra defectos de impresión o deslaminación en condiciones de uso normal. <em>La garantía no cubre:</em> exposición prolongada a temperaturas superiores a 50°C (para PLA), impactos contundentes, o mal uso del producto.</li>
            </ul>
          </div>
        </section>

        {/* Política de Privacidad (Ley 1581) */}
        <section className="scroll-mt-32" id="privacidad">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-status-green">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">3. Política de Privacidad y Tratamiento de Datos (Ley 1581)</h2>
          </div>
          <div className="prose prose-invert max-w-none text-on-surface-variant font-body-lg">
            <p>
              En cumplimiento de la <strong>Ley 1581 de 2012</strong> de la República de Colombia, 3DPrint Impresiones actúa como responsable del tratamiento de sus datos personales.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Uso de la Información:</strong> Recopilamos su correo electrónico (mediante Google OAuth/Supabase), nombre y dirección de envío exclusivamente para procesar pedidos, enviar notificaciones sobre el estado de fabricación, y contactarle por soporte (WhatsApp).</li>
              <li><strong>Seguridad:</strong> Utilizamos pasarelas de pago externas. La tienda no almacena ni procesa datos de tarjetas de crédito o débito en sus propios servidores.</li>
              <li><strong>Derechos del Titular:</strong> Como usuario, usted tiene derecho a conocer, actualizar, rectificar y solicitar la eliminación de sus datos de nuestras bases de datos en cualquier momento comunicándose con nosotros.</li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  )
}
