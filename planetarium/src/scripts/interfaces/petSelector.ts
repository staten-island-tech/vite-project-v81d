/* Wrap the background class instance in the PetSelector class.
 * Since some event listeners must take control over the background effects, we have to handle the background here.
 */
import StarryBackground from "./starryBackground.ts";

export default class PetSelector {
  appContainer: HTMLDivElement;
  starryBackground?: StarryBackground;
  petsArray: Record<string, string>[];
  petSelectorInterface?: HTMLDivElement;
  petSelector?: HTMLDivElement;
  petSelectorIntro?: HTMLDivElement;

  constructor(
    appContainer: HTMLDivElement,
    petsArray: Record<string, string>[],
  ) {
    this.appContainer = appContainer;
    this.petsArray = petsArray;
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
        <div class="pet-selector"></div>
        <div class="pet-selector-intro"></div>
      </div>
    `,
    );
    this.starryBackground = new StarryBackground(this.appContainer);
    this.starryBackground.generateBackground(50);
    this.petSelectorInterface = this.appContainer.querySelector(
      ".app__pet-selector-interface",
    ) as HTMLDivElement;
    this.petSelector = this.petSelectorInterface.querySelector(
      ".pet-selector",
    ) as HTMLDivElement;
    this.petSelectorIntro = this.petSelectorInterface.querySelector(
      ".pet-selector-intro",
    ) as HTMLDivElement;
  }

  insertPets() {
    for (let i = 0; i < this.petsArray.length; i++) {
      const pet = this.petsArray[i];

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
      `,
        );

      const button: HTMLButtonElement = this.petSelector!.querySelector(
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
    const petObject = this.petsArray[petID];

    localStorage.setItem("adoptedPet", JSON.stringify(petObject));

    // Disable every button
    for (let i = 0; i < this.petsArray.length; i++) {
      const btn: HTMLButtonElement = this.petSelector!.querySelector(
        `.card__button[data-id="${i}"]`,
      )!;
      btn.disabled = true;
    }

    // Animation sequence
    this.#playCardSelectAnimation(card, petID);
  }

  #playCardSelectAnimation(card: HTMLDivElement, petID: number) {
    const rect: DOMRect = card.getBoundingClientRect();
    const placeholder: HTMLDivElement = document.createElement("div");

    const viewportCenterTop: number = window.innerHeight / 2 - rect.height / 2;
    const viewportCenterLeft: number = window.innerWidth / 2 - rect.width / 2;

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

    card.style.top = `${viewportCenterTop}px`;
    card.style.left = `${viewportCenterLeft}px`;

    /* If the window is resized during the animation, the card does not automatically adapt its position.
     * To remedy this, we should recalculate the viewport dimensions and manually adjust the card position.
     */
    window.addEventListener("resize", () => {
      const newTop = window.innerHeight / 2 - rect.height / 2;
      const newLeft = window.innerWidth / 2 - rect.width / 2;
      card.style.top = `${newTop}px`;
      card.style.left = `${newLeft}px`;
    });

    const petSelectorInterfaceLabels: HTMLDivElement =
      this.petSelectorInterface!.querySelector(
        ".pet-selector-interface__labels",
      )!;
    const petSelectorCards: NodeListOf<Element> =
      this.petSelector!.querySelectorAll(".pet-selector__card")!;

    // Fade away all the other elements
    petSelectorInterfaceLabels.style.opacity = "0";

    petSelectorCards.forEach((element) => {
      const el = element as HTMLDivElement;
      if (el.querySelector(`.card__button:not([data-id="${petID}"])`)) {
        el.style.opacity = "0";
      }
    });

    window.setTimeout(() => {
      card.style.top = `${-2 * viewportCenterTop}px`;
      card.style.opacity = "0";
      for (const dot of this.starryBackground!.dots!) {

      }
    }, 2000);

    this.#runIntro(card, petID);
  }

  #runIntro(card: HTMLDivElement, petID: number) {
    // TODO: create intro sequence
    console.log(card, petID);
  }
}
