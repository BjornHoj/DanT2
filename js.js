document.addEventListener("DOMContentLoaded", function () {
  runProgram();
});

async function runProgram() {
  let selected;
  let selectedID;
  let active;
  let article = document.querySelector("#dynamic-article");
  let map = document.querySelector("#map");

  // 1. Find de interaktive punkter i SVG'en
  let points = {
    DannyPlads: document.querySelector("#DannyPlads"),
    PalæBar: document.querySelector("#PalæBar"),
    JazzHus: document.querySelector("#JazzHus"),
  };

  // 2. Tilføj event listeners til hvert punkt
  Object.entries(points).forEach(([key, point]) => {
    if (point) {
      point.addEventListener("click", function (evt) {
        evt.stopPropagation(); // Forhindrer at klikket også registreres på kortet
        clicked(evt, key);
      });
    }
  });

  // 3. Funktion: Hent og vis artikelindhold fra JSON
  async function loadArticleContent(sted) {
    try {
      let response = await fetch("oplysninger.json");
      let data = await response.json();

      let articleData = data[0].find((item) => item.sted === sted);

      if (articleData) {
        // Opdater indholdet
        article.innerHTML = `
            <h2>${articleData.sted}</h2>
            <p>${articleData.tekst}</p>
            <img src="${articleData.billede}.jpg" alt="${articleData.sted}" />
          `;

        // Vis artiklen
        article.style.display = "block";
      }
    } catch (error) {
      console.error("Fejl ved indlæsning af JSON:", error);
    }
  }

  // 4. Funktion: Når et punkt i SVG'en klikkes
  function clicked(evt, sted) {
    selected = evt.target;
    selectedID = selected.getAttribute("id");

    console.log("Selected ID:", selectedID);

    // Hvis et tidligere punkt var aktivt, reset farven
    if (active && active !== selected) {
      active.setAttribute("fill", "#fc0000");
    }

    // Skift farve på det valgte punkt
    selected.setAttribute("fill", "#123456");
    active = selected;

    // Opdater artiklen baseret på det valgte punkt
    loadArticleContent(sted);
  }

  // 5. Hvis man klikker et sted på kortet, der ikke er et punkt → skjul artiklen
  map.addEventListener("click", function () {
    article.style.display = "none";

    // Nulstil farve på tidligere valgt punkt
    if (active) {
      active.setAttribute("fill", "#fc0000");
      active = null;
    }
  });
}

const dannyPlads = document.getElementById("DannyPlads");
const rute2 = document.getElementById("Rute2");
const jazzHus = document.getElementById("JazzHus");
const rute1 = document.getElementById("Rute1");

// Eventlistener til DannyPlads for at vise Rute2
dannyPlads.addEventListener("click", () => {
  rute2.classList.add("visible");
});

// Eventlistener til JazzHus for at vise Rute1
jazzHus.addEventListener("click", () => {
  rute1.classList.add("visible");
});
