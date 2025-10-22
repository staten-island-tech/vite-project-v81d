import type { StringMap } from "./scripts/typeDefs.ts";
import planets from "./assets/json/planets.json";
import setupPetSelector from "./scripts/petSelector";

const container: HTMLDivElement = document.querySelector("#app")!;
const availablePlanets: StringMap[] = planets as StringMap[];

container.innerHTML = `
  <div>
    <h1 class="text-5xl font-bold">Select a Planet</h1>
    <div class="pet-selector"></div>
    <p class="text-xl">
      Select a planet as your pet.
    </p>
  </div>
`;

setupPetSelector(
  container.querySelector<HTMLDivElement>(".pet-selector")!,
  availablePlanets
);
