import Phaser from "phaser";

/** Represents one bomb and its physics body. */
export class Bomb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number) {
    super(scene, x, 16, "bomb");
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
