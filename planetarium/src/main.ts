import petsArray from "./assets/json/planets.json";
import { appContainer } from "./scripts/globals.ts";
import PetSelector from "./scripts/interfaces/petSelector.ts";

// Pet selector interface
let petSelector = new PetSelector(appContainer, petsArray);
petSelector.setupInterface();
petSelector.insertPets();
