import Phaser from "phaser";
import type { Player } from "./Player";

/** Creates directional bullets and removes them after a short time. */
export class Bullet extends Phaser.Physics.Arcade.Sprite {
  private constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bullet");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
  }

  static fire(
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group,
    player: Player,
  ): void {
    const direction = Math.sign(
      (player.body as Phaser.Physics.Arcade.Body).velocity.x,
    );
    if (direction === 0) return;

    const x = player.x + direction * (player.displayWidth / 2 + 8);
    const bullet = new Bullet(scene, x, player.y);
    group.add(bullet);
    bullet.setVelocity(direction * 500, 0);
    bullet.setFlipX(direction < 0);
    scene.time.delayedCall(2000, () => bullet.destroy());
  }
}
