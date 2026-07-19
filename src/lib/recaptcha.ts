/**
 * Obtiene un token de reCAPTCHA v3 usando el script cargado globalmente.
 * No requiere ningún paquete externo — funciona con React 19.
 */
export const getRecaptchaToken = async (action: string): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.grecaptcha) {
      console.warn('reCAPTCHA no está cargado todavía')
      resolve('')
      return
    }
    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
          { action }
        )
        resolve(token)
      } catch (err) {
        console.error('reCAPTCHA error:', err)
        resolve('')
      }
    })
  })
}
