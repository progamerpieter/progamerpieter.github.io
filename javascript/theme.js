if (sessionStorage.getItem("Theme") === "Dark") {
  Darkmode();
} else if (sessionStorage.getItem("Theme") === "Light") {
  Lightmode();
} else {
  function checkColorMode() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      Darkmode();
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      Lightmode();
    } else {
      Lightmode();
    }
  }
}


function Darkmode() {
  document.querySelector("#body").setAttribute("data-bs-theme", "dark");
  sessionStorage.setItem("Theme", "Dark");
}

function Lightmode() {
  document.querySelector("#body").setAttribute("data-bs-theme", "light");
  sessionStorage.setItem("Theme", "Light");
}
