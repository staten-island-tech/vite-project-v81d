const images = import.meta.glob(
  "/public/images/asteroids/*.{png,jpg,jpeg,gif}",
);

const asteroidImages: string[] = Object.keys(images);

const asteroidProbabilityPerTick = 0.075;

export default class AsteroidSpawner {
  #appContainer: HTMLDivElement;

  constructor(appContainer: HTMLDivElement) {
    this.#appContainer = appContainer;
  }

  shouldSpawnAsteroid(): boolean {
    if (Math.random() < asteroidProbabilityPerTick) {
      return true;
    }

    return false;
  }

  spawnAsteroid(startPosition: { top: string; left: string }) {
    const randomIndex = Math.floor(Math.random() * asteroidImages.length);
    const asteroidPath = asteroidImages[randomIndex];

    const asteroidImage = document.createElement("img");
    asteroidImage.src = asteroidPath;
    asteroidImage.alt = "Asteroid";

    asteroidImage.style.zIndex = "9999";
    asteroidImage.style.position = "fixed";
    asteroidImage.style.top = startPosition.top;
    asteroidImage.style.left = startPosition.left;
    asteroidImage.style.width = "150px";

    const animationName = `moveAsteroid_${Math.random().toString(36).substring(2, 9)}`;
    const endPosition = this.#getOppositePosition(startPosition);
    const moveDuration = this.#addMoveAsteroidKeyframes(
      startPosition,
      endPosition,
      animationName,
    );

    asteroidImage.style.animation = `${animationName} ${moveDuration}s linear forwards`;

    this.#appContainer.append(asteroidImage);

    asteroidImage.addEventListener("animationend", (e: AnimationEvent) => {
      if (e.animationName === animationName) asteroidImage.remove();
    });
  }

  getRandomStartPosition(): { top: string; left: string } {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const edge = Math.floor(Math.random() * 4); // pick an edge (top, right, bottom, left)

    switch (edge) {
      case 0: // top edge
        return { top: "-100px", left: `${Math.random() * windowWidth}px` };
      case 1: // right edge
        return {
          top: `${Math.random() * windowHeight}px`,
          left: `${windowWidth + 100}px`,
        };
      case 2: // bottom edge
        return {
          top: `${windowHeight + 100}px`,
          left: `${Math.random() * windowWidth}px`,
        };
      case 3: // left edge
        return { top: `${Math.random() * windowHeight}px`, left: `-100px` };
      default:
        return { top: "0", left: "0" };
    }
  }

  #getOppositePosition(startPosition: { top: string; left: string }): {
    top: string;
    left: string;
  } {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (startPosition.top === "-100px") {
      return { top: `${windowHeight + 100}px`, left: startPosition.left }; // top to bottom
    }

    if (startPosition.left === `${windowWidth + 100}px`) {
      return { top: startPosition.top, left: `-100px` }; // right to left
    }

    if (startPosition.top === `${windowHeight + 100}px`) {
      return { top: `-100px`, left: startPosition.left }; // bottom to top
    }

    if (startPosition.left === "-100px") {
      return { top: startPosition.top, left: `${windowWidth + 100}px` }; // left to right
    }

    return { top: "0", left: "0" };
  }

  #addMoveAsteroidKeyframes(
    startPosition: { top: string; left: string },
    endPosition: { top: string; left: string },
    animationName: string,
  ) {
    const style = document.createElement("style");
    document.head.appendChild(style);

    const startLeft = parseFloat(startPosition.left);
    const startTop = parseFloat(startPosition.top);
    const endLeft = parseFloat(endPosition.left);
    const endTop = parseFloat(endPosition.top);

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const maxDeviation = Math.min(windowWidth, windowHeight) * 0.3;

    const angle = Math.random() * 2 * Math.PI;
    const deltaX = Math.cos(angle) * maxDeviation;
    const deltaY = Math.sin(angle) * maxDeviation;

    const moveX = endLeft - startLeft + deltaX;
    const moveY = endTop - startTop + deltaY;

    const actualDistance = Math.sqrt(moveX * moveX + moveY * moveY);
    const speedMultiplier = Math.random() * 0.006 + 0.0045;
    const moveDuration = Math.max(actualDistance * speedMultiplier, 3);

    const keyframes = `
      @keyframes ${animationName} {
        0% {
          transform: translate(0, 0) rotate(0deg);
        }
        100% {
          transform: translate(${moveX}px, ${moveY}px) rotate(360deg);
        }
      }
    `;

    style.innerHTML = keyframes;

    return moveDuration;
  }
}
