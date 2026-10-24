<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')

const submitLogin = async () => {
  error.value = ''

  if (!email.value.trim() || !password.value.trim()) {
    error.value = 'Completa el correo y la contraseña para continuar.'
    return
  }

  if (import.meta.client) {
    sessionStorage.setItem('viatours-admin-session', 'active')
  }

  await navigateTo('/admin')
}
</script>

<template>
  <main class="admin-login">
    <section class="admin-login__visual">
      <div class="admin-login__overlay"></div>
      <div class="admin-login__brand">
        <img src="/img/icon-mount.png" alt="Viatours">
        <span>TU GUÍA DE EXPERIENCIAS</span>
      </div>
      <div class="admin-login__copy">
        <p>ADMINISTRACIÓN</p>
        <h1>Gestiona los lugares que merecen ser visitados</h1>
      </div>
    </section>

    <section class="admin-login__panel">
      <div class="admin-login__form-wrap">
        <a href="/" class="admin-login__back">
          <i class="fa-light fa-arrow-left-long"></i>
          VOLVER AL SITIO
        </a>

        <div class="admin-login__heading">
          <span>VIATOURS</span>
          <h2>Iniciar sesión</h2>
          <p>Accede al panel de administración para gestionar destinos y lugares.</p>
        </div>

        <form class="admin-login__form" @submit.prevent="submitLogin">
          <label>
            <span>Correo electrónico</span>
            <div class="admin-field-icon">
              <i class="fa-light fa-envelope"></i>
              <input v-model="email" type="email" autocomplete="email" placeholder="Correo electrónico">
            </div>
          </label>

          <label>
            <span>Contraseña</span>
            <div class="admin-field-icon admin-field-icon--password">
              <i class="fa-light fa-lock"></i>
              <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Contraseña">
              <button type="button" class="admin-password-toggle" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                <i :class="showPassword ? 'fa-light fa-eye-slash' : 'fa-light fa-eye'"></i>
              </button>
            </div>
          </label>

          <p v-if="error" class="admin-login__error">{{ error }}</p>

          <button class="btn admin-login__submit" type="submit">
            INGRESAR
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </form>
      </div>
    </section>
  </main>
</template>
