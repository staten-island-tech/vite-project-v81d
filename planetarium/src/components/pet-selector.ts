export function setupPetSelector(
  container: HTMLDivElement,
  pets: Array<String>
) {
  for (let i = 0; i < pets.length; i++) {
    container.insertAdjacentHTML("beforeend", `
      <div class="flex"></div>
    `);
  }
}
