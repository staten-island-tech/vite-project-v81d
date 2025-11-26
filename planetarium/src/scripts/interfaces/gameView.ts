let stabilityInterval: Record<string, any> = {
  intervalID: null,
  tickRate: 5000,
  changeBy: -1,
  zeroNotified: false,
  criticalNotified: false,
  warningNotified: false,
};

let energyInterval: Record<string, any> = {
  intervalID: null,
  tickRate: 7000,
  changeBy: -2,
  zeroNotified: false,
  criticalNotified: false,
  warningNotified: false,
};

let strengthInterval: Record<string, any> = {
  intervalID: null,
  tickRate: 4000,
  changeBy: -1,
  zeroNotified: false,
  criticalNotified: false,
  warningNotified: false,
};

const darkRedColor: string = "color: oklch(25.8% 0.092 26.042);";
const redColor: string = "color: oklch(50.5% 0.213 27.518);";
const yellowColor: string = "color: oklch(55.5% 0.163 48.998);";
const greenColor: string = "color: oklch(53.2% 0.157 131.589);";
const purpleColor: string = "color: oklch(45.7% 0.24 277.023);";

const statRules: Record<string, any> = {
  stability: {
    zero: {
      color: darkRedColor,
      message:
        "Your planet has lost all its stability. It has now self-destructed!",
    },
    critical: {
      threshold: 25,
      color: redColor,
      message:
        "Your planet is extremely unstable! Stabilize your pet as soon as possible!",
    },
    warning: {
      threshold: 65,
      color: yellowColor,
      message:
        "Your planet is becoming unstable! Make sure to stabilize your pet.",
    },
  },

  energy: {
    zero: {
      color: darkRedColor,
      message:
        "Your planet's energy has been fully depleted. It can no longer remain in orbit!",
    },
    critical: {
      threshold: 25,
      color: redColor,
      message:
        "Your planet is very low on energy! Don't forget to energize your pet!",
    },
    warning: {
      threshold: 65,
      color: yellowColor,
      message:
        "Your planet is becoming low on energy! Make sure to energize your pet.",
    },
  },

  strength: {
    zero: {
      color: darkRedColor,
      message:
        "Your planet has become too weak to operate. It can no longer sustain itself!",
    },
    critical: {
      threshold: 25,
      color: redColor,
      message:
        "Your planet is very low on strength! Make sure you strengthen your pet before it's too late!",
    },
    warning: {
      threshold: 65,
      color: yellowColor,
      message:
        "Your planet is starting to lose its strength! Don't forget to strengthen it!",
    },
  },
};

// This class is used to construct the framework for the actual base interface of the game
export default class GameInterface {
  #appContainer: HTMLDivElement;
  #themeSwitcher: any;
  #pet: Record<string, any>;
  #stats: Record<string, Record<string, any>>;
  #score?: number;
  #gameInterface?: HTMLDivElement;
  #gameInterfaceTopPanel?: HTMLDivElement;
  #themeSwitcherButton?: HTMLLIElement;
  #gameBox?: HTMLDivElement;
  #columns?: HTMLDivElement[];
  #statsList?: HTMLDivElement;
  #statsActions?: HTMLButtonElement[];
  #logContent?: HTMLDivElement;
  #gameLoopID?: any;

  constructor(
    appContainer: HTMLDivElement,
    themeSwitcher: any,
    pet: Record<string, any>,
  ) {
    this.#appContainer = appContainer;
    this.#themeSwitcher = themeSwitcher;
    this.#pet = pet;
    this.#score = Number(localStorage.getItem("score") ?? 0);

    const savedStats: string | null = localStorage.getItem("petStats");

    if (savedStats) {
      this.#stats = JSON.parse(savedStats);
    } else {
      this.#stats = {
        stability: {
          name: "Stability",
          value: this.#pet.default_stats.stability,
          increaseBy: 3,
          cooldown: 5000,
          lastIncreased: 0,
          actionLabel: "Stabilize",
          rowElement: null,
        },
        energy: {
          name: "Energy",
          value: this.#pet.default_stats.energy,
          increaseBy: 10,
          cooldown: 10000,
          lastIncreased: 0,
          actionLabel: "Energize",
          rowElement: null,
        },
        strength: {
          name: "Strength",
          value: this.#pet.default_stats.strength,
          increaseBy: 3,
          cooldown: 3000,
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
    localStorage.setItem("score", this.#score!.toString());
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
        <div class="top-panel__end">
          <div class="top-panel__stats">
            <p id="high-score-label">Best ${localStorage.getItem("highScore") ?? 0}</p>
            <p id="score-label">Score ${localStorage.getItem("score") ?? 0}</p>
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

    this.#gameInterfaceTopPanel = this.#gameInterface!.querySelector(
      ".game-interface__top-panel",
    ) as HTMLDivElement;
    this.#themeSwitcherButton = this.#gameInterfaceTopPanel.querySelector(
      "#theme-switcher-panel-action",
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
      `,
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
      `,
    );

    this.#statsList = this.#columns![0].querySelector(
      ".stats-viewer .stats-viewer__stats-list",
    )!;

    for (const [stat, properties] of Object.entries(this.#stats)) {
      const statRow: HTMLDivElement = document.createElement("div");
      statRow.className = "stats-list__stat-row";
      statRow.dataset.stat = stat;
      statRow.innerHTML = `
      <p class="w-[25%]" data-name="title">${properties.name}</p>
      <div class="stat-row__progress-bar" data-name="progress-outline">
        <div class="progress-bar__progress" style="width: ${Math.max(
          0,
          Math.min(100, properties.value),
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
      ".stats-viewer .stats-viewer__stat-buttons",
    )!;

    for (const [stat, properties] of Object.entries(this.#stats)) {
      const button: HTMLButtonElement = document.createElement("button");
      button.className = "stat-buttons__button";
      button.dataset.stat = stat;
      button.textContent = properties.actionLabel;
      button.addEventListener("click", () => {
        let timeLeft: number =
          properties.lastIncreased + properties.cooldown - Date.now();

        if (100 - properties.value >= properties.increaseBy) {
          if (Date.now() - properties.lastIncreased >= properties.cooldown) {
            button.disabled = true;

            properties.value += properties.increaseBy;

            properties.rowElement!.querySelector(
              "[data-name='value']",
            )!.textContent =
              (properties.value < 0 ? "" : "+") + properties.value;

            properties.rowElement!.querySelector(
              "[data-name='progress-bar']",
            ).style.width = `${Math.max(0, Math.min(100, properties.value))}%`;

            properties.lastIncreased = Date.now();

            this.#createLogItem(
              greenColor,
              `You have increased your planet's ${stat}!`,
            );

            let countdownInterval: any;
            countdownInterval = setInterval(() => {
              let timeLeft =
                properties.lastIncreased + properties.cooldown - Date.now();

              if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                button.textContent = properties.actionLabel;
                button.disabled = false;
                return;
              }

              button.textContent = (timeLeft / 1000).toFixed(1) + " s";
            }, 100);
          } else {
            this.#createLogItem(
              purpleColor,
              `Please wait ${(timeLeft / 1000).toFixed(
                3,
              )} seconds before increasing your pet's ${stat}!`,
            );
          }
        } else {
          this.#createLogItem(
            purpleColor,
            `Your planet's ${stat} is already optimal!`,
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
            "",
          )} Welcome to the observatory. Nurture your planet and help it grow!</p>
        </div>
      </div>
      `,
    );

    this.#logContent = this.#columns![1].querySelector(
      ".log-view .log-view__log-content",
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
      Date.now(),
    ).toLocaleString()}]</span>`;
  }

  #createLogItem(style: string, message: string) {
    this.#logContent!.insertAdjacentHTML(
      "beforeend",
      `
      <p>${this.#createTimestamp("log-item__date", style)} ${message}</p>
      `,
    );

    this.#logContent!.scrollTop = this.#logContent!.scrollHeight;
  }

  #createStatInterval(
    stat: Record<string, any>,
    interval: Record<string, any>,
  ) {
    interval.intervalID = setInterval(() => {
      stat.value += interval.changeBy!;
      this.#saveStats();

      stat.rowElement!.querySelector("[data-name='value']").textContent =
        (stat.value < 0 ? "" : "+") + stat.value;

      stat.rowElement!.querySelector("[data-name='progress-bar']").style.width =
        `${Math.max(0, Math.min(100, stat.value))}%`;
    }, interval.tickRate!);
  }

  #checkStat(
    name: string,
    stat: Record<string, any>,
    intervals: Record<string, any>,
  ) {
    const rules = statRules[name];
    const value = stat.value;

    const progressOutline = stat.rowElement!.querySelector(
      "[data-name='progress-outline']",
    ) as HTMLDivElement;
    const progressBar = stat.rowElement!.querySelector(
      "[data-name='progress-bar']",
    ) as HTMLDivElement;

    if (value <= 0) {
      if (!intervals.zeroNotified) {
        this.#createLogItem(rules.zero.color, rules.zero.message);
        intervals.zeroNotified = true;
        intervals.criticalNotified = false;
        intervals.warningNotified = false;
      }

      progressOutline.className =
        "stat-row__progress-bar stat-row__progress-bar--zero";
      progressBar.className =
        "progress-bar__progress progress-bar__progress--zero";

      clearInterval(stabilityInterval.intervalID);
      clearInterval(energyInterval.intervalID);
      clearInterval(strengthInterval.intervalID);
      clearInterval(this.#gameLoopID);

      localStorage.removeItem("adoptedPet");
      localStorage.removeItem("petStats");

      this.#createLogItem(
        darkRedColor,
        `Your planet has collapsed due to a depletion of ${stat.name}. The game will restart in 5 seconds. ☹`,
      );
      setTimeout(() => {
        this.fadeOut();
        setTimeout(() => window.location.reload(), 3000);
      }, 5000);
    } else if (value < rules.critical.threshold) {
      if (!intervals.criticalNotified) {
        this.#createLogItem(rules.critical.color, rules.critical.message);
        intervals.zeroNotified = false;
        intervals.criticalNotified = true;
        intervals.warningNotified = false;
      }

      progressOutline.className =
        "stat-row__progress-bar stat-row__progress-bar--critical";
      progressBar.className =
        "progress-bar__progress progress-bar__progress--critical";
    } else if (value < rules.warning.threshold) {
      if (!intervals.warningNotified) {
        this.#createLogItem(rules.warning.color, rules.warning.message);
        intervals.zeroNotified = false;
        intervals.criticalNotified = false;
        intervals.warningNotified = true;
      }

      progressOutline.className =
        "stat-row__progress-bar stat-row__progress-bar--warning";
      progressBar.className =
        "progress-bar__progress progress-bar__progress--warning";
    } else {
      progressOutline.className = "stat-row__progress-bar";
      progressBar.className = "progress-bar__progress";
    }
  }

  startGameLoop() {
    let stability: Record<string, any> = this.#stats.stability!;
    let energy: Record<string, any> = this.#stats.energy!;
    let strength: Record<string, any> = this.#stats.strength!;

    this.#createStatInterval(stability, stabilityInterval);
    this.#createStatInterval(energy, energyInterval);
    this.#createStatInterval(strength, strengthInterval);

    this.#gameLoopID = setInterval(() => {
      this.#checkStat("stability", stability, stabilityInterval);
      this.#checkStat("energy", energy, energyInterval);
      this.#checkStat("strength", strength, strengthInterval);

      this.#score! += 1;
      if (this.#score! > Number(localStorage.getItem("highScore") ?? 0)) {
        localStorage.setItem("highScore", this.#score!.toString());
        document.getElementById("high-score-label")!.textContent =
          `Best ${this.#score!}`;
      }

      document.getElementById("score-label")!.textContent =
        `Score ${this.#score!}`;

      this.#saveStats();
    }, 1000);
  }
}
