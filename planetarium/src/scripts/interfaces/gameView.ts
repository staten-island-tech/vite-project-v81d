// This class is used to construct the framework for the actual base interface of the game
export default class GameInterface {
  #appContainer: HTMLDivElement;
  #themeSwitcher: any;
  #gameInterface?: HTMLDivElement;
  #gameInterfaceTopPanel?: HTMLDivElement;
  #themeSwitcherButton?: HTMLLIElement;

  constructor(appContainer: HTMLDivElement, themeSwitcher: any) {
    this.#appContainer = appContainer;
    this.#themeSwitcher = themeSwitcher;
  }

  build() {
    this.#gameInterface = document.createElement("div");
    this.#gameInterface.className = "app__game-interface";

    this.#appContainer.insertAdjacentElement("afterbegin", this.#gameInterface);
    this.#gameInterface.offsetHeight; // reflow

    this.#buildPanel();
    this.#buildPetView();
  }

  #buildPanel() {
    let theme: string = localStorage.getItem("theme") ?? "dark-theme";

    this.#gameInterface!.insertAdjacentHTML(
      "afterbegin",
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

  #buildPetView() {}

  fadeIn() {
    this.#gameInterface!.style.opacity = "1";
  }

  fadeOut() {
    this.#gameInterface!.style.opacity = "0";
  }
}
