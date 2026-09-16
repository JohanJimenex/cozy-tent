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
  // El correo no va escrito en el HTML: se arma aquí para que los robots de spam no lo pillen
  // leyendo la página. No es infalible, pero se libra de los que solo buscan "mailto:".
  document.querySelectorAll("a.correo").forEach(a => {
    const dir = a.dataset.u + String.fromCharCode(64) + a.dataset.d;
    a.href = "mailto:" + dir;
    if (a.dataset.texto) a.textContent = dir;
  });

  // Carrusel de imágenes en móvil: puntos, flechas y paso solo. En pantallas grandes la
  // galería sigue siendo una rejilla y esto no hace nada.
  const galeria = document.querySelector(".galeria");
  const puntos = document.querySelector(".puntos");
  if (galeria && puntos) {
    const tomas = [...galeria.children];
    tomas.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.role = "tab"; b.setAttribute("aria-label", "Imagen " + (i + 1));
      b.addEventListener("click", () => ir(i, true));
      puntos.appendChild(b);
    });

    let actual = 0, solo = null, tocado = false, pendiente = null, hastaCuando = 0;
    const enCarrusel = () => matchMedia("(max-width: 700px)").matches;

    function ir(i, aMano) {
      actual = (i + tomas.length) % tomas.length;
      const hasta = tomas[actual].offsetLeft - galeria.offsetLeft - 14;
      // Se anula el respaldo anterior: con clics seguidos, el viejo tiraba hacia atrás.
      clearTimeout(pendiente);
      hastaCuando = Date.now() + 750;
      galeria.scrollTo({ left: hasta, behavior: quieto ? "auto" : "smooth" });
      // Si el deslizamiento suave se queda a medias, se coloca de golpe.
      pendiente = setTimeout(() => {
        if (Math.abs(galeria.scrollLeft - hasta) > 6) galeria.scrollLeft = hasta;
      }, 700);
      marcar();
      if (aMano) tocado = true;
    }
    function marcar() {
      [...puntos.children].forEach((b, i) => b.setAttribute("aria-selected", String(i === actual)));
    }
    function mirar() {
      // Mientras se está moviendo por un clic, no se hace caso a las posiciones intermedias.
      if (Date.now() < hastaCuando) return;
      const centro = galeria.scrollLeft + galeria.clientWidth / 2;
      let cerca = 0, dif = Infinity;
      tomas.forEach((t, i) => {
        const d = Math.abs(t.offsetLeft - galeria.offsetLeft + t.clientWidth / 2 - centro);
        if (d < dif) { dif = d; cerca = i; }
      });
      if (cerca !== actual) { actual = cerca; marcar(); }
    }

    galeria.addEventListener("scroll", () => requestAnimationFrame(mirar), { passive: true });
    galeria.addEventListener("pointerdown", () => tocado = true, { passive: true });
    document.querySelector(".flecha.atras").addEventListener("click", () => ir(actual - 1, true));
    document.querySelector(".flecha.adelante").addEventListener("click", () => ir(actual + 1, true));
    marcar();

    // Solo pasa sola mientras la galería se está viendo.
    let aLaVista = false;
    new IntersectionObserver(e => { aLaVista = e[0].isIntersecting; }, { threshold: .4 })
      .observe(galeria);

    // Y se queda quieta mientras el visitante baja o sube la página.
    let bajando = false, avisoBajando = null;
    addEventListener("scroll", () => {
      bajando = true;
      clearTimeout(avisoBajando);
      avisoBajando = setTimeout(() => bajando = false, 900);
    }, { passive: true });

    // Cada 5 s, y se calla del todo en cuanto el visitante la toca.
    if (!quieto) solo = setInterval(() => {
      if (tocado) { clearInterval(solo); return; }
      if (!aLaVista || bajando || !enCarrusel() || document.hidden) return;
      ir(actual + 1);
    }, 5000);
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
