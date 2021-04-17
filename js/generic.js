//Switches theme from light to dark and vice versa
function switchTheme() {
  const body = document.body;

  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    body.classList.add("light");

    localStorage.setItem("theme", "light");
  } else if (body.classList.contains("light")) {
    body.classList.remove("light");
    body.classList.add("dark");

    localStorage.setItem("theme", "dark");
  }
}

//gets the theme stored in local storage or setting a theme
function getTheme() {
  const theme = localStorage.getItem("theme");
  if (theme) {
    document.body.classList.add(theme);
  } else {
    if (window.matchMedia("(prefers-color-scheme)").media !== "not all") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.add("light");
    }
  }
}

//registering the service worker/s
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../sw_cached_pages.js")
      .then((reg) => console.log("Service worker: registered"))
      .catch((err) => `Service worker error: ${err}`);
  });
}
