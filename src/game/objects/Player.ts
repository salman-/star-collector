import Phaser from "phaser";
import { Bullet } from "./Bullet";

/** Owns player setup, movement, jumping, animations, and shooting. */
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "dude");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setBounce(0.2).setCollideWorldBounds(true);
    this.createAnimations();
  }

  /** Moves and jumps the player from the arrow key state. */
  handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    if (cursors.left.isDown) {
      this.setVelocityX(-220).anims.play("left", true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(220).anims.play("right", true);
    } else {
      this.setVelocityX(0).anims.play("turn");
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (cursors.up.isDown && (body.touching.down || body.blocked.down)) {
      const jumpHeight = 100 + 20;
      const gravity = this.scene.physics.world.gravity.y;
      this.setVelocityY(-Math.sqrt(2 * gravity * jumpHeight));
    }
  }

  /** Shoots a bullet in the player's current horizontal direction. */
  shoot(bullets: Phaser.Physics.Arcade.Group): void {
    Bullet.fire(this.scene, bullets, this);
  }

  private createAnimations(): void {
    const animations = this.scene.anims;
    animations.create({
      key: "left",
      frames: animations.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    animations.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    animations.create({
      key: "right",
      frames: animations.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
