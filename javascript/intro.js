// Intro-animatie voor alle pagina's (socials.html heeft zijn eigen versie en blijft zoals hij is).
//
// Gebruik op een pagina:
//   1. In de <head>, direct na huisstijl.css:
//        <script src="/javascript/intro.js"></script>
//      Zonder defer: het script zet meteen de klasse "hs-intro" op <html>, zodat de
//      kop en de boxes verborgen beginnen (zie huisstijl.css, deel 10). Zo flitst er
//      niets in beeld voordat de animatie start.
//   2. Onderaan de pagina, vlak voor </body>:
//        <script src="/javascript/Gsap/gsap.min.js"></script>
//        <script src="/javascript/Gsap/ScrollTrigger.min.js"></script>
//   3. Zet class="box" op alles wat als kaart moet binnenkomen, net als op socials.html.
//      Niet op de .hs-card zelf (die heeft een CSS-transition op transform, dat botst met
//      GSAP) maar op de kolom eromheen of op een <div class="box"> om de kaart heen.
//
// Wat je ziet:
//   - De kop (.hs-back, .hs-eyebrow, .hs-title, .hs-lead) schuift regel voor regel
//     omhoog en fade in, zoals de hero op de homepage.
//   - Daarna de boxes, met precies de waarden van socials.html:
//     y 50 -> 0, opacity 0 -> 1, 0.6s, back.out(1.7), stagger 0.2.
//     Boxes die al in beeld staan komen direct; de rest zodra je ernaar scrolt.
//   - De footer verschijnt pas als de laatste box er staat.
//   - Staat "minder beweging" aan (prefers-reduced-motion)? Dan wordt niets verborgen
//     en beweegt er niets.

(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const html = document.documentElement;
  html.classList.add("hs-intro");

  document.addEventListener("DOMContentLoaded", () => {
    // Geen GSAP? Dan gewoon alles tonen.
    if (!window.gsap) {
      html.classList.remove("hs-intro");
      return;
    }
    const metScroll = !!window.ScrollTrigger;
    if (metScroll) gsap.registerPlugin(ScrollTrigger);

    const footer = document.getElementById("footer");
    const toonFooter = () => {
      if (footer) gsap.to(footer, { opacity: 1, duration: 0.6, overwrite: "auto" });
    };

    // ---- 1. Koppen: regel voor regel omhoog ----
    // Heeft de pagina een hero (homepage)? Die heeft zijn eigen animatie en krijgt
    // eerst even de ruimte, dan pas de eerste kop.
    const heeftHero = !!document.querySelector(".hero-block");
    const startKop = heeftHero ? 0.6 : 0.15;
    // Wanneer de boxes mogen beginnen: zodra de laatste regel van de eerste kop onderweg is
    let startBoxes = startKop + 0.2;
    const gedaan = new Set();
    let eersteKop = true;
    gsap.utils.toArray(".hs-head").forEach((kop) => {
      const regels = [];
      const terug = kop.previousElementSibling;
      if (terug && terug.classList.contains("hs-back")) {
        regels.push(terug);
        gedaan.add(terug);
      }
      regels.push(...kop.children);
      if (!regels.length) return;

      const opties = {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
        overwrite: "auto",
      };
      // Eerste kop: heel kort wachten zodat de pagina eerst rustig staat
      if (eersteKop) {
        opties.delay = startKop;
        startBoxes = startKop + 0.1 * regels.length;
        eersteKop = false;
      }
      if (metScroll) opties.scrollTrigger = { trigger: kop, start: "top 90%", once: true };
      gsap.to(regels, opties);
    });
    // Een terug-link zonder kop erachter: gewoon direct tonen
    gsap.utils.toArray(".hs-back").forEach((terug) => {
      if (!gedaan.has(terug)) gsap.to(terug, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" });
    });

    // ---- 2. Boxes: zelfde animatie als socials.html ----
    const boxes = gsap.utils.toArray(".box");
    if (!boxes.length) {
      // Alleen een kop op deze pagina: footer erna
      gsap.delayedCall(0.6, toonFooter);
      return;
    }
    const laatste = boxes[boxes.length - 1];

    const binnen = (batch, delay) =>
      gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.2,
        delay,
        overwrite: "auto",
        // footer pas na de laatste box
        onComplete: batch.includes(laatste) ? toonFooter : undefined,
      });

    if (!metScroll) {
      binnen(boxes, startBoxes);
      return;
    }

    // Boxes die al in beeld staan komen direct (vlak na de kop),
    // de rest zodra je ernaar scrolt. Komen er meerdere tegelijk in beeld,
    // dan alsnog met stagger.
    let eersteBatch = true;
    ScrollTrigger.batch(boxes, {
      start: "top 95%",
      once: true,
      onEnter: (batch) => {
        binnen(batch, eersteBatch ? startBoxes : 0);
        eersteBatch = false;
      },
    });

    // Vangnet: staat de pagina bij het laden al verder naar beneden
    // (bijv. na een refresh), dan toont dit de boxes die al boven in beeld voorbij zijn.
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
      boxes.forEach((box) => {
        if (box.getBoundingClientRect().bottom < 0 && gsap.getProperty(box, "opacity") === 0) {
          gsap.set(box, { y: 0, opacity: 1 });
          if (box === laatste) toonFooter();
        }
      });
    });
  });
})();
