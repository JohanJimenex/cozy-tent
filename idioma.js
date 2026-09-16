// Idioma por lo que tenga el navegador, y se recuerda al cambiarlo.
(function(){
  const guardado = localStorage.getItem("cozy.idioma");
  const inicial = guardado || ((navigator.language||"en").startsWith("es") ? "es" : "en");
  poner(inicial);
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-idioma-boton]");
    if (b) { poner(b.dataset.idiomaBoton); localStorage.setItem("cozy.idioma", b.dataset.idiomaBoton); }
  });
  function poner(idioma){
    document.body.dataset.idioma = idioma;
    document.documentElement.lang = idioma;
    document.querySelectorAll("[data-idioma-boton]").forEach(b =>
      b.setAttribute("aria-pressed", String(b.dataset.idiomaBoton === idioma)));
  }
})();
