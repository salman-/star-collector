import Phaser from "phaser";

type StaticPlatform = Phaser.Types.Physics.Arcade.GameObjectWithStaticBody & {
  setPosition(x: number, y: number): StaticPlatform;
  refreshBody(): StaticPlatform;
};

/** Owns the platforms and creates reachable randomized ledge layouts. */
export class Platforms {
  readonly group: Phaser.Physics.Arcade.StaticGroup;
  private readonly ledges: StaticPlatform[] = [];
  private readonly maxHorizontalJump = 410;
  private readonly scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const { width, height } = scene.scale;
    this.group = scene.physics.add.staticGroup();
    const ground = this.group.create(width / 2, height - 16, "ground");
    ground.setDisplaySize(width, 32);
    ground.refreshBody();

    for (let index = 0; index < 4; index++) {
      const ledge = this.group.create(width / 2, height - 120, "ground");
      ledge.setDisplaySize(160, 24);
      ledge.refreshBody();
      this.ledges.push(ledge);
    }

    this.randomizeLedges(false);
  }

  /** Shuffles ledges across the screen while keeping every jump reachable. */
  randomizeLedges(animate = true): void {
    const { width, height } = this.scene.scale;
    const columns = [0.14, 0.38, 0.62, 0.86].map((part) => width * part);
    const columnOrder = this.getReachableColumnOrder(columns);
    let y = height - 120;

    this.ledges.forEach((ledge, index) => {
      if (index > 0) {
        y -= Phaser.Math.Between(88, 102);
      }

      const baseX = columns[columnOrder[index]];
      const x = baseX + Phaser.Math.Between(-12, 12);
      this.moveLedge(ledge, x, y, animate);
    });
  }

  /** Moves a ledge smoothly and keeps its static physics body in sync. */
  private moveLedge(
    ledge: StaticPlatform,
    x: number,
    y: number,
    animate: boolean,
  ): void {
    this.scene.tweens.killTweensOf(ledge);

    if (!animate) {
      ledge.setPosition(x, y);
      ledge.refreshBody();
      return;
    }

    this.scene.tweens.add({
      targets: ledge,
      x,
      y,
      duration: 900,
      ease: "Sine.easeInOut",
      onUpdate: () => ledge.refreshBody(),
      onComplete: () => ledge.refreshBody(),
    });
  }

  /** Picks a random order whose neighboring ledges stay within jump range. */
  private getReachableColumnOrder(columns: number[]): number[] {
    const findPath = (
      order: number[],
      remaining: number[],
    ): number[] | undefined => {
      if (remaining.length === 0) return order;

      const lastColumn = columns[order[order.length - 1]];
      const nextColumns = Phaser.Utils.Array.Shuffle(
        remaining.filter(
          (column) =>
            Math.abs(columns[column] - lastColumn) <= this.maxHorizontalJump,
        ),
      );

      for (const nextColumn of nextColumns) {
        const path = findPath(
          [...order, nextColumn],
          remaining.filter((column) => column !== nextColumn),
        );
        if (path) return path;
      }
    };

    const starts = Phaser.Utils.Array.Shuffle(columns.map((_, index) => index));
    for (const start of starts) {
      const path = findPath(
        [start],
        columns.map((_, index) => index).filter((index) => index !== start),
      );
      if (path) return path;
    }

    return columns.map((_, index) => index);
  }
}
