export default defineNuxtPlugin((nuxtApp) => {
  const { track } = useTracking()

  nuxtApp.vueApp.directive('track-view', {
    mounted(el, binding) {
      const observer = new IntersectionObserver(([entry]) => {
  if (entry?.isIntersecting) {
    track(binding.value, 'view')
    observer.disconnect()
  }
}, { threshold: 0.5 })

      observer.observe(el)
      el._viewObserver = observer
    },
    unmounted(el) {
      el._viewObserver?.disconnect()
    },
  })
})