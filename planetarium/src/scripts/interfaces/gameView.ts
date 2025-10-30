/* This class is used to construct the framework for the actual base interface of the game.
 * Event listeners are handled elsewhere
 */

export default class GameInterface {
  #appContainer: HTMLDivElement;
  #gameInterface?: HTMLDivElement;

  constructor(appContainer: HTMLDivElement) {
    this.#appContainer = appContainer;
  }

  build() {
    this.#appContainer.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="app__game-interface">
      <h1 class="text-3xl font-bold">GAME CONTENT PLACEHOLDER</h1>
    </div>
    `,
    );

    this.#gameInterface = this.#appContainer.querySelector(
      ".app__game-interface",
    ) as HTMLDivElement;
    this.#gameInterface.offsetHeight; // reflow
  }

  fadeIn() {
    this.#gameInterface!.style.opacity = "1";
  }

  fadeOut() {
    this.#gameInterface!.style.opacity = "0";
  }
}
