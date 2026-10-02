import Phaser from "phaser";
import type { Player } from "./Player";

/** Configures and spawns bombs away from the player. */
export class Bomb extends Phaser.Physics.Arcade.Sprite {
  private constructor(scene: Phaser.Scene, x: number) {
    super(scene, x, 16, "bomb");
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  static spawnAwayFromPlayer(
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group,
    player: Player,
  ): void {
    const width = scene.scale.width;
    const x = player.x < width / 2
      ? Phaser.Math.Between(width / 2, width - 50)
      : Phaser.Math.Between(50, width / 2);
    const bomb = new Bomb(scene, x);
    group.add(bomb);
    bomb.setBounce(1).setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(100, 300), 100);
  }
}
