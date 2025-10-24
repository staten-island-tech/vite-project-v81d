import petsArray from "./assets/json/planets.json";
import { appContainer } from "./scripts/globals.ts";
import StarryBackground from "./scripts/interfaces/starryBackground.ts";
import PetSelector from "./scripts/interfaces/petSelector.ts";

let starryBackground = new StarryBackground(appContainer);

// Pet selector interface
let petSelector = new PetSelector(appContainer, starryBackground, petsArray);
petSelector.setupInterface();
petSelector.insertPets();
