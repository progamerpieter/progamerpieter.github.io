function checkColorMode() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "Dark";
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return "light";
  } else {
    return "unknown";
  }
}

// Example usage:
let colorMode = checkColorMode();
console.log(`The user's color mode is ${colorMode}`);

if (colorMode == "Dark") {
    Darkmode();
} else if (colorMode == "Light") {
    Lightmode();
}

function Darkmode() {
  document.querySelector("#body").setAttribute("data-bs-theme", "dark");
}

function Lightmode() {
  document.querySelector("#body").setAttribute("data-bs-theme", "light");
}
