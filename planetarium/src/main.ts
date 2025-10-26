import petsArray from "./assets/json/planets.json";
import { appContainer } from "./scripts/globals.ts";
import DotBackground from "./scripts/interfaces/dotBackground.ts";
import PetSelector from "./scripts/interfaces/petSelector.ts";

let dotBackground = new DotBackground(appContainer);

// Pet selector interface
let petSelector = new PetSelector(appContainer, dotBackground, petsArray);
petSelector.setupInterface();
petSelector.insertPets();
