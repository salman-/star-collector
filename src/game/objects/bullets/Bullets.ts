import Phaser from "phaser";
import { Bullet } from "./Bullet";
import type { Player } from "../player/Player";

/** Owns the bullet collection and handles firing and cleanup. */
export class Bullets {
  readonly group: Phaser.Physics.Arcade.Group;

  constructor(private scene: Phaser.Scene) {
    this.group = scene.physics.add.group({ allowGravity: false });
  }

  /** Fires a bullet in the player's current horizontal direction. */
  fireFrom(player: Player): void {
    const direction = Math.sign(
      (player.body as Phaser.Physics.Arcade.Body).velocity.x,
    );
    if (direction === 0) return;

    const x = player.x + direction * (player.displayWidth / 2 + 8);
    const bullet = new Bullet(this.scene, x, player.y);
    this.group.add(bullet);
    bullet.setVelocity(direction * 500, 0);
    bullet.setFlipX(direction < 0);
    this.scene.time.delayedCall(2000, () => this.remove(bullet));
  }

  /** Removes a bullet after it hits a bomb or expires. */
  remove(bullet: Bullet): void {
    bullet.destroy();
  }
}
