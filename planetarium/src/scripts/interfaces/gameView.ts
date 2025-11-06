// This class is used to construct the framework for the actual base interface of the game
export default class GameInterface {
  #appContainer: HTMLDivElement;
  #themeSwitcher: any;
  #pet: Record<string, any>;
  #gameInterface?: HTMLDivElement;
  #gameInterfaceTopPanel?: HTMLDivElement;
  #themeSwitcherButton?: HTMLLIElement;
  #gameBox?: HTMLDivElement;
  #rows?: HTMLDivElement[];

  constructor(
    appContainer: HTMLDivElement,
    themeSwitcher: any,
    pet: Record<string, any>
  ) {
    this.#appContainer = appContainer;
    this.#themeSwitcher = themeSwitcher;
    this.#pet = pet;
  }

  build() {
    this.#gameInterface = document.createElement("div");
    this.#gameInterface.className = "app__game-interface";
    this.#appContainer.insertAdjacentElement("afterbegin", this.#gameInterface);

    this.#buildPanel();
    this.#buildGameBox();
    this.#buildRows(5);
    this.#buildPetViewer();

    this.#gameInterface.offsetHeight; // reflow
  }

  #buildPanel() {
    let theme: string = localStorage.getItem("theme") ?? "dark-theme";

    this.#gameInterface!.insertAdjacentHTML(
      "beforeend",
      `
      <div class="game-interface__top-panel">
        <div class="top-panel__labels">
          <h1 class="text-2xl font-bold">planetarium</h1>
          <h2>The Observatory</h2>
        </div>
        <div class="top-panel__buttons">
          <button id="theme-switcher-panel-action">
            ${theme === "dark-theme" ? "Light Theme" : "Dark Theme"}
          </button>
        </div>
      </div>
      `
    );

    this.#gameInterfaceTopPanel = this.#gameInterface!.querySelector(
      ".game-interface__top-panel"
    ) as HTMLDivElement;
    this.#themeSwitcherButton = this.#gameInterfaceTopPanel.querySelector(
      "#theme-switcher-panel-action"
    ) as HTMLLIElement;
    this.#themeSwitcher.attachClickAction(this.#themeSwitcherButton);
  }

  #buildGameBox() {
    this.#gameBox = document.createElement("div");
    this.#gameBox.className = "game-interface__game-box";
    this.#gameInterface!.insertAdjacentElement("beforeend", this.#gameBox);
  }

  #buildRows(count: number) {
    this.#rows = [];

    for (let i = 0; i < count; i++) {
      const row: HTMLDivElement = document.createElement("div");
      row.className = "game-box__row";

      this.#gameBox!.appendChild(row);
      this.#rows.push(row);
    }
  }

  #buildPetViewer() {
    this.#rows![0].insertAdjacentHTML(
      "beforeend",
      `
      <div class="pet-viewer">
        <img class="pet-viewer__image" src="${this.#pet.image}">
        <h2 class="text-2xl font-bold">${this.#pet.name}</h2>
      </div>
      `
    );
  }

  fadeIn() {
    this.#gameInterface!.style.opacity = "1";
  }

  fadeOut() {
    this.#gameInterface!.style.opacity = "0";
  }
}
