'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<{ id: string, platform: string, url: string }[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('social_links')
    if (saved) {
      setSocialLinks(JSON.parse(saved))
    }
  }, [])

  return (
    <footer className="w-full mt-24 border-t border-white/10 bg-surface/50 backdrop-blur-md py-12">
      <div className="container mx-auto px-6 max-w-[1440px] flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Brand & Parent Company */}
        <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-1/3">
          <div className="flex items-center gap-2">
            <span className="font-display-lg text-xl font-bold text-white tracking-tighter">
              3DPrint Impresiones
            </span>
          </div>
          <p className="text-on-surface-variant text-sm font-medium">
            Desarrollado y potenciado por <a href="https://nexora-digital-portal.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white font-bold bg-gradient-to-r from-electric-cyan to-blue-500 bg-clip-text text-transparent hover:underline">Nexora Digital</a>
          </p>
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-4 w-full md:w-1/3 justify-center">
            {socialLinks.map(link => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold text-white bg-white/5 hover:bg-electric-cyan/20 hover:text-electric-cyan px-4 py-2 rounded-full border border-white/10 transition-all hover:scale-105 active:scale-95"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}

        {/* Legal Links & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-1/3 text-sm text-on-surface-variant font-medium">
          <div className="flex gap-6">
            <Link href="/legal" className="hover:text-electric-cyan transition-colors">
              Términos de Servicio
            </Link>
            <Link href="/legal" className="hover:text-electric-cyan transition-colors">
              Política de Privacidad
            </Link>
          </div>
          <p className="text-xs mt-2">
            © {new Date().getFullYear()} 3DPrint Impresiones. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}
