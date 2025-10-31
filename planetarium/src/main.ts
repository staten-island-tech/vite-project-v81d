import petsArray from "./assets/json/planets.json";
import { appContainer } from "./scripts/globals.ts";
import ThemeSwitcher from "./scripts/interfaces/themeSwitcher.ts";
import DotBackground from "./scripts/interfaces/dotBackground.ts";
import PetSelector from "./scripts/interfaces/petSelector.ts";
import GameView from "./scripts/interfaces/gameView.ts";

let dotBackground = new DotBackground(appContainer);

// Pet selector interface
let petSelector = new PetSelector(appContainer, dotBackground, petsArray);
petSelector.setupInterface();
petSelector.insertPets();

let theme = localStorage.getItem("theme") ?? "dark-theme";

// Theme changer button
let themeSwitcherButton = document.createElement("button");
themeSwitcherButton.className = "theme-switcher-button";
themeSwitcherButton.textContent =
  theme === "dark-theme" ? "Light Theme" : "Dark Theme";
appContainer.insertAdjacentElement("afterbegin", themeSwitcherButton);

let themeSwitcher = new ThemeSwitcher(theme);
themeSwitcher.attachClickAction(themeSwitcherButton);

// Return the object for a pet given its ID, with the `intro` key omitted
function fetchPet(petID: number) {
  return (({ intro, ...object }) => object)(petsArray[petID]);
}

/* This function asynchronously (in order to not block the main thread) checks if `petSelector.done` is `true`.
 * If `true`, then continue/begin the game.
 */
async function pollPetSelectorDone() {
  while (!petSelector.done) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

if (!localStorage.getItem("adoptedPet")) await pollPetSelectorDone();

// The following operations should occur directly after a pet has been selected
let gameView = new GameView(appContainer, themeSwitcher);

localStorage.setItem(
  "adoptedPet",
  JSON.stringify(fetchPet(petSelector.selectedPetID)),
);

console.log(
  `The user selected a pet. The selected pet is: ${localStorage.getItem("adoptedPet")}`,
);

appContainer.innerHTML = "";
gameView.build();
gameView.fadeIn();
dotBackground.clear();
dotBackground.generateBackground(50, true);
