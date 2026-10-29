export const useCatalogLive = (onChange: () => void) => {
  const config = useRuntimeConfig()
  let es: EventSource | null = null
  let timer: ReturnType<typeof setTimeout>

  const trigger = () => {
    clearTimeout(timer)
    timer = setTimeout(onChange, 300) // evita refrescar varias veces seguidas
  }

  onMounted(() => {
    es = new EventSource(`${config.public.apiBase}/events`)
    es.addEventListener('catalog', trigger)
    // al volver a la pestaña, sincroniza por si se perdió algún evento
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) trigger()
    })
  })

  onBeforeUnmount(() => {
    es?.close()
    clearTimeout(timer)
  })
}