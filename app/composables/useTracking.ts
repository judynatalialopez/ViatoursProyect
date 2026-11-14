// composables/useTracking.ts
export const useTracking = () => {
  const config = useRuntimeConfig() // se llama aquí, dentro del contexto de Nuxt

  const getVisitorId = () => {
    try {
      let id = localStorage.getItem('visitor_id')
      if (!id) {
        id = crypto.randomUUID()
        localStorage.setItem('visitor_id', id)
      }
      return id
    } catch {
      return crypto.randomUUID() // si localStorage está bloqueado
    }
  }

  const getDevice = () =>
    window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'

  const track = (placeId: number, eventType: 'view' | 'click' | 'favorite' = 'view') => {
    if (!import.meta.client) return

    fetch(`${config.public.apiBase}/analytics/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placeId,
        visitorId: getVisitorId(),
        eventType,
        device: getDevice(),
      }),
      keepalive: true,
    }).catch(() => {})
  }

  return { track }
}