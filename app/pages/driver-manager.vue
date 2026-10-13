<script setup>
import { ref } from 'vue'

const isRecordOpen = ref(false)
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
              </div> <span class="state start">Activo</span>
            </div>

            <div class="txt">
              <div class="time-top">
                <div class="time-item">
                  <i class="fa-regular fa-clock" aria-hidden="true"></i>
                  <div class="time-description">
                    <h5>Tiempo transcurso</h5>
                  </div><span class="time-value">03:58:46</span>
                </div>
                <Button class="small"><i class="fa-solid fa-play"></i>Comenzar</Button>
              </div>
              <div class="trip-items">
                <div class="row">
                  <p><i class="fa-regular fa-hourglass-start"></i> <span>Hora inicio</span>· 08:30m </p>
                </div>
                <div class="row">
                  <p><i class="fa-regular fa-hourglass-end"></i> <span>Hora final</span>· 17:30pm </p>
                </div>
              </div>
              <div class="trip-total">
                <div class="total-description">
                  <h5>Total estimado</h5>
                  <p>Incluye recorridos y restaurante.</p>
                </div>
                <div class="total-price"><strong> $198.000</strong><span>COP</span></div>
              </div>
              <div class="time-options">
                <div class="time-item">
                  <i class="fa-regular fa-clock" aria-hidden="true"></i>
                  <div class="time-description">
                    <h5>Tiempo transcurrido</h5>
                  </div><span class="time-value">03:58:46</span>
                </div>
                <div class="time-item">
                  <i class="fa-regular fa-clock" aria-hidden="true"></i>
                  <div class="time-description"><label for="extra-time">Tiempo adicional</label>
                    <p> Añade más tiempo para todo el recorrido (1hr = 20.000). </p>
                  </div>
                  <div class="time-input"><input id="extra-time" type="number" name="extra_time" min="0" step="1"
                      aria-label="Horas adicionales para todo el recorrido"><span>h</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
