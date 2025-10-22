import type { StringMap } from "./typeDefs.ts";

export default function setupPetSelector(
  container: HTMLDivElement,
  pets: StringMap[]
) {
  for (let i = 0; i < pets.length; i++) {
    const pet = pets[i];
    container.insertAdjacentHTML(
      "beforeend",
      `
      <div class="pet-selector__card">
        <h3 class="text-xl font-bold">${pet["name"]}</h3>
        <p class="text-lg">${pet["description"]}</p>
      </div>
    `
    );
  }
}
