/* Wrap the background class instance in the PetSelector class.
 * Since some event listeners must take control over the background effects, we have to handle the background here.
 */

export default class PetSelector {
  #appContainer: HTMLDivElement;
  #dotBackground: any;
  #petsArray: Record<string, any>[];
  #petSelectorInterface?: HTMLDivElement;
  #petSelectorGrid?: HTMLDivElement;
  #petSelectorIntroLabel?: HTMLDivElement;
  selectedPetID: number = 0;
  done: boolean = false;

  constructor(
    appContainer: HTMLDivElement,
    dotBackground: any,
    petsArray: Record<string, any>[],
  ) {
    this.#appContainer = appContainer;
    this.#dotBackground = dotBackground;
    this.#petsArray = petsArray;
  }

  setupInterface() {
    this.#appContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="app__pet-selector-interface gap-10">
        <div class="pet-selector-interface__labels">
          <h1 class="text-6xl font-bold">planetarium</h1>
          <p class="text-xl">
            Claim a planet to call your own.
          </p>
        </div>
        <div class="pet-selector"></div>
        <p class="pet-selector-interface__intro-label"></p>
      </div>
    `,
    );
    this.#dotBackground.generateBackground(50);
    this.#petSelectorInterface = this.#appContainer.querySelector(
      ".app__pet-selector-interface",
    ) as HTMLDivElement;
    this.#petSelectorGrid = this.#petSelectorInterface.querySelector(
      ".pet-selector",
    ) as HTMLDivElement;
    this.#petSelectorIntroLabel = this.#petSelectorInterface.querySelector(
      ".pet-selector-interface__intro-label",
    ) as HTMLDivElement;
  }

  insertPets() {
    for (let i = 0; i < this.#petsArray.length; i++) {
      const pet = this.#petsArray[i];

      this.#appContainer
        .querySelector<HTMLDivElement>(".pet-selector")!
        .insertAdjacentHTML(
          "beforeend",
          `
        <div class="pet-selector__card">
          <div class="card__content">
            <h3 class="text-3xl font-bold">${pet.name}</h3>
            <img class="card__image" src="${pet.image}">
            <p class="text-lg">${pet.description}</p>
          </div>
          <button class="card__button" data-id="${i}">Adopt!</button>
        </div>
      `,
        );

      const button: HTMLButtonElement = this.#petSelectorGrid!.querySelector(
        `.card__button[data-id="${i}"]`,
      )!;
      button.addEventListener("click", this.#onAdoptButtonAction.bind(this));
    }
  }

  #onAdoptButtonAction(event: Event) {
    const button = event.target as HTMLButtonElement;
    const card = button.parentElement as HTMLDivElement;

    button.classList.add("card__button--adopted");
    button.textContent = "Adopted!";

    const petID = Number(button.dataset.id);
    const petObject = this.#petsArray[petID];

    localStorage.setItem("adoptedPet", JSON.stringify(petObject));

    // Disable every button
    for (let i = 0; i < this.#petsArray.length; i++) {
      const btn: HTMLButtonElement = this.#petSelectorGrid!.querySelector(
        `.card__button[data-id="${i}"]`,
      )!;
      btn.disabled = true;
    }

    // Animation sequence
    this.#playCardSelectAnimation(card, petID);
  }

  #playCardSelectAnimation(card: HTMLDivElement, petID: number) {
    this.#petSelectorInterface!.style.overflow = "hidden";

    const rect: DOMRect = card.getBoundingClientRect();
    const placeholder: HTMLDivElement = document.createElement("div");

    placeholder.style.width = `${rect.width}px`;
    placeholder.style.height = `${rect.height}px`;
    card.parentElement!.insertBefore(placeholder, card);

    card.style.width = `${rect.width}px`;
    card.style.height = `${rect.height}px`;

    card.style.position = "fixed";
    card.style.top = `${rect.top}px`;
    card.style.left = `${rect.left}px`;
    card.style.zIndex = "1000";

    /* Accessing this value forces a reflow.
     * A reflow is a browser recalculation of the position and geometry of page elements.
     * https://developer.mozilla.org/en-US/docs/Glossary/Reflow
     */
    card.offsetHeight;

    card.style.top = `50%`;
    card.style.left = `50%`;
    card.style.transform = `translate(-50%, -50%)`;

    const petSelectorInterfaceLabels: HTMLDivElement =
      this.#petSelectorInterface!.querySelector(
        ".pet-selector-interface__labels",
      )!;
    const petSelectorCards: NodeListOf<Element> =
      this.#petSelectorGrid!.querySelectorAll(".pet-selector__card")!;

    // Fade away all the other elements
    petSelectorInterfaceLabels.style.opacity = "0";
    petSelectorCards.forEach((element) => {
      const el = element as HTMLDivElement;
      if (el.querySelector(`.card__button:not([data-id="${petID}"])`)) {
        el.style.opacity = "0";
      }
    });
    (
      this.#appContainer.querySelector(".theme-switcher")! as HTMLButtonElement
    ).style.opacity = "0.25";

    // Slide out card after 2 seconds, then begin intro scene
    setTimeout(() => {
      card.style.top = `40%`;
      card.style.opacity = "0";

      this.#dotBackground!.slideAllRandom("u", 50, 500, 1000); // slide all dots up by 50 px in 1 s

      setTimeout(() => (card.style.display = "none"), 500);
      setTimeout(() => this.#runIntro(petID), 500);
    }, 2000);
  }

  async #runIntro(petID: number) {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const intro = this.#petsArray[petID].intro;
    let label = this.#petSelectorIntroLabel!;

    for (let i = 0; i < intro.length; i++) {
      label.style.transition = "top 0.5s ease, opacity 0.5s ease"; // reset transition

      label.style.top = "50%";
      label.style.opacity = "1"; // appear
      label.textContent = intro[i];

      await delay(5000);

      label.style.top = "45%";
      label.style.opacity = "0"; // disappear

      if (i === intro.length - 1)
        this.#dotBackground!.slideAllRandom(
          "u",
          window.outerHeight,
          2000,
          3000,
        );
      else this.#dotBackground!.slideAllRandom("u", 50, 500, 1000);

      await delay(500);

      /* Set transition to "none" to skip the 500 ms delay when top shifts from 45% to 55%.
       * We will bring back the transition on the next iteration so it's not permanently gone.
       */
      label.style.transition = "none";
      label.style.top = "55%";

      label.offsetHeight; // reflow
    }

    setTimeout(() => {
      this.selectedPetID = petID;
      this.done = true;
    }, 2500);
  }
}
