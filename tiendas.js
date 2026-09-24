// Marca la tienda que corresponde al aparato desde el que se entra y enseña el botón de
// descarga apuntando a ella. No redirige solo: quien llega a la portada ha venido a ver el
// juego, y sacarlo de aquí sin pedírselo se lleva por delante el tráiler y las capturas.
// El salto a la tienda lo decide la persona, pulsando.
(function () {
  // Cada tienda con su dirección. Sin dirección = todavía no está publicado ahí.
  const TIENDAS = {
    google: "https://play.google.com/store/apps/details?id=com.jopam.cozytent",
    apple: null,
    steam: null,
    meta: null,
  };

  // Nombre que se enseña en el botón, no el de la tienda: "Descargar para Android".
  const NOMBRE = {
    google: { es: "para Android", en: "for Android" },
    apple: { es: "para iPhone y iPad", en: "for iPhone and iPad" },
    steam: { es: "en Steam", en: "on Steam" },
    meta: { es: "para Meta Quest", en: "for Meta Quest" },
  };

  function cual() {
    const ua = navigator.userAgent || "";
    // El Quest se identifica como Android: va antes para no mandarlo a Google Play.
    if (/OculusBrowser|Quest/i.test(ua)) return "meta";
    if (/Android/i.test(ua)) return "google";
    if (/iPhone|iPod/i.test(ua)) return "apple";
    // El iPad se hace pasar por Mac desde iPadOS 13; lo delata que la pantalla es táctil.
    if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "apple";
    if (/Windows|Macintosh|Linux/i.test(ua)) return "steam";
    return null;
  }

  const tienda = cual();
  if (!tienda) return;

  // Si en esa tienda todavía no está, no se marca nada: resaltar un "Pronto" solo dirige
  // la mirada a lo que no se puede hacer.
  const url = TIENDAS[tienda];
  if (!url) return;

  const chapa = document.querySelector('[data-tienda="' + tienda + '"]');
  if (chapa) chapa.classList.add("tuya");

  const boton = document.getElementById("descargar");
  if (!boton) return;
  boton.href = url;
  boton.querySelectorAll("[data-sistema]").forEach(b => {
    b.textContent = NOMBRE[tienda][b.closest(".en") ? "en" : "es"];
  });
  boton.hidden = false;
})();
