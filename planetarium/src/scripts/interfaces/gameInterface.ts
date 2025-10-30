/* This class is used to construct the framework for the actual base interface of the game.
 * Event listeners are handled elsewhere
 */

export default class GameInterface {
  #appContainer: HTMLDivElement;

  constructor(appContainer: HTMLDivElement) {
    this.#appContainer = appContainer;
    this.#build();
  }

  #build() {}

  fadeIn() {}

  fadeOut() {}
}
