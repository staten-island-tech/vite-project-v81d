import petsArray from "./assets/json/planets.json";
import { appContainer } from "./scripts/globals.ts";
import StarryBackground from "./scripts/interfaces/starryBackground.ts";
import PetSelector from "./scripts/interfaces/petSelector.ts";

// Render background
let starryBackground = new StarryBackground(appContainer);
starryBackground.generateBackground(50);

// Pet selector interface
let petSelector = new PetSelector(appContainer, petsArray);
petSelector.setupInterface();
petSelector.insertPets();
