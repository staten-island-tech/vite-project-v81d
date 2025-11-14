// This class is used to construct the framework for the actual base interface of the game
export default class GameInterface {
  #appContainer: HTMLDivElement;
  #themeSwitcher: any;
  #pet: Record<string, any>;
  #stats: Record<string, Record<string, any>>;
  #gameInterface?: HTMLDivElement;
  #gameInterfaceTopPanel?: HTMLDivElement;
  #themeSwitcherButton?: HTMLLIElement;
  #gameBox?: HTMLDivElement;
  #columns?: HTMLDivElement[];
  #statsList?: HTMLDivElement;
  #statsActions?: HTMLButtonElement[];
  #logViewText?: HTMLDivElement;

  constructor(
    appContainer: HTMLDivElement,
    themeSwitcher: any,
    pet: Record<string, any>
  ) {
    this.#appContainer = appContainer;
    this.#themeSwitcher = themeSwitcher;
    this.#pet = pet;

    const savedStats: string | null = localStorage.getItem("petStats");

    if (savedStats) {
      this.#stats = JSON.parse(savedStats);
    } else {
      this.#stats = {
        stability: {
          name: "Stability",
          value: this.#pet.default_stats.stability,
        },
        energy: {
          name: "Energy",
          value: this.#pet.default_stats.energy,
        },
        strength: {
          name: "Strength",
          value: this.#pet.default_stats.strength,
        },
      };

      this.#saveStats();
    }
  }

  #saveStats() {
    localStorage.setItem("petStats", JSON.stringify(this.#stats));
  }

  build() {
    this.#gameInterface = document.createElement("div");
    this.#gameInterface.className = "app__game-interface";
    this.#appContainer.insertAdjacentElement("afterbegin", this.#gameInterface);

    this.#buildPanel();
    this.#buildGameBox();
    this.#buildColumns(2);
    this.#buildPetViewer();
    this.#buildStatsViewer();

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

  #buildColumns(count: number) {
    this.#columns = [];

    for (let i = 0; i < count; i++) {
      const column: HTMLDivElement = document.createElement("div");
      column.className = "game-box__column";

      this.#gameBox!.appendChild(column);
      this.#columns.push(column);
    }
  }

  #buildPetViewer() {
    this.#columns![0].insertAdjacentHTML(
      "beforeend",
      `
      <div class="pet-viewer">
        <img class="pet-viewer__image" src="${this.#pet.image}">
        <div class="flex flex-col justify-center items-center text-center gap-5 max-w-64">
          <h2 class="text-3xl font-bold">${this.#pet.name}</h2>
          <h2 class="text-lg">${this.#pet.description}</h2>
        </div>
      </div>
      `
    ); // append to upper row
  }

  #buildStatsViewer() {
    this.#columns![0].insertAdjacentHTML(
      "beforeend",
      `
      <div class="stats-viewer">
        <h2 class="text-3xl font-bold">Planet Stats</h2>
        <div class="stats-viewer__stats-list"></div>
        <div class="stats-viewer__stat-buttons"></div>
      </div>
      `
    );

    this.#statsList = this.#columns![0].querySelector(
      ".stats-viewer .stats-viewer__stats-list"
    )!;

    for (const [stat, properties] of Object.entries(this.#stats)) {
      this.#statsList.insertAdjacentHTML(
        "beforeend",
        `
        <div class="stats-list__stat-row" data-stat="${stat}">
          <p class="w-[25%]" data-name="title">${properties.name}</p>
          <div class="stat-row__progress-bar">
            <div class="progress-bar__progress" style="width: ${Math.min(
              100,
              properties.value
            )}%;"></div>
          </div>
          <p class="text-right w-8" data-name="value">${
            (properties.value < 0 ? "" : "+") + properties.value
          }</p>
        </div>
        `
      );
    }

    const statButtons: HTMLDivElement = this.#columns![0].querySelector(
      ".stats-viewer .stats-viewer__stat-buttons"
    )!;

    for (const label of ["Stabilize", "Train", "Energize"]) {
      const button: HTMLButtonElement = document.createElement("button");
      button.className = "stat-buttons__button";
      button.textContent = label;

      statButtons.insertAdjacentElement("beforeend", button);
    }
  }

  #buildLogView() {
    this.#columns![1].insertAdjacentHTML(
      "beforeend",
      `
      <div class="log-view">
        <p></p>
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
