/* Portretfoto beweegt mee met de muis (zie .hs-portret in css/huisstijl.css).
   De foto kantelt een paar graden naar de cursor en het groene kader schuift
   de andere kant op, zodat het lijkt alsof het kader erachter ligt.
   Een veer zorgt dat de beweging altijd doorloopt vanaf waar de foto op dat
   moment staat: je kunt halverwege van richting veranderen zonder schok.
   Alleen met een muis, en niet als "minder beweging" aan staat. */
(function () {
  var MAX_KANTEL = 6;    // graden
  var MAX_SCHUIF = 6;    // pixels die het kader opschuift
  var RESPONS = 0.4;     // seconden; lager = sneller
  var STIJFHEID = Math.pow((2 * Math.PI) / RESPONS, 2);
  var DEMPING = 2 * Math.sqrt(STIJFHEID);   // kritisch gedempt: geen nastuiteren

  var portret = document.querySelector(".hs-portret");
  if (!portret) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Positie van -1 (links/boven) tot 1 (rechts/onder), met snelheid en doel
  var x = 0, y = 0, vx = 0, vy = 0, doelX = 0, doelY = 0;
  var vorige = 0;
  var bezig = false;

  function begrens(n) {
    return Math.max(-1, Math.min(1, n));
  }

  function teken() {
    portret.style.setProperty("--hs-kantel-x", (-y * MAX_KANTEL).toFixed(3) + "deg");
    portret.style.setProperty("--hs-kantel-y", (x * MAX_KANTEL).toFixed(3) + "deg");
    portret.style.setProperty("--hs-schuif-x", (-x * MAX_SCHUIF).toFixed(2) + "px");
    portret.style.setProperty("--hs-schuif-y", (-y * MAX_SCHUIF).toFixed(2) + "px");
  }

  function stap(nu) {
    var dt = Math.min((nu - vorige) / 1000, 1 / 30);
    vorige = nu;

    vx += (STIJFHEID * (doelX - x) - DEMPING * vx) * dt;
    vy += (STIJFHEID * (doelY - y) - DEMPING * vy) * dt;
    x += vx * dt;
    y += vy * dt;

    var stil =
      Math.abs(doelX - x) < 0.001 && Math.abs(doelY - y) < 0.001 &&
      Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001;

    if (stil) {
      x = doelX;
      y = doelY;
      vx = vy = 0;
      bezig = false;
    }
    teken();
    if (bezig) requestAnimationFrame(stap);
  }

  function start() {
    if (bezig) return;
    bezig = true;
    vorige = performance.now();
    requestAnimationFrame(stap);
  }

  portret.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    var vak = portret.getBoundingClientRect();
    doelX = begrens(((e.clientX - vak.left) / vak.width - 0.5) * 2);
    doelY = begrens(((e.clientY - vak.top) / vak.height - 0.5) * 2);
    start();
  });

  portret.addEventListener("pointerleave", function () {
    doelX = 0;
    doelY = 0;
    start();
  });
})();
