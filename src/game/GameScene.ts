import Phaser from "phaser";
import { Bomb } from "./objects/Bomb";
import { Platforms } from "./objects/Platforms";
import { Player } from "./objects/Player";
import { Stars } from "./objects/Stars";

/** Connects the game objects, physics interactions, and score events. */
export class GameScene extends Phaser.Scene {
  private player!: Player;
  private stars!: Stars;
  private bombs!: Phaser.Physics.Arcade.Group;
  private bullets!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private shootKey!: Phaser.Input.Keyboard.Key;
  private score = 0;
  private gameOver = false;

  /** Creates the scene with its Phaser scene key. */
  constructor() {
    super("GameScene");
  }

  /** Loads all images and sprite frames used by the game. */
  preload(): void {
    const assetPath = (fileName: string) =>
      `${import.meta.env.BASE_URL}assets/${fileName}`;
    this.load.image("sky", assetPath("sky.png"));
    this.load.image("ground", assetPath("platform.png"));
    this.load.image("star", assetPath("star.png"));
    this.load.image("bomb", assetPath("bomb.png"));
    this.load.image("bullet", assetPath("bullet.png"));
    this.load.spritesheet("dude", assetPath("dude.png"), {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  /** Creates the world and connects its physics and input. */
  create(): void {
    this.createBackground();
    const platforms = Platforms.create(this);
    const { width, height } = this.scale;
    this.player = new Player(this, width / 2, height - 72);
    this.stars = new Stars(this);
    this.bombs = this.physics.add.group({ allowGravity: false });
    this.bullets = this.physics.add.group({ allowGravity: false });
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.shootKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.connectPhysics(platforms);
  }

  /** Draws the sky behind the play area. */
  private createBackground(): void {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, "sky").setDisplaySize(width, height);
  }

  /** Registers the collisions and overlaps between game objects. */
  private connectPhysics(
    platforms: Phaser.Physics.Arcade.StaticGroup,
  ): void {
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.stars.group, platforms);
    this.physics.add.collider(this.bombs, platforms);
    this.physics.add.overlap(
      this.player,
      this.stars.group,
      this.collectStar,
      undefined,
      this,
    );
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.bullets,
      this.bombs,
      this.hitBombWithBullet,
      undefined,
      this,
    );
  }

  /** Updates the player while the game is active. */
  update(): void {
    if (this.gameOver) return;

    this.player.handleInput(this.cursors);
    if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
      this.player.shoot(this.bullets);
    }
  }

  /** Awards points when a star is collected and starts the next star round. */
  private collectStar = (_player: unknown, starObject: unknown): void => {
    this.stars.collect(starObject as Phaser.Physics.Arcade.Sprite);
    this.addScore(10);

    if (this.stars.hasActiveStars()) return;
    this.stars.reset();
    this.spawnBomb();
  };

  /** Removes a bullet and bomb, awards points, and spawns two new bombs. */
  private hitBombWithBullet = (
    bulletObject: unknown,
    bombObject: unknown,
  ): void => {
    (bulletObject as Phaser.Physics.Arcade.Sprite).destroy();
    (bombObject as Phaser.Physics.Arcade.Sprite).destroy();
    this.addScore(50);
    this.spawnBomb();
    this.spawnBomb();
  };

  /** Pauses the game when the player touches a bomb. */
  private hitBomb = (): void => {
    this.physics.pause();
    this.player.setTint(0xff0000).anims.play("turn");
    this.gameOver = true;
  };

  /** Updates the current score and notifies the React interface. */
  private addScore(points: number): void {
    this.score += points;
    this.game.events.emit("score-updated", this.score);
  }

  /** Adds a bomb on the side opposite the player. */
  private spawnBomb(): void {
    Bomb.spawnAwayFromPlayer(this, this.bombs, this.player);
  }
}
