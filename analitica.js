// Google Analytics con modo de consentimiento. Hasta que el visitante acepta no se guardan
// cookies: Google solo recibe avisos anónimos de visita. La respuesta se recuerda en el navegador.
(function () {
  const ID = "G-LPPDR795J5";
  const CLAVE = "cozy.analitica";

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }

  let respuesta = null;
  try { respuesta = localStorage.getItem(CLAVE); } catch (e) {}

  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: respuesta === "si" ? "granted" : "denied",
  });
  gtag("js", new Date());
  gtag("config", ID);

  const carga = document.createElement("script");
  carga.async = true;
  carga.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
  document.head.appendChild(carga);

  if (respuesta) return;

  const aviso = document.createElement("div");
  aviso.className = "aviso-cookies";
  aviso.setAttribute("role", "region");
  aviso.setAttribute("aria-label", "Cookies");
  aviso.innerHTML =
    '<p><span class="es">Esta web usa Google Analytics para contar visitas. ¿Aceptas sus cookies? ' +
    '<a href="privacidad-es.html">Privacidad</a></span>' +
    '<span class="en">This site uses Google Analytics to count visits. Do you accept its cookies? ' +
    '<a href="privacidad-es.html">Privacy</a></span></p>' +
    '<div class="botones">' +
    '<button type="button" data-cookies="no"><span class="es">Rechazar</span><span class="en">Decline</span></button>' +
    '<button type="button" data-cookies="si" class="si"><span class="es">Aceptar</span><span class="en">Accept</span></button>' +
    '</div>';
  document.body.appendChild(aviso);

  aviso.addEventListener("click", e => {
    const boton = e.target.closest("[data-cookies]");
    if (!boton) return;
    const eleccion = boton.dataset.cookies;
    try { localStorage.setItem(CLAVE, eleccion); } catch (e) {}
    if (eleccion === "si") gtag("consent", "update", { analytics_storage: "granted" });
    aviso.remove();
  });
})();
