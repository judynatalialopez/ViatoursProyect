export default defineNuxtPlugin((nuxtApp) => {
  const { track } = useTracking()

  const toId = (v: unknown) => {
    const n = Number(v)
    return Number.isInteger(n) && n > 0 ? n : null
  }

  nuxtApp.vueApp.directive('track-view', {
    mounted(el: any, binding) {
      el._trackId = toId(binding.value)
      el._trackTimer = null

      const send = () => {
        if (el._trackId !== null) track(el._trackId, 'view')
      }

      // Escritorio: el mouse se queda 0.8 s sobre ESTA tarjeta
      el._onEnter = () => {
        clearTimeout(el._trackTimer)
        el._trackTimer = setTimeout(send, 800)
      }
      el._onLeave = () => clearTimeout(el._trackTimer)

      // Celular: toque (tap) sobre ESTA tarjeta. No usa touchstart
      // para que arrastrar el slider no cuente como vista.
      el._onClick = () => {
        clearTimeout(el._trackTimer)
        send()
      }

      el.addEventListener('mouseenter', el._onEnter)
      el.addEventListener('mouseleave', el._onLeave)
      el.addEventListener('click', el._onClick)
    },

    updated(el: any, binding) {
      el._trackId = toId(binding.value)
    },

    unmounted(el: any) {
      clearTimeout(el._trackTimer)
      el.removeEventListener('mouseenter', el._onEnter)
      el.removeEventListener('mouseleave', el._onLeave)
      el.removeEventListener('click', el._onClick)
    },
  })
})