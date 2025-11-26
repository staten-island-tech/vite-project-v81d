const images = import.meta.glob(
  "/public/images/asteroids/*.{png,jpg,jpeg,gif}"
);

const asteroidImages: string[] = Object.keys(images);

const asteroidProbabilityPerTick = 0.05;

export default class AsteroidSpawner {
  shouldSpawnAsteroid(): boolean {
    if (Math.random() < asteroidProbabilityPerTick) {
      return true;
    }

    return false;
  }

  async spawnAsteroid(
    appContainer: any,
    startPosition: { top: string; left: string }
  ): Promise<boolean | void> {
    const randomIndex = Math.floor(Math.random() * asteroidImages.length);
    const asteroidPath = asteroidImages[randomIndex];

    const asteroidDiv = document.createElement("div");
    asteroidDiv.className = "asteroid-wrapper";
    asteroidDiv.style.top = startPosition.top;
    asteroidDiv.style.left = startPosition.left;

    const asteroidImage = document.createElement("img");
    asteroidImage.src = asteroidPath;
    asteroidImage.alt = "Asteroid";
    asteroidImage.className = "asteroid-wrapper__image";
    asteroidImage.draggable = false;

    const animationName = `moveAsteroid_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    const endPosition = this.#getOppositePosition(startPosition);
    const moveDuration = this.#addMoveAsteroidKeyframes(
      startPosition,
      endPosition,
      animationName
    );

    asteroidDiv.style.animation = `${animationName} ${moveDuration}s linear forwards`;

    asteroidDiv.addEventListener("click", () => {
      asteroidImage.style.opacity = "0";
      setTimeout(() => {
        asteroidDiv.remove();
        return true;
      }, 200);
    });

    asteroidDiv.append(asteroidImage);
    appContainer.append(asteroidDiv);

    asteroidDiv.addEventListener("animationend", () => {
      asteroidImage.style.opacity = "0";
      setTimeout(() => {
        asteroidDiv.remove();
        return false;
      }, 200);
    });
  }

  getRandomStartPosition(): { top: string; left: string } {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const clamp = (n: number, min: number, max: number) =>
      Math.min(max, Math.max(min, n));

    const edge = Math.floor(Math.random() * 4); // pick an edge (top, right, bottom, left)

    switch (edge) {
      case 0: // top edge
        return {
          top: "-100px",
          left: `${clamp(
            Math.random() * windowWidth,
            100,
            windowWidth - 100
          )}px`,
        };
      case 1: // right edge
        return {
          top: `${clamp(
            Math.random() * windowHeight,
            100,
            windowHeight - 100
          )}px`,
          left: `${windowWidth + 100}px`,
        };
      case 2: // bottom edge
        return {
          top: `${windowHeight + 100}px`,
          left: `${clamp(
            Math.random() * windowWidth,
            100,
            windowWidth - 100
          )}px`,
        };
      case 3: // left edge
        return {
          top: `${clamp(
            Math.random() * windowHeight,
            100,
            windowHeight - 100
          )}px`,
          left: `-100px`,
        };
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

    if (startPosition.left === `${windowWidth + 400}px`) {
      return { top: startPosition.top, left: `-100px` }; // right to left
    }

    if (startPosition.top === `${windowHeight + 400}px`) {
      return { top: `-100px`, left: startPosition.left }; // bottom to top
    }

    if (startPosition.left === "-100px") {
      return { top: startPosition.top, left: `${windowWidth + 400}px` }; // left to right
    }

    return { top: "0", left: "0" };
  }

  #addMoveAsteroidKeyframes(
    startPosition: { top: string; left: string },
    endPosition: { top: string; left: string },
    animationName: string
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

    const angle = Math.random() * Math.PI;
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
