// Tipos para la API de reCAPTCHA v3 cargada por script global
interface Grecaptcha {
  ready: (callback: () => void) => void
  execute: (siteKey: string, options: { action: string }) => Promise<string>
}

declare global {
  interface Window {
    grecaptcha: Grecaptcha
  }
}

export {}
