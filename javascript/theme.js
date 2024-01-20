//auto check what theme must be used
if (sessionStorage.getItem("Theme") === "Dark") {
  Darkmode();
  console.log("session dark");
} else if (sessionStorage.getItem("Theme") === "Light") {
  Lightmode();
  console.log("session light");
} else {
   //check default OS theme
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      console.log("dark")
      Darkmode();
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      console.log("light");
      Lightmode();
    } else {
      
      console.log("nothing");
    }
  
}

//theme triggers
function Darkmode() {
  document.querySelector("#body").setAttribute("data-bs-theme", "dark");
  sessionStorage.setItem("Theme", "Dark");
  console.log("darkmode trigger");
}

function Lightmode() {
  document.querySelector("#body").setAttribute("data-bs-theme", "light");
  sessionStorage.setItem("Theme", "Light");
  console.log("lightmode trigger");
}
