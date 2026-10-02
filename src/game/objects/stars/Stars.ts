import Phaser from "phaser";
import { Star } from "./Star";

/** Creates and manages the collectible star group. */
export class Stars {
  readonly group: Phaser.Physics.Arcade.Group;

  /** Creates a row of stars across the top of the game. */
  constructor(scene: Phaser.Scene) {
    const { width } = scene.scale;
    this.group = scene.physics.add.group();
    const count = 12;
    const stepX = Math.max(50, width / count);

    for (let index = 0; index < count; index++) {
      const star = new Star(scene, 50 + index * stepX, 0);
      this.group.add(star);
      star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    }
  }

  /** Hides a collected star. */
  collect(star: Phaser.Physics.Arcade.Sprite): void {
    star.disableBody(true, true);
  }

  /** Returns true while any stars remain visible and active. */
  hasActiveStars(): boolean {
    return this.group.countActive(true) > 0;
  }

  /** Re-enables all stars at their original horizontal positions at the top. */
  reset(): void {
    this.group.getChildren().forEach((child) => {
      const star = child as Star;
      star.enableBody(true, star.x, 0, true, true);
    });
  }
}
