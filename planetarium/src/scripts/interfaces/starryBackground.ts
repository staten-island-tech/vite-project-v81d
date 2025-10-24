export default class StarryBackground {
  appContainer: HTMLDivElement;
  dots?: Dot[];

  constructor(appContainer: HTMLDivElement) {
    this.appContainer = appContainer;
  }

  generateBackground(dotCount: number) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");

    canvas.id = "background-canvas";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "0";

    this.appContainer.prepend(canvas);

    const canvasElement = this.appContainer.querySelector(
      "#background-canvas",
    ) as HTMLCanvasElement;
    const context: CanvasRenderingContext2D = canvasElement.getContext("2d")!;

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      for (const dot of this.dots!) {
        dot.x = Math.random() * canvas.width;
        dot.y = Math.random() * canvas.height;
      }
    });

    this.dots = [];

    for (let i = 0; i < dotCount; i++) {
      const radius = Math.random() * 2 + 1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const vx = (Math.random() - 0.2) * 0.2;
      const vy = (Math.random() - 0.2) * 0.2;
      this.dots.push(new Dot(x, y, vx, vy, radius));
    }

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (const dot of this.dots!) {
        dot.update(canvas.width, canvas.height);
        dot.draw(context);
      }

      requestAnimationFrame(animate);
    };

    animate();
  }
}

class Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;

  constructor(x: number, y: number, vx: number, vy: number, radius: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.shadowBlur = 5;
    context.shadowColor = "white";
    context.fill();
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= canvasWidth) this.vx *= -1;
    if (this.y <= 0 || this.y >= canvasHeight) this.vy *= -1;
  }

  slide(direction: string, distance: number, duration: number) {
    /* u: up
     * d: down
     * l: left
     * r: right
     */
    if (!["u", "d", "l", "r"].includes(direction.toLowerCase()))
      throw new Error(
        `"${direction}" is not a valid direction. Allowed directions include: u, d, l, r.`,
      );

    const startX = this.x;
    const startY = this.y;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out bezier curve

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      switch (direction.toLowerCase()) {
        case "u":
          this.y = startY - distance * eased;
          break;
        case "d":
          this.y = startY + distance * eased;
          break;
        case "l":
          this.x = startX - distance * eased;
          break;
        case "r":
          this.x = startX + distance * eased;
          break;
        // No default since direction is validated anyway
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}
