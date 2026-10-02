import Phaser from "phaser";

/** Represents one collectible star and its physics body. */
export class Star extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "star");
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
