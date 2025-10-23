import pets from "../assets/json/planets.json";

export default class PetSelector {
  appContainer: HTMLDivElement;

  constructor(appContainer: HTMLDivElement) {
    this.appContainer = appContainer;
  }

  setupInterface() {
    this.appContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="app__pet-selector-interface gap-10">
        <h1 class="text-5xl font-bold">planetarium</h1>
        <p class="text-xl">
          Claim a planet to call your own.
        </p>
        <!-- Pet selection zone -->
        <div class="pet-selector"></div>
      </div>
    `,
    );
  }

  insertPets() {
    for (let i = 0; i < pets.length; i++) {
      const pet = pets[i];
      this.appContainer
        .querySelector<HTMLDivElement>(".pet-selector")!
        .insertAdjacentHTML(
          "beforeend",
          `
        <div class="pet-selector__card">
          <div class="card__content">
            <h3 class="text-2xl font-bold">${pet["name"]}</h3>
            <img class="card__image" src="${pet["image"]}">
            <p class="text-lg">${pet["description"]}</p>
          </div>
          <div class="card__action-row">
            <button class="card__button">Adopt!</button>
          </div>
        </div>
      `,
        );
    }
  }
}
