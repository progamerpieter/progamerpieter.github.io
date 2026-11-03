// Gedeelde navbar voor alle pagina's.
// Pas de links hieronder aan en het verandert overal.
// Gebruik op een pagina: <script src="/javascript/navbar.js"></script>
// op de plek waar de navbar moet komen.

const NAV_LINKS = [
  { href: "/index.html", label: "Home" },
  { href: "/portfolio.html", label: "portfolio" },
  { href: "/contact.html", label: "contact" },
  { href: "/socials.html", label: "socials" },
];

(function () {
  // Welke pagina is dit? "/" telt als Home, /portfolio/... telt als portfolio.
  let path = location.pathname;
  if (path === "/" || path === "") path = "/index.html";
  if (path.startsWith("/portfolio/")) path = "/portfolio.html";

  const items = NAV_LINKS.map((link) => {
    const active = link.href === path;
    return `
              <li class="nav-item">
                <a class="nav-link${active ? " active" : ""}"${active ? ' aria-current="page"' : ""} href="${link.href}">${link.label}</a>
              </li>`;
  }).join("");

  const html = `
      <nav class="navbar navbar-expand-lg navbar-dark nav-dropshadow">
        <div class="container-fluid">
          <a class="navbar-brand" href="/index.html"
            ><img class="logo" src="/images/Website_logo.svg" alt="logo" width="62,5"
          /></a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse navbar-dropshadow" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">${items}
            </ul>
          </div>
        </div>
      </nav>`;

  // Zet de navbar precies op de plek van deze <script>-tag.
  document.currentScript.insertAdjacentHTML("beforebegin", html);
})();
