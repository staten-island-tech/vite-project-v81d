export default class StarryBackground {
  appContainer: HTMLDivElement;

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

      for (const dot of dots) {
        dot.x = Math.random() * canvas.width;
        dot.y = Math.random() * canvas.height;
      }
    });

    const dots: Dot[] = [];

    for (let i = 0; i < dotCount; i++) {
      const radius = Math.random() * 2 + 1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const vx = (Math.random() - 0.1) * 0.1;
      const vy = (Math.random() - 0.1) * 0.1;
      dots.push(new Dot(x, y, vx, vy, radius));
    }

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (const dot of dots) {
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
    context.fill();
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= canvasWidth) this.vx *= -1;
    if (this.y <= 0 || this.y >= canvasHeight) this.vy *= -1;
  }
}
