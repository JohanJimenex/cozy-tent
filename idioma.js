// Idioma, luciérnagas y aparecer al bajar. Nada de esto hace falta para leer la página:
// si el navegador pide menos animación, el CSS las apaga y esto solo pone el idioma.
(function () {
  const guardado = localStorage.getItem("cozy.idioma");
  const inicial = guardado || ((navigator.language || "en").startsWith("es") ? "es" : "en");
  poner(inicial);

  document.addEventListener("click", e => {
    const boton = e.target.closest("[data-idioma-boton]");
    if (!boton) return;
    poner(boton.dataset.idiomaBoton);
    localStorage.setItem("cozy.idioma", boton.dataset.idiomaBoton);
    setTimeout(revisar, 30);
  });

  function poner(idioma) {
    document.body.dataset.idioma = idioma;
    document.documentElement.lang = idioma;
    document.querySelectorAll("[data-idioma-boton]").forEach(b =>
      b.setAttribute("aria-pressed", String(b.dataset.idiomaBoton === idioma)));
  }

  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Van apareciendo al bajar, como las fichas del juego.
  const ojo = new IntersectionObserver(entradas => {
    entradas.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); ojo.unobserve(e.target); } });
  }, { threshold: .12 });
  const asoman = () => document.querySelectorAll(".asoma:not(.visible)");
  asoman().forEach(el => quieto ? el.classList.add("visible") : ojo.observe(el));

  // Al cambiar de idioma aparecen bloques que antes estaban ocultos: el observador no los ve
  // hasta que se muestran, así que los que ya caben en pantalla se marcan a mano.
  function revisar() {
    asoman().forEach(el => {
      const caja = el.getBoundingClientRect();
      if (caja.height && caja.top < innerHeight && caja.bottom > 0) el.classList.add("visible");
      else ojo.observe(el);
    });
  }
  addEventListener("load", revisar);
  setTimeout(revisar, 150);

  // Luciérnagas sueltas, pocas y lentas.
  if (!quieto) for (let i = 0; i < 9; i++) {
    const bicho = document.createElement("div");
    bicho.className = "bicho";
    bicho.style.left = (4 + Math.random() * 92) + "vw";
    bicho.style.top = (18 + Math.random() * 74) + "vh";
    bicho.style.animationDelay = (Math.random() * 14).toFixed(1) + "s";
    bicho.style.animationDuration = (11 + Math.random() * 8).toFixed(1) + "s";
    document.body.appendChild(bicho);
  }
})();
