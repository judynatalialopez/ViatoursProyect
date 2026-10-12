<script setup>
</script>

<template>
  <Header />

  <section class="home bill" style="background-image: url(/img/bg-login.png);">
    <div class="container">
      <h1>Resument de tu <span>viaje</span></h1>
      <Decoration variante="yellow">
        <h3>organiza tus paradas y revisa el total</h3>
      </Decoration>

      <div class="container-billing">
        <div class="col-left">
          <div class="box">
            <div class="title">
              <h4>Tu itinerario</h4>
              <p class="small">
                <i class="fa-solid fa-grip-dots-vertical"></i>
                Arrastra para reordenar tus paradas
              </p>
            </div>

            <div class="content-itinerary">
              <div class="card-itinerary">
                <i class="fa-solid fa-grip-dots-vertical"></i>
                <div class="data">
                  <div class="content">
                    <div class="circle">
                      1
                    </div>
                    <div class="img">
                      <img src="/img/places/route/zipaquira/img-01.jpg" alt="">
                    </div>
                    <div class="txt">
                      <h5>Mina de sal</h5>
                      <p><i class="fa-solid fa-place-of-worship"></i> Recorrido</p>
                      <span class="state finish">Terminada</span>
                    </div>
                  </div>
                  <p class="price">
                    $ 120.000 <span>COP</span>
                  </p>
                </div>
              </div>
              <div class="card-itinerary">
                <i class="fa-solid fa-grip-dots-vertical"></i>
                <div class="data">
                  <div class="content">
                    <div class="circle">
                      1
                    </div>
                    <div class="img">
                      <img src="/img/places/route/zipaquira/img-02.jpg" alt="">
                    </div>
                    <div class="txt">
                      <h5>Mina de sal</h5>
                      <p><i class="fa-solid fa-place-of-worship"></i> Recorrido</p>
                      <span class="state start">Inicio</span>
                    </div>
                  </div>
                  <p class="price">
                    $ 120.000 <span>COP</span>
                  </p>
                </div>
              </div>
              <div class="card-itinerary">
                <i class="fa-solid fa-grip-dots-vertical"></i>
                <div class="data">
                  <div class="content">
                    <div class="circle">
                      1
                    </div>
                    <div class="img">
                      <img src="/img/places/route/zipaquira/img-03.jpg" alt="">
                    </div>
                    <div class="txt">
                      <h5>Mina de sal</h5>
                      <p><i class="fa-solid fa-utensils"></i>Restaurante</p>
                      <span class="state earring">Pendiente</span>
                    </div>
                  </div>
                  <p class="price">
                    $ 120.000 <span>COP</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="box time">
            <div class="title col border-bt">
              <h4>Tiempo del recorrido</h4>
              <p>Consulta la duración y añade tiempo si lo necesitas.</p>
            </div>

            <div class="time-options">
              <div class="time-item">
                <i class="fa-regular fa-clock" aria-hidden="true"></i>

                <div class="time-description">
                  <h5>Tiempo total del recorrido</h5>
                  <p>Duración estimada para todas tus paradas.</p>
                </div>

                <span class="time-value">4 horas</span>
              </div>

              <div class="time-item">
                <i class="fa-regular fa-clock" aria-hidden="true"></i>

                <div class="time-description">
                  <label for="extra-time">Tiempo adicional</label>
                  <p>Añade más tiempo para todo el recorrido.</p>
                </div>

                <div class="time-input">
                  <input type="number" id="extra-time" name="extra_time" min="0" step="1" value="0"
                    aria-label="Horas adicionales para todo el recorrido">
                  <span>h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-right">
          <div class="box">
            <div class="title col border-bt">
              <h4>Resumen del viaje</h4>
              <p>
                <i class="fa-solid fa-location-dot"></i> Zipaquirá
              </p>
            </div>

            <div class="txt">
              <div class="trip-items">
                <div class="row">
                  <p>
                    <i class="fa-solid fa-place-of-worship"></i>
                    Recorridos <span>(2)</span>
                  </p>
                  <strong>$120.000</strong>
                </div>

                <div class="row">
                  <p>
                    <i class="fa-solid fa-utensils"></i>
                    Restaurante <span>(2)</span>
                  </p>
                  <strong>$120.000</strong>
                </div>
              </div>

              <div class="trip-total">
                <div class="total-description">
                  <h5>Total estimado</h5>
                  <p>Incluye recorridos y restaurante.</p>
                </div>

                <div class="total-price">
                  <strong>$240.000</strong>
                  <span>COP</span>
                </div>
              </div>

              <div class="payment-method">
                <h5>Método de pago</h5>

                <div class="payment-cash">
                  <i class="fa-solid fa-money-bill"></i>
                  <span>Efectivo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>