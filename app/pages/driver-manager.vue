<script setup>
import { ref, computed, onUnmounted } from 'vue'
const isRecordOpen = ref(false)
const showFinishModal = ref(false)
const confettiPieces = Array.from({ length: 70 }, (_, id) => ({
  id,
  left: `${(id * 47.37) % 100}%`,
  delay: `${(id * 0.13) % 2.5}s`,
  duration: `${3 + (id % 5) * 0.45}s`,
  color: ['#ffd166', '#06d6a0', '#118ab2', '#ef476f', '#8338ec'][id % 5],
}))
function reloadPage() { window.location.reload() }
const hours = ref(null)
const minutes = ref(null)
const remainingSeconds = ref(0)
const plannedSeconds = ref(0)
const tripStatus = ref('pending') // pending, ready, running, finished
const startDate = ref(null)
const endDate = ref(null)
const itinerary = ref([
  { id: 1, status: 'pending' },
  { id: 2, status: 'pending' },
  { id: 3, status: 'pending' },
])
let timerId = null
let deadline = null
let startedAtMs = null
function formatDuration(seconds) {
  const s = Math.max(0, Math.floor(seconds))
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map(v => String(v).padStart(2, '0')).join(':')
}
const remainingTime = computed(() => formatDuration(remainingSeconds.value))
const dateFormatter = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
const formatDate = (date) => date ? dateFormatter.format(date) : 'Pendiente'
// Cada parada se desbloquea solo al terminar la inmediatamente anterior.
function canAdvanceItinerary(index) {
  const item = itinerary.value[index]
  return Boolean(item && item.status !== 'finished' &&
    (index === 0 || itinerary.value[index - 1].status === 'finished'))
}
function stopTimer() {
  if (timerId !== null) clearInterval(timerId)
  timerId = null
  deadline = null
}
function finishTrip() {
  if (tripStatus.value !== 'running') return
  const now = new Date()
  endDate.value = now
  remainingSeconds.value = 0
  tripStatus.value = 'finished'
  stopTimer()
  showFinishModal.value = true
}
function updateTimer() {
  if (tripStatus.value !== 'running' || deadline === null) return
  const now = Date.now()
  remainingSeconds.value = Math.max(0, Math.ceil((deadline - now) / 1000))
  if (deadline !== null && now >= deadline) finishTrip()
}
function submitTime() {
  if (tripStatus.value === 'running' || tripStatus.value === 'finished') return
  const h = Number(hours.value || 0)
  const m = Number(minutes.value || 0)
  if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || m < 0 || m > 59 || h + m === 0) {
    window.alert('Ingresa una duración válida de al menos 1 minuto (0 a 59 minutos).')
    return
  }
  stopTimer()
  startedAtMs = null
  plannedSeconds.value = h * 3600 + m * 60
  remainingSeconds.value = plannedSeconds.value
  startDate.value = null
  endDate.value = null
  tripStatus.value = 'ready'
}
function startTrip() {
  if (tripStatus.value !== 'ready' || plannedSeconds.value <= 0) return
  startDate.value = new Date()
  endDate.value = null
  startedAtMs = startDate.value.getTime()
  deadline = startedAtMs + plannedSeconds.value * 1000
  tripStatus.value = 'running'
  updateTimer()
  timerId = setInterval(updateTimer, 250)
}
function handleTripButton() {
  if (tripStatus.value === 'ready') startTrip()
  else if (tripStatus.value === 'running' && startedAtMs !== null && Date.now() - startedAtMs >= 1000) finishTrip()
}
function advanceItinerary(index) {
  const item = itinerary.value[index]
  if (!item || !canAdvanceItinerary(index)) return
  if (item.status === 'pending') item.status = 'running'
  else if (item.status === 'running') item.status = 'finished'
}
const itineraryLabel = (status) => ({ pending: 'Comenzar', running: 'En proceso', finished: 'Terminado' }[status])
onUnmounted(stopTimer)
</script>

<template>
  <Header />
  <section class="home bill" style="background-image: url('/img/bg-login.png');">
    <div class="container">
      <h1>CONDUCTOR</h1>
      <Decoration variante="yellow">
        <ul>
          <li>JUAN MANUEL MILLAN CACERES</li>
          <li>PLACA <strong>AAA111</strong></li>
        </ul>
      </Decoration>
      <div class="container-billing">
        <div class="col-left">
          <div class="box time">
            <div class="title col border-bt">
              <h4>Orden de itinerario</h4>
              <p>(Usuario puede ajustar el orden)</p>
            </div>
            <div class="content-driver-place">
              <div class="item">
                <div class="title-place">
                  <div class="circle">
                    1
                  </div>
                  <p>Mina de sal</p>
                </div>
                <button type="button" class="icon"
                  :class="{ red: itinerary[0].status === 'finished', yellow: itinerary[0].status === 'running' }"
                  :disabled="!canAdvanceItinerary(0)" @click="advanceItinerary(0)">
                  {{ itineraryLabel(itinerary[0].status) }}
                </button>
              </div>
              <div class="item">
                <div class="title-place">
                  <div class="circle">
                    2
                  </div>
                  <p>Mina de sal</p>
                </div>
                <button type="button" class="icon"
                  :class="{ red: itinerary[1].status === 'finished', yellow: itinerary[1].status === 'running' }"
                  :disabled="!canAdvanceItinerary(1)" @click="advanceItinerary(1)">
                  {{ itineraryLabel(itinerary[1].status) }}
                </button>
              </div>
              <div class="item">
                <div class="title-place">
                  <div class="circle">
                    3
                  </div>
                  <p>Mina de sal</p>
                </div>
                <button type="button" class="icon"
                  :class="{ red: itinerary[2].status === 'finished', yellow: itinerary[2].status === 'running' }"
                  :disabled="!canAdvanceItinerary(2)" @click="advanceItinerary(2)">
                  {{ itineraryLabel(itinerary[2].status) }}
                </button>
              </div>
            </div>
          </div>
          <div class="box time">
            <div class="title border-bt">
              <div>
                <h4>Servicio actual</h4>
                <p>Solo puede haber un servicio activo </p>
              </div>
            </div>
            <div class="table">
              <div class="table__header">
                <div class="table__cell">Lugar</div>
                <div class="table__cell">Destinos(cant)</div>
                <div class="table__cell">hora inicio</div>
                <div class="table__cell">Nombre</div>
                <div class="table__cell">Valor total</div>
              </div>
              <div class="table__body">
                <div class="table__row">
                  <div class="table__cell">Zipaquíra</div>
                  <div class="table__cell">3</div>
                  <div class="table__cell">$ 78.000</div>
                  <div class="table__cell">Juan Pérez</div>
                  <div class="table__cell">$ 78.000</div>
                </div>
              </div>
            </div>
          </div>
          <div class="box record">
            <div class="title" :class="{ active: isRecordOpen }" @click="isRecordOpen = !isRecordOpen">
              <h4>Historial de recorridos</h4>
              <i class="fa-solid fa-angle-down"></i>
            </div>
            <div v-show="isRecordOpen" class="content-itinerary">
              <div class="card-itinerary">
                <div class="data">
                  <div class="content">
                    <div class="img"><img src="/img/places/route/zipaquira/img-01.jpg" alt="Mina de sal"
                        draggable="false"></div>
                    <div class="txt">
                      <h5>Zipaquira</h5>
                      <p><i class="fa-solid fa-user"></i>Vanessa Lucia Soto</p>
                      <p><i class="fa-solid fa-place-of-worship"></i><span>4</span> destinos</p>
                      <p class="gray"><i class="fa-regular fa-clock"></i>12/05/2024 · <span>12:30pm</span></p>
                    </div>
                  </div>
                  <p class="price">$ 120.000 <span>COP</span></p>
                </div>
              </div>
              <div class="card-itinerary">
                <div class="data">
                  <div class="content">
                    <div class="img"><img src="/img/places/route/zipaquira/img-02.jpg" alt="Mina de sal"
                        draggable="false"></div>
                    <div class="txt">
                      <h5>Bogotá D.C</h5>
                      <p><i class="fa-solid fa-user"></i>Johan Ramirez Beltran</p>
                      <p><i class="fa-solid fa-place-of-worship"></i><span>4</span> destinos</p>
                      <p class="gray"><i class="fa-regular fa-clock"></i>12/05/2024 · <span>12:30pm</span></p>
                    </div>
                  </div>
                  <p class="price">$ 120.000 <span>COP</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-right">
          <div class="box">
            <div class="title border-bt">
              <div>
                <h4>Resumen del viaje</h4>
                <p><i class="fa-solid fa-location-dot"></i> Zipaquirá</p>
              </div> <span class="state start">{{ tripStatus === 'running' ? 'Activo' : tripStatus === 'finished' ?
                'Finalizado' : 'Pendiente' }}</span>
            </div>
            <div class="txt">
              <div class="time-top">
                <div class="time-item">
                  <i class="fa-regular fa-clock" aria-hidden="true"></i>
                  <div class="time-description">
                    <h5>Tiempo restante</h5>
                  </div><span class="time-value">{{ remainingTime }}</span>
                </div>
                <Button class="small" type="button" :disabled="tripStatus === 'pending' || tripStatus === 'finished'"
                  @click="handleTripButton">
                  <i
                    :class="tripStatus === 'running' ? 'fa-solid fa-stop' : tripStatus === 'finished' ? 'fa-solid fa-check' : 'fa-solid fa-play'"></i>
                  {{ tripStatus === 'running' ? 'Terminar' : tripStatus === 'finished' ? 'Finalizado' : 'Comenzar' }}
                </Button>
              </div>
              <div class="trip-items">
                <div class="row">
                  <p><i class="fa-regular fa-hourglass-start"></i> <span>Hora inicio</span> · {{ formatDate(startDate)
                    }} </p>
                </div>
                <div class="row">
                  <p><i class="fa-regular fa-hourglass-end"></i> <span>Hora final</span> · {{ formatDate(endDate) }}
                  </p>
                </div>
              </div>
              <div class="trip-total">
                <div class="total-description">
                  <h5>Total estimado</h5>
                  <p>Incluye recorridos y restaurante.</p>
                </div>
                <div class="total-price"><strong> $198.000</strong><span>COP</span></div>
              </div>
              <div v-if="tripStatus === 'pending'" class="time-form-time">
                <form class="form-time" @submit.prevent="submitTime">
                  <div class="form-group">
                    <label>¿Cuánto tiempo deseas programar para el viaje?</label>
                    <p>Ingresa las horas y los minutos del recorrido antes de comenzar.</p>
                    <div class="time-inputs">
                      <div class="time-input">
                        <input id="hours" v-model.number="hours"
                          :disabled="tripStatus === 'running' || tripStatus === 'finished'" type="number" name="hours"
                          min="0" placeholder="0" aria-label="Horas adicionales" />
                        <span>Horas</span>
                      </div>
                      <div class="time-input">
                        <input id="minutes" v-model.number="minutes"
                          :disabled="tripStatus === 'running' || tripStatus === 'finished'" type="number" name="minutes"
                          min="0" max="59" placeholder="0" aria-label="Minutos adicionales" />
                        <span>Minutos</span>
                      </div>
                    </div>
                  </div>
                  <Button type="button" class="small" :disabled="tripStatus === 'running' || tripStatus === 'finished'"
                    @click="submitTime">
                    <i class="fa-solid fa-paper-plane"></i>
                    {{ tripStatus === 'finished' ? 'Finalizado' : 'Enviar' }}
                  </Button>
                  <p v-if="tripStatus === 'ready'" role="status">Tiempo registrado: {{ remainingTime }}. Ya puedes
                    comenzar.</p>
                  <p v-if="tripStatus === 'running'" role="status">Recorrido en curso.</p>
                  <p v-if="tripStatus === 'finished'" role="status">Recorrido finalizado. No se pueden registrar más
                    horas ni iniciar de nuevo.</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showFinishModal" class="modal-overlay modal-overlay--completed">
        <div class="confetti-layer" aria-hidden="true">
          <span v-for="piece in confettiPieces" :key="piece.id" class="confetti-piece"
            :style="{ left: piece.left, animationDelay: piece.delay, animationDuration: piece.duration, backgroundColor: piece.color }"></span>
        </div>
        <div class="modal-route modal-route--completed" role="dialog" aria-modal="true"
          aria-labelledby="modal-route-title">
          <div class="modal-route__content">
            <h2 id="modal-route-title">¡Felicidades por completar el recorrido!</h2>
            <p>Gracias por acompañar a tus pasajeros hasta el final de esta experiencia. ¡Excelente trabajo!</p>
            <button type="button" class="small modal-route__restart" @click="reloadPage">
              <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
