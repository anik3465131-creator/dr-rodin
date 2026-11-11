/*
 * Яндекс.Метрика
 * Номер счётчика — в переменной METRIKA_ID ниже.
 */
(function () {
  var METRIKA_ID = 0; /* TODO: номер счётчика Метрики */

  if (!METRIKA_ID) return;

  window.METRIKA_ID = METRIKA_ID;

  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  window.ym(METRIKA_ID, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    ecommerce: "dataLayer"
  });

  function reachGoal(name) {
    try { window.ym(METRIKA_ID, "reachGoal", name); } catch (err) { /* noop */ }
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest ? event.target.closest("a") : null;
    if (!link) return;

    var href = link.getAttribute("href") || "";

    if (href.indexOf("tel:") === 0) {
      reachGoal("phone_click");
    } else if (href.indexOf("https://www.clinicaspectr.ru") === 0) {
      reachGoal("booking_click");
    } else if (href.indexOf("https://yandex.ru/maps") === 0) {
      reachGoal("map_click");
    }
  }, true);
})();
