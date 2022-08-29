import { range } from "../utils";
import { BaseComponent, IComponent } from "./common";

export class PlayerHealth extends BaseComponent implements IComponent {
  hearts: number = 3;

  render(ctx: CanvasRenderingContext2D) {
    ctx.font = "40px sans-serif";
    ctx.fillText(
      range(this.hearts)
        .map(() => "💗")
        .join(""),
      window.innerWidth - 180,
      50
    );
  }
}
