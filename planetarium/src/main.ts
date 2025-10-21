import planets from "./assets/json/planets.json";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1 class="text-5xl font-bold">Select a Planet</h1>
    <div class=""></div>
    <p class="text-xl">
      Select a planet as your pet.
    </p>
  </div>
`;
