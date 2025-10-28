export default class ThemeSwitcher {
  #appContainer: HTMLDivElement;
  #theme: string;

  constructor(appContainer: HTMLDivElement, theme: string) {
    this.#appContainer = appContainer;
    this.#theme = theme;
  }

  setTheme(theme: string) {
    this.#theme = theme;
  }

  forceTheme() {
    document.body.classList.add(this.#theme);
  }
}
