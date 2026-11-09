<template>
  <div ref="cursorDot" class="cursor-dot" :class="{ 'is-visible': isVisible }" />

  <div ref="cursorRing" class="cursor-ring" :class="{
    'is-visible': isVisible,
    'is-hovering': isHovering,
    'is-clicking': isClicking
  }" />
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted
} from 'vue'

const cursorDot = ref(null)
const cursorRing = ref(null)

const isVisible = ref(false)
const isHovering = ref(false)
const isClicking = ref(false)

let mouseX = 0
let mouseY = 0

let ringX = 0
let ringY = 0

let animationFrame = null

const handleMouseMove = (event) => {

  mouseX = event.clientX
  mouseY = event.clientY

  isVisible.value = true

  if (cursorDot.value) {

    cursorDot.value.style.transform =
      `translate3d(${mouseX}px, ${mouseY}px, 0)`

  }

}


const animateRing = () => {

  const speed = 0.15

  ringX += (mouseX - ringX) * speed
  ringY += (mouseY - ringY) * speed

  if (cursorRing.value) {

    cursorRing.value.style.transform =
      `translate3d(${ringX}px, ${ringY}px, 0)`

  }

  animationFrame =
    requestAnimationFrame(animateRing)

}


const handleMouseOver = (event) => {

  if (
    event.target.closest(
      `
      a,
      button,
      input,
      textarea,
      select,
      [role="button"],
      .cursor-hover
      `
    )
  ) {

    isHovering.value = true

  }

}


const handleMouseOut = (event) => {

  if (
    event.target.closest(
      `
      a,
      button,
      input,
      textarea,
      select,
      [role="button"],
      .cursor-hover
      `
    )
  ) {

    isHovering.value = false

  }

}


const handleMouseDown = () => {

  isClicking.value = true

}


const handleMouseUp = () => {

  isClicking.value = false

}


/* =========================
   EFECTO TOUCH MOBILE
========================= */

const handleTouchStart = (event) => {

  const touch =
    event.touches[0]

  if (!touch) return

  const effect =
    document.createElement('div')

  effect.classList.add('touch-effect')

  effect.style.left =
    `${touch.clientX}px`

  effect.style.top =
    `${touch.clientY}px`

  document.body.appendChild(effect)

  effect.addEventListener(
    'animationend',
    () => {
      effect.remove()
    }
  )

}


onMounted(() => {

  window.addEventListener(
    'mousemove',
    handleMouseMove
  )

  document.addEventListener(
    'mouseover',
    handleMouseOver
  )

  document.addEventListener(
    'mouseout',
    handleMouseOut
  )

  document.addEventListener(
    'mousedown',
    handleMouseDown
  )

  document.addEventListener(
    'mouseup',
    handleMouseUp
  )

  document.addEventListener(
    'touchstart',
    handleTouchStart,
    {
      passive: true
    }
  )

  animateRing()

})


onUnmounted(() => {

  window.removeEventListener(
    'mousemove',
    handleMouseMove
  )

  document.removeEventListener(
    'mouseover',
    handleMouseOver
  )

  document.removeEventListener(
    'mouseout',
    handleMouseOut
  )

  document.removeEventListener(
    'mousedown',
    handleMouseDown
  )

  document.removeEventListener(
    'mouseup',
    handleMouseUp
  )

  document.removeEventListener(
    'touchstart',
    handleTouchStart
  )

  cancelAnimationFrame(
    animationFrame
  )

})
</script>