import { appContainer } from "./scripts/globals.ts";
import StarryBackground from "./scripts/starryBackground.ts";
import PetSelector from "./scripts/petSelector";

let starryBackground = new StarryBackground(appContainer);
starryBackground.generateBackground(100);

let petSelector = new PetSelector(appContainer);
petSelector.setupInterface();
petSelector.insertPets();
