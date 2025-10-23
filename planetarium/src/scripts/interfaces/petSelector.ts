export default class PetSelector {
  appContainer: HTMLDivElement;
  petsList: Record<string, string>[];

  constructor(
    appContainer: HTMLDivElement,
    petsList: Record<string, string>[]
  ) {
    this.appContainer = appContainer;
    this.petsList = petsList;
  }

  setupInterface() {
    this.appContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="app__pet-selector-interface gap-10">
        <div class="pet-selector-interface__labels">
          <h1 class="text-6xl font-bold">planetarium</h1>
          <p class="text-xl">
            Claim a planet to call your own.
          </p>
        </div>
        <!-- Pet selection zone -->
        <div class="pet-selector"></div>
      </div>
    `
    );
  }

  insertPets() {
    for (let i = 0; i < this.petsList.length; i++) {
      const pet = this.petsList[i];

      this.appContainer
        .querySelector<HTMLDivElement>(".pet-selector")!
        .insertAdjacentHTML(
          "beforeend",
          `
        <div class="pet-selector__card">
          <div class="card__content">
            <h3 class="text-3xl font-bold">${pet["name"]}</h3>
            <img class="card__image" src="${pet["image"]}">
            <p class="text-lg">${pet["description"]}</p>
          </div>
          <button class="card__button" data-id="${i}">Adopt!</button>
        </div>
      `
        );

      const button: HTMLButtonElement = this.appContainer.querySelector(
        `.card__button[data-id="${i}"]`
      )!;
      button.addEventListener("click", this.#onAdoptButtonAction.bind(this));
    }
  }

  #onAdoptButtonAction(event: Event) {
    const button = event.target as HTMLButtonElement;
    const petID = Number(button.dataset.id);
    button.classList.add("card__button--adopted");
    button.textContent = "Adopted!";
    console.log(`Pet selected: ${JSON.stringify(this.petsList[petID])}`);

    /* Disable every button */
    for (let i = 0; i < this.petsList.length; i++) {
      const btn: HTMLButtonElement = this.appContainer.querySelector(
        `.card__button[data-id="${i}"]`
      )!;
      btn.disabled = true;
    }
  }
}
