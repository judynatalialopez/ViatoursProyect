<script setup>
</script>

<template>
  <Header />

  <section class="home login start none" style="background-image: url(/img/bg-login.png);">
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
              <input type="email" name="mail" id="mail" placeholder="Ej: juan@eje.com">
            </div>
          </div>
          <div class="row">
            <div class="icon">
              <i class="fa-regular fa-lock"></i>
            </div>
            <div class="col">
              <label for="password">Contraseña</label>
              <input type="email" name="password" id="password" placeholder="·······">
            </div>
          </div>
        </div>
        <Button>Ingresar</Button>
        <div class="content-links">
          <span>¿Olvidaste<a href=""> tu contraseña?</a></span>
          <span>¿No tienes cuenta?<a href=""> Registrate</a></span>
        </div>
      </form>
    </div>
  </section>

  <section class="home login password none" style="background-image: url(/img/bg-login.png);">
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
              <label for="mail">Correo</label>
              <input type="email" name="mail" id="mail" placeholder="Ej: juan@eje.com">
            </div>
          </div>
          <p>Te enviaremos un correo con las instrucciones para recupera tu contraseña</p>
        </div>
        <Button>Recuperar</Button>
        <div class="content-links">
          <span>¿Recordaste tu contraseña?<a href=""> Iniciar sesión</a></span>
        </div>
      </form>
    </div>
  </section>

  <section class="home login create none" style="background-image: url(/img/bg-login.png);">
    <div class="container">
      <h2>Regristrese</h2>
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
              <input type="text" name="name-first" id="name-first" placeholder="Ej: Juan">
            </div>
            <div class="col">
              <label for="name-second">Segundo nombre</label>
              <input type="text" name="name-second" id="name-second" placeholder="Ej: Manuel">
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label for="last-name-first">Primer apellido</label>
              <input type="text" name="last-name-first" id="last-name-first" placeholder="Ej: Juan">
            </div>
            <div class="col">
              <label for="name-second">Segundo apellido</label>
              <input type="text" name="last-name-second" id="last-name-second" placeholder="Ej: Manuel">
            </div>
          </div>
          <div class="row">
            <div class="icon">
              <i class="fa-regular fa-envelope"></i>
            </div>
            <div class="col">
              <label for="mail">Correo</label>
              <input type="email" name="mail" id="mail" placeholder="Ej: juan@eje.com">
            </div>
          </div>
          <div class="row">
            <div class="icon">
              <i class="fa-regular fa-lock"></i>
            </div>
            <div class="col">
              <label for="password">Contraseña</label>
              <input type="email" name="mail" id="mail" placeholder="·······">
            </div>
          </div>
        </div>
        <Button>Crear</Button>
        <div class="content-links">
          <span>¿Ya tienes cuenta?<a href=""> Iniciar sesión</a></span>
        </div>
      </form>
    </div>
  </section>

  <section class="home login assign-driver" style="background-image: url(/img/bg-login.png);">
    <div class="container">
      <h2>CONDUCTOR</h2>
      <Decoration variante="yellow">
        <h3>Comencemos una nueva aventura</h3>
      </Decoration>

      <form action="">
        <div class="title">
          <i class="fa-light fa-id-card"></i>
          <div>
            <h3>Tu recorrido</h3>
            <h4>Hoy, ¿quién tendra el gusto llevarte?</h4>
          </div>
        </div>
        <div class="box">
          <div class="row">
            <div class="icon">
              <i class="fa-regular fa-car"></i>
            </div>
            <div class="col">
              <label for="plate">Placa del conducto</label>
              <input type="text" name="plate" id="plate" placeholder="Ej: ABD123">
            </div>
          </div>
        </div>
        <Button>Continuar</Button>
      </form>
    </div>
  </section>
</template>