import Phaser from "phaser";

/** Creates and manages the collectible star group. */
export class Stars {
  readonly group: Phaser.Physics.Arcade.Group;

  /** Places the stars across the top of the game and gives them a bounce. */
  constructor(scene: Phaser.Scene) {
    const { width } = scene.scale;
    this.group = scene.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 50, y: 0, stepX: Math.max(50, width / 12) },
    });

    this.group.getChildren().forEach((child) => {
      (child as Phaser.Physics.Arcade.Sprite).setBounceY(
        Phaser.Math.FloatBetween(0.4, 0.8),
      );
    });
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
      const star = child as Phaser.Physics.Arcade.Sprite;
      star.enableBody(true, star.x, 0, true, true);
    });
  }
}
