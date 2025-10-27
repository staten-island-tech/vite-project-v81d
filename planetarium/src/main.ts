import petsArray from "./assets/json/planets.json";
import { appContainer } from "./scripts/globals.ts";
import DotBackground from "./scripts/interfaces/dotBackground.ts";
import PetSelector from "./scripts/interfaces/petSelector.ts";

let dotBackground = new DotBackground(appContainer);

// Pet selector interface
let petSelector = new PetSelector(appContainer, dotBackground, petsArray);
petSelector.setupInterface();
petSelector.insertPets();

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
  console.log(
    `The user selected a pet. The selected pet is: ${JSON.stringify(
      fetchPet(petSelector.selectedPetID)
    )}`
  );
}

pollPetSelectorDone();
