export default class ThemeSwitcher {
  #theme: string;

  constructor(theme: string) {
    this.#theme = theme;
    document.body.className = this.#theme;
  }

  attachClickAction(button: HTMLButtonElement) {
    button.addEventListener("click", () => {
      this.forceThemeFlip();

      button.textContent =
        this.#theme === "dark-theme" ? "Light Theme" : "Dark Theme";
    });
  }

  forceThemeFlip() {
    this.#theme = this.#theme === "dark-theme" ? "light-theme" : "dark-theme";
    document.body.className = this.#theme;
    localStorage.setItem("theme", this.#theme);
  }
}
