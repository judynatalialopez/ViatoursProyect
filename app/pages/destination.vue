<template>
  <section class="destination cover">
    <div class="before-item"></div>

    <div class="container">
      <div class="title-item">
        <a href="/" class="return"><i class="fa-light fa-arrow-left-long"></i>VOLVER</a>
        <h3>DESTINOS</h3>
        <h1>¿A dónde quieres ir hoy?</h1>
        <p>Cada destino tiene una historia por descubir. Explora nuestras recomendaciones y encuentra lugares que harán
          especial tu visita.</p>
      </div>
    </div>
    <div class="content-bg">
      <img src="/img/" alt="">
    </div>
  </section>

  <section class="destination container-places">
    <div class="container">
      <form action="" class="filters">
        <input type="text" placeholder="Buscar destino..">

        <div class="filters">
          <div class="content-tags">
            <button class="tag">Todos <span>12</span></button>
            <button class="tag"><i class="fa-light fa-utensils"></i> Restaurantes <span>12</span></button>
            <button class="tag"><i class="fa-light fa-gem"></i>Joyeria <span>12</span></button>
            <button class="tag"><i class="fa-light fa-map"></i>Experienca <span>12</span></button>
          </div>
          <div class="sort-by">
            <p>Ordenar por</p>
            <select name="opcion" id="opcion">
              <option value="">Selecciona una opción</option>
              <option value="opcion-1">Recomendados</option>
              <option value="opcion-2">Recientes</option>
              <option value="opcion-3">Antiguos</option>
            </select>
          </div>
        </div>
      </form>

      <div class="container-grid">
        <a href="" class="item">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS51uAlE5twImZjwY6QBzENZjXl32tGXNqUODtOh9CQDY0iLlY6HFAGe9M2&s=10"
            alt="Bogotá">
          <h3>Bogotá</h3>
          <i class="fa-regular fa-angle-right"></i>
        </a>

        <a href="" class="item">
          <img
            src="https://viajala.com.co/news/wp-content/uploads/2026/01/renovacion-del-centro-historico-de-Zipaquira.jpg"
            alt="Zipaquirá">
          <h3>Zipaquirá</h3>
          <i class="fa-regular fa-angle-right"></i>
        </a>

        <a href="" class="item">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRinLkumlrp5gcToxdJImpZ1tTZ3-hpRPBA38k72gc7CGJxYBSDMia4DQc&s=10"
            alt="Villa de Leyva">
          <h3>Villa de Leyva</h3>
          <i class="fa-regular fa-angle-right"></i>
        </a>

        <a href="" class="item">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHdu-61HuAvmIFyEqXSQ1f5vVQmmYfZVpliOHTqjPOvNJ8pQ0QQxZc6uIw&s=10"
            alt="Boyacá">
          <h3>Boyacá</h3>
          <i class="fa-regular fa-angle-right"></i>
        </a>

        <a href="" class="item">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZzPW32Rk8t4FpNc8Yk5qV0Zxfc3FRXbMkg0fNlBMSqoRCd7Uz0B0NJN-J&s=10"
            alt="Villavicencio">
          <h3>Villavicencio</h3>
          <i class="fa-regular fa-angle-right"></i>
        </a>

        <a href="" class="item">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPq_HDumpedSesXhY-jEOXobxu9o7NLwuSMc069LZipmQOf97W8X7EVMc&s=10"
            alt="Eje cafetero">
          <h3>Eje cafetero</h3>
          <i class="fa-regular fa-angle-right"></i>
        </a>

      </div>
    </div>
  </section>
</template>