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

  // Lluvia: cada gota con su largo, su velocidad y su transparencia, para que no se note el patrón.
  const cortina = document.querySelector(".lluvia");
  if (cortina && !quieto) for (let i = 0; i < 95; i++) {
    const gota = document.createElement("div");
    gota.className = "gota";
    gota.style.left = (Math.random() * 106 - 3) + "vw";
    gota.style.height = (12 + Math.random() * 30).toFixed(0) + "px";
    gota.style.opacity = (.22 + Math.random() * .38).toFixed(2);
    gota.style.animationDuration = (.75 + Math.random() * .95).toFixed(2) + "s";
    gota.style.animationDelay = (-Math.random() * 2).toFixed(2) + "s";
    cortina.appendChild(gota);
  }

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
  // Cabecera: se encoge al bajar y el menú se pliega en móvil.
  const barra = document.querySelector(".barra");
  const menu = document.getElementById("menu");
  const abrir = document.getElementById("abrir");
  if (barra) {
    const marcar = () => barra.classList.toggle("pegada", scrollY > 30);
    marcar(); addEventListener("scroll", marcar, { passive: true });
  }
  if (abrir && menu) {
    abrir.addEventListener("click", () => {
      const visible = menu.classList.toggle("abierto");
      abrir.setAttribute("aria-expanded", String(visible));
    });
    menu.addEventListener("click", e => { if (e.target.closest("a")) menu.classList.remove("abierto"); });
  }
  // Los enlaces del menú llevan a su sitio. Se intenta el desplazamiento suave del navegador,
  // pero si se queda a medias (pasa cuando la pestaña no está en primer plano) se salta y punto.
  document.addEventListener("click", e => {
    const enlace = e.target.closest('a[href^="#"]');
    if (!enlace) return;
    const id = enlace.getAttribute("href").slice(1);
    const destino = id ? document.getElementById(id) : null;
    if (id && !destino) return;
    e.preventDefault();

    const alto = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--alto-barra")) || 64;
    const hasta = destino ? Math.max(0, destino.getBoundingClientRect().top + scrollY - alto - 12) : 0;
    try { scrollTo({ top: hasta, behavior: quieto ? "auto" : "smooth" }); }
    catch { scrollTo(0, hasta); }
    setTimeout(() => { if (Math.abs(scrollY - hasta) > 4) scrollTo(0, hasta); }, 700);
    if (id) history.replaceState(null, "", "#" + id);
  });

})();
