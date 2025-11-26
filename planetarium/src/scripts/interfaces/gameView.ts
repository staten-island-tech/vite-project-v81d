const stabilityInterval: Record<string, any> = {
  intervalID: null,
  tickRate: 5000,
  changeBy: -1,
  zeroNotified: false,
  criticalNotified: false,
  warningNotified: false,
};

const energyInterval: Record<string, any> = {
  intervalID: null,
  tickRate: 7000,
  changeBy: -2,
  zeroNotified: false,
  criticalNotified: false,
  warningNotified: false,
};

const strengthInterval: Record<string, any> = {
  intervalID: null,
  tickRate: 4000,
  changeBy: -1,
  zeroNotified: false,
  criticalNotified: false,
  warningNotified: false,
};

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
  #logContent?: HTMLDivElement;

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
          increaseBy: 8,
          cooldown: 5,
          lastIncreased: 0,
          actionLabel: "Stabilize",
          rowElement: null,
        },
        energy: {
          name: "Energy",
          value: this.#pet.default_stats.energy,
          increaseBy: 12,
          cooldown: 10,
          lastIncreased: 0,
          actionLabel: "Energize",
          rowElement: null,
        },
        strength: {
          name: "Strength",
          value: this.#pet.default_stats.strength,
          increaseBy: 3,
          cooldown: 2,
          lastIncreased: 0,
          actionLabel: "Strengthen",
          rowElement: null,
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
    this.#buildLogView();

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
      const statRow: HTMLDivElement = document.createElement("div");
      statRow.className = "stats-list__stat-row";
      statRow.dataset.stat = stat;
      statRow.innerHTML = `
      <p class="w-[25%]" data-name="title">${properties.name}</p>
      <div class="stat-row__progress-bar">
        <div class="progress-bar__progress" style="width: ${Math.max(
          0,
          Math.min(100, properties.value)
        )}%;" data-name="progress-bar"></div>
      </div>
      <p class="text-right w-8" data-name="value">${
        (properties.value < 0 ? "" : "+") + properties.value
      }</p>
      `;

      this.#statsList.insertAdjacentElement("beforeend", statRow);
      properties.rowElement = statRow;
    }

    const statButtons: HTMLDivElement = this.#columns![0].querySelector(
      ".stats-viewer .stats-viewer__stat-buttons"
    )!;

    for (const [stat, properties] of Object.entries(this.#stats)) {
      const button: HTMLButtonElement = document.createElement("button");
      button.className = "stat-buttons__button";
      button.dataset.stat = stat;
      button.textContent = properties.actionLabel;
      button.addEventListener("click", () => {
        if (100 - properties.value >= properties.increaseBy) {
          if (properties.lastIncreased - Date.now() > properties.cooldown) {
            properties.value += properties.increaseBy;

            properties.rowElement!.querySelector(
              "[data-name='value']"
            )!.textContent =
              (properties.value < 0 ? "" : "+") + properties.value;

            properties.rowElement!.querySelector(
              "[data-name='progress-bar']"
            ).style.width = `${Math.max(0, Math.min(100, properties.value))}%`;

            this.#createLogItem(
              "color: oklch(76.8% 0.233 130.85);",
              `You have increased your planet's ${stat}!`
            );
          } else {
            this.#createLogItem(
              "color: oklch(62.7% 0.265 303.9);",
              `Please wait ${
                properties.lastIncreased + properties.cooldown
              } seconds before increasing your pet's ${stat}!`
            );
          }
        } else {
          this.#createLogItem(
            "color: oklch(62.7% 0.265 303.9);",
            `Your planet's ${stat} is already optimal!`
          );
        }
      });

      statButtons.insertAdjacentElement("beforeend", button);
      this.#statsActions = this.#statsActions || [];
      this.#statsActions.push(button);
    }
  }

  #buildLogView() {
    this.#columns![1].insertAdjacentHTML(
      "beforeend",
      `
      <div class="log-view">
        <h2 class="text-3xl font-bold">Event Log</h2>
        <div class="log-view__log-content">
          <p>${this.#createTimestamp(
            "log-item__date",
            ""
          )} Welcome to the observatory. Nurture your planet and help it grow!</p>
        </div>
      </div>
      `
    );

    this.#logContent = this.#columns![1].querySelector(
      ".log-view .log-view__log-content"
    )!;
  }

  fadeIn() {
    this.#gameInterface!.style.opacity = "1";
  }

  fadeOut() {
    this.#gameInterface!.style.opacity = "0";
  }

  #createTimestamp(className: string, style: string) {
    return `<span class="${className}" style="${style}">[${new Date(
      Date.now()
    ).toLocaleString()}]</span>`;
  }

  #createLogItem(style: string, message: string) {
    this.#logContent!.insertAdjacentHTML(
      "beforeend",
      `
      <p>${this.#createTimestamp("log-item__date", style)} ${message}</p>
      `
    );

    this.#logContent!.scrollTop = this.#logContent!.scrollHeight;
  }

  #createStatInterval(
    stat: Record<string, any>,
    interval: Record<string, any>
  ) {
    interval.intervalID = setInterval(() => {
      stat.value += interval.changeBy!;
      this.#saveStats();

      stat.rowElement!.querySelector("[data-name='value']")!.textContent =
        (stat.value < 0 ? "" : "+") + stat.value;

      stat.rowElement!.querySelector(
        "[data-name='progress-bar']"
      ).style.width = `${Math.max(0, Math.min(100, stat.value))}%`;
    }, interval.tickRate!);
  }

  #checkStats(
    stability: Record<string, any>,
    energy: Record<string, any>,
    strength: Record<string, any>
  ) {
    if (stability.value <= 0) {
      if (!stability.zeroNotified) {
        this.#createLogItem(
          "color: oklch(44.4% 0.177 26.899);",
          "Your planet has lost all its stability. It has now self-destructed!"
        );
        stability.zeroNotified = true;
      }
    } else if (stability.value < 25) {
      if (!stability.criticalNotified) {
        this.#createLogItem(
          "color: oklch(63.7% 0.237 25.331);",
          "Your planet is extremely unstable! Stabilize your pet as soon as possible!"
        );
        stability.criticalNotified = true;
      }
    } else if (stability.value < 65) {
      if (!stability.warningNotified) {
        this.#createLogItem(
          "color: oklch(76.9% 0.188 70.08);",
          "Your planet is becoming unstable! Make sure to stabilize your pet."
        );
        stability.warningNotified = true;
      }
    }

    if (energy.value <= 0) {
      if (!energy.zeroNotified) {
        this.#createLogItem(
          "color: oklch(44.4% 0.177 26.899);",
          "Your planet's energy has been fully depleted. It can no longer remain in orbit!"
        );
        energy.zeroNotified = true;
      }
    } else if (energy.value < 25) {
      if (!energy.criticalNotified) {
        this.#createLogItem(
          "color: oklch(63.7% 0.237 25.331);",
          "Your planet is very low on energy! Don't forget to energize your pet!"
        );
        energy.criticalNotified = true;
      }
    } else if (energy.value < 65) {
      if (!energy.warningNotified) {
        this.#createLogItem(
          "color: oklch(76.9% 0.188 70.08);",
          "Your planet is becoming low on energy! Make sure to energize your pet."
        );
        energy.warningNotified = true;
      }
    }

    if (strength.value <= 0) {
      if (!strength.zeroNotified) {
        this.#createLogItem(
          "color: oklch(44.4% 0.177 26.899);",
          "Your planet has become too weak to operate. It can no longer sustain itself!"
        );
        strength.zeroNotified = true;
      }
    } else if (strength.value < 25) {
      if (!strength.criticalNotified) {
        this.#createLogItem(
          "color: oklch(63.7% 0.237 25.331);",
          "Your planet is very low on strength! Make sure you strengthen your pet before it's too late!"
        );
        strength.criticalNotified = true;
      }
    } else if (strength.value < 65) {
      if (!strength.warningNotified) {
        this.#createLogItem(
          "color: oklch(76.9% 0.188 70.08);",
          "Your planet is starting to lose its strength! Don't forget to strengthen it!"
        );
        strength.warningNotified = true;
      }
    }
  }

  startGameLoop() {
    let stability: Record<string, any> = this.#stats.stability!;
    let energy: Record<string, any> = this.#stats.energy!;
    let strength: Record<string, any> = this.#stats.strength!;

    this.#createStatInterval(stability, stabilityInterval);
    this.#createStatInterval(energy, energyInterval);
    this.#createStatInterval(strength, strengthInterval);

    setInterval(() => {
      this.#checkStats(stability, energy, strength);
      this.#saveStats();
    }, 1000);
  }
}
