import petsList from "./assets/json/planets.json";
import { appContainer } from "./scripts/globals.ts";
import StarryBackground from "./scripts/interfaces/starryBackground.ts";
import PetSelector from "./scripts/interfaces/petSelector.ts";

let starryBackground = new StarryBackground(appContainer);
starryBackground.generateBackground(50);

let petSelector = new PetSelector(appContainer, petsList);
petSelector.setupInterface();
petSelector.insertPets();
