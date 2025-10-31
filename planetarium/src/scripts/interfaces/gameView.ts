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
    this.#buildPanel();
  }

  #buildPanel() {
    let theme = localStorage.getItem("theme") ?? "dark-theme";

    this.#appContainer.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="app__game-interface">
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
      </div>
      `,
    );

    this.#gameInterface = this.#appContainer.querySelector(
      ".app__game-interface",
    ) as HTMLDivElement;
    this.#gameInterface.offsetHeight; // reflow
    this.#gameInterfaceTopPanel = this.#gameInterface.querySelector(
      ".game-interface__top-panel",
    ) as HTMLDivElement;
    this.#themeSwitcherButton = this.#gameInterfaceTopPanel.querySelector(
      "#theme-switcher-panel-action",
    ) as HTMLLIElement;
    this.#themeSwitcher.attachClickAction(this.#themeSwitcherButton);
  }

  fadeIn() {
    this.#gameInterface!.style.opacity = "1";
  }

  fadeOut() {
    this.#gameInterface!.style.opacity = "0";
  }
}
