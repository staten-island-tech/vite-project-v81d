export default class ThemeSwitcher {
  #theme: string;

  constructor(theme: string = "dark-theme") {
    this.#theme = theme;
  }

  attachClickAction(button: HTMLButtonElement) {
    button.addEventListener("click", () => {
      this.forceTheme();
    });
  }

  setTheme(theme: string) {
    this.#theme = theme;
  }

  forceTheme() {
    const newTheme = this.#theme === "dark-theme" ? "light-theme" : "dark-theme";
    document.body.className = newTheme;
    this.#theme = newTheme;
  }
}
