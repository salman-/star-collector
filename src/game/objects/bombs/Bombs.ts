import Phaser from "phaser";
import { Bomb } from "./Bomb";
import type { Player } from "../player/Player";

/** Owns the bomb collection and handles bomb spawning and removal. */
export class Bombs {
  readonly group: Phaser.Physics.Arcade.Group;

  constructor(private scene: Phaser.Scene) {
    this.group = scene.physics.add.group({ allowGravity: false });
  }

  /** Spawns a moving bomb on the side opposite the player. */
  spawnAwayFromPlayer(player: Player): void {
    const width = this.scene.scale.width;
    const x = player.x < width / 2
      ? Phaser.Math.Between(width / 2, width - 50)
      : Phaser.Math.Between(50, width / 2);
    const bomb = new Bomb(this.scene, x);

    this.group.add(bomb);
    bomb.setBounce(1).setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(100, 300), 100);
  }

  /** Removes a bomb after it is hit by a bullet. */
  remove(bomb: Bomb): void {
    bomb.destroy();
  }
}
