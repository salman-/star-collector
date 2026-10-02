import Phaser from "phaser";

/** Builds the ground and staircase used by the game. */
export class Platforms {
  static create(scene: Phaser.Scene): Phaser.Physics.Arcade.StaticGroup {
    const { width, height } = scene.scale;
    const platforms = scene.physics.add.staticGroup();
    const ground = platforms.create(width / 2, height - 16, "ground");
    ground.setDisplaySize(width, 32);
    ground.refreshBody();

    for (const { x, y } of [
      { x: 120, y: 460 },
      { x: 306, y: 360 },
      { x: 492, y: 260 },
      { x: 678, y: 160 },
    ]) {
      const ledge = platforms.create(x, y, "ground");
      ledge.setDisplaySize(160, 24);
      ledge.refreshBody();
    }

    return platforms;
  }
}
