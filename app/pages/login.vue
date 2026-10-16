<script setup>
import { computed, ref } from 'vue'
import { drivers } from '../data/driver.js'

const formularioActual = ref(0)
const placa = ref('')

function siguienteForm() {
  formularioActual.value = (formularioActual.value + 1) % 4
}

function normalizar(texto) {
  return String(texto ?? '')
    .toUpperCase()
    .replace(/[\s-]/g, '')
    .trim()
}

const conductorEncontrado = computed(() => {
  const placaBuscada = normalizar(placa.value)

  if (!placaBuscada) return null

  return drivers.find((conductor) =>
    normalizar(conductor.id_plate) === placaBuscada
  ) || null
})

const conductorNoEncontrado = computed(() =>
  normalizar(placa.value).length >= 6 &&
  !conductorEncontrado.value
)

function nombreCompleto(conductor) {
  if (!conductor) return ''

  return [
    conductor.firs_name,
    conductor.second_name,
    conductor.firs_last_name,
    conductor.second_last_name
  ]
    .filter(Boolean)
    .join(' ')
}

function continuarConductor() {
  if (!conductorEncontrado.value) return

  // Aquí puedes agregar la navegación cuando
  // tengas definido el siguiente paso.
}
</script>

<template>
  <Header />

  <div class="prueba-form">
    <Button @click="siguienteForm">
      Siguiente form
    </Button>
  </div>

  <!-- FORMULARIO 1: INICIAR SESIÓN -->
  <section v-show="formularioActual === 0" class="home login start" style="background-image: url('/img/bg-login.png');">
    <div class="container">
      <h1>INICIAR SESIÓN</h1>

      <Decoration variante="yellow">
        <h3>Comencemos una nueva aventura</h3>
      </Decoration>

      <form action="">
        <div class="title">
          <i class="fa-regular fa-user"></i>

          <div>
            <h3>Ingresa a tu cuenta</h3>
            <h4>Accede con tus datos para continuar</h4>
          </div>
        </div>

        <div class="box">
          <div class="row">
            <div class="icon">
              <i class="fa-regular fa-envelope"></i>
            </div>

            <div class="col">
              <label for="mail">Correo</label>
              <input type="email" name="mail" id="mail" placeholder="Ej: juan@eje.com" />
            </div>
          </div>

          <div class="row">
            <div class="icon">
              <i class="fa-regular fa-lock"></i>
            </div>

            <div class="col">
              <label for="password">Contraseña</label>
              <input type="password" name="password" id="password" placeholder="·······" />
            </div>
          </div>
        </div>

        <Button>Ingresar</Button>

        <div class="content-links">
          <span>
            ¿Olvidaste
            <a href="" @click.prevent="formularioActual = 1">
              tu contraseña?
            </a>
          </span>

          <span>
            ¿No tienes cuenta?
            <a href="" @click.prevent="formularioActual = 2">
              Regístrate
            </a>
          </span>
        </div>
      </form>
    </div>
  </section>

  <!-- FORMULARIO 2: RECUPERAR CONTRASEÑA -->
  <section v-show="formularioActual === 1" class="home login password"
    style="background-image: url('/img/bg-login.png');">
    <div class="container">
      <h2>Recuperar acceso</h2>

      <Decoration variante="yellow">
        <h3>Comencemos una nueva aventura</h3>
      </Decoration>

      <form action="">
        <div class="title">
          <i class="fa-light fa-key"></i>

          <div>
            <h3>Recupera tu cuenta</h3>
            <h4>Te ayudaremos a restaurar tu acceso</h4>
          </div>
        </div>

        <div class="box">
          <div class="row">
            <div class="icon">
              <i class="fa-regular fa-envelope"></i>
            </div>

            <div class="col">
              <label for="recovery-mail">Correo</label>
              <input type="email" name="mail" id="recovery-mail" placeholder="Ej: juan@eje.com" />
            </div>
          </div>

          <p>
            Te enviaremos un correo con las instrucciones
            para recuperar tu contraseña
          </p>
        </div>

        <Button>Recuperar</Button>

        <div class="content-links">
          <span>
            ¿Recordaste tu contraseña?
            <a href="" @click.prevent="formularioActual = 0">
              Iniciar sesión
            </a>
          </span>
        </div>
      </form>
    </div>
  </section>

  <!-- FORMULARIO 3: REGISTRO -->
  <section v-show="formularioActual === 2" class="home login create"
    style="background-image: url('/img/bg-login.png');">
    <div class="container">
      <h2>Regístrate</h2>

      <Decoration variante="yellow">
        <h3>Comencemos una nueva aventura</h3>
      </Decoration>

      <form action="">
        <div class="title">
          <i class="fa-light fa-user-plus"></i>

          <div>
            <h3>Crea tu cuenta</h3>
            <h4>Completa para continuar</h4>
          </div>
        </div>

        <div class="box">
          <div class="row">
            <div class="col">
              <label for="name-first">Primer nombre</label>
              <input type="text" name="name-first" id="name-first" placeholder="Ej: Juan" />
            </div>

            <div class="col">
              <label for="name-second">Segundo nombre</label>
              <input type="text" name="name-second" id="name-second" placeholder="Ej: Manuel" />
            </div>
          </div>

          <div class="row">
            <div class="col">
              <label for="last-name-first">Primer apellido</label>
              <input type="text" name="last-name-first" id="last-name-first" placeholder="Ej: Millan" />
            </div>

            <div class="col">
              <label for="last-name-second">Segundo apellido</label>
              <input type="text" name="last-name-second" id="last-name-second" placeholder="Ej: Caceres" />
            </div>
          </div>

          <div class="row">
            <div class="col">
              <label for="id">Número identificación</label>
              <input type="number" name="id" id="id" placeholder="Ej: 1000000000" />
            </div>

            <div class="col">
              <label for="opcion">Tipo de identificación</label>

              <select name="opcion" id="opcion" required>
                <option value="" selected disabled>
                  Selecciona una opción
                </option>
                <option value="1">
                  CC – Cédula de Ciudadanía
                </option>
                <option value="2">
                  CE – Cédula de Extranjería
                </option>
                <option value="3">
                  PA – Pasaporte
                </option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="icon">
              <i class="fa-regular fa-envelope"></i>
            </div>

            <div class="col">
              <label for="register-mail">Correo</label>
              <input type="email" name="mail" id="register-mail" placeholder="Ej: juan@eje.com" />
            </div>
          </div>

          <div class="row">
            <div class="icon">
              <i class="fa-regular fa-lock"></i>
            </div>

            <div class="col">
              <label for="register-password">Contraseña</label>
              <input type="password" name="password" id="register-password" placeholder="·······" />
            </div>
          </div>
        </div>

        <Button>Crear</Button>

        <div class="content-links">
          <span>
            ¿Ya tienes cuenta?
            <a href="" @click.prevent="formularioActual = 0">
              Iniciar sesión
            </a>
          </span>
        </div>
      </form>
    </div>
  </section>

  <!-- FORMULARIO 4: CONDUCTOR -->
  <section v-show="formularioActual === 3" class="home login assign-driver"
    style="background-image: url('/img/bg-login.png');">
    <div class="container">
      <h2>CONDUCTOR</h2>

      <Decoration variante="yellow">
        <h3>Comencemos una nueva aventura</h3>
      </Decoration>

      <form @submit.prevent="continuarConductor">
        <div class="title">
          <i class="fa-light fa-id-card"></i>

          <div>
            <h3>Tu recorrido</h3>
            <h4>Hoy, ¿quién tendrá el gusto de llevarte?</h4>
          </div>
        </div>

        <div class="box">
          <div class="row">
            <div class="icon">
              <i class="fa-regular fa-car"></i>
            </div>

            <div class="col">
              <label for="plate">Placa del conductor</label>

              <input v-model="placa" type="text" name="plate" id="plate" placeholder="Ej: AAA111" autocomplete="off"
                maxlength="6" required />
            </div>
          </div>

          <!-- CONDUCTOR ENCONTRADO AUTOMÁTICAMENTE -->
          <div v-if="conductorEncontrado" class="results success" role="status">
            <i class="fa-regular fa-circle-check"></i>
            <div class="txt">
              <h3>Conductor encontrado</h3>

              <p>
                {{ nombreCompleto(conductorEncontrado) }}
              </p>

              <span>
                Placa: {{ conductorEncontrado.id_plate }}
              </span>
            </div>
          </div>
          <!-- CONDUCTOR NO ENCONTRADO -->
          <div v-else-if="conductorNoEncontrado" class="results error" role="status">
            <i class="fa-solid fa-circle-exclamation"></i>
            <div class="txt">
              <h3>No se encontró el conductor</h3>

              <p>
                No encontramos ningún conductor registrado
                con la placa "{{ placa.trim() }}".
                Verifica la placa e intenta nuevamente.
              </p>
            </div>
          </div>
        </div>

        <button class="btn small" type="submit" :disabled="!conductorEncontrado">
          Continuar
        </button>
      </form>
    </div>
  </section>
</template>
