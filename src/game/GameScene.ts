import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private stars!: Phaser.Physics.Arcade.Group;
  private bombs!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private score = 0;
  private gameOver = false;

  /** Creates the scene and gives it the name used by the Phaser game config. */
  constructor() {
    super("GameScene");
  }

  /** Loads the images and player sprite sheet before the scene starts. */
  preload(): void {
    const assetPath = (fileName: string) =>
      `${import.meta.env.BASE_URL}assets/${fileName}`;
    this.load.image("sky", assetPath("sky.png"));
    this.load.image("ground", assetPath("platform.png"));
    this.load.image("star", assetPath("star.png"));
    this.load.image("bomb", assetPath("bomb.png"));
    this.load.spritesheet("dude", assetPath("dude.png"), {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  /** Builds the scene by setting up its background, objects, controls, and rules. */
  create(): void {
    this.createBackground();
    const platforms = this.createPlatforms();
    this.createPlayer();
    this.createPlayerAnimations();
    this.createStars();
    this.bombs = this.physics.add.group();
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.createPhysicsRules(platforms);
  }

  /** Adds the sky image and stretches it to fill the game window. */
  private createBackground(): void {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, "sky").setDisplaySize(width, height);
  }

  /** Creates the floor and staircase platforms that support the game objects. */
  private createPlatforms(): Phaser.Physics.Arcade.StaticGroup {
    const { width, height } = this.scale;
    const platforms = this.physics.add.staticGroup();
    const ground = platforms.create(width / 2, height - 16, "ground");
    ground.setDisplaySize(width, 32);
    ground.refreshBody();

    // Four ledges form a steady staircase above the ground (five platforms total).
    const ledges = [
      { x: 120, y: 460 },
      { x: 306, y: 360 },
      { x: 492, y: 260 },
      { x: 678, y: 160 },
    ];
    for (const { x, y } of ledges) {
      const ledge = platforms.create(x, y, "ground");
      ledge.setDisplaySize(160, 24);
      ledge.refreshBody();
    }
    return platforms;
  }

  /** Places the player near the bottom of the scene and sets basic physics. */
  private createPlayer(): void {
    const { width, height } = this.scale;
    // Spawn slightly above the ground so Arcade Physics can resolve a clean landing.
    this.player = this.physics.add.sprite(width / 2, height - 72, "dude");
    this.player.setBounce(0.2).setCollideWorldBounds(true);
  }

  /** Defines the animations used when the player moves left, stands, or moves right. */
  private createPlayerAnimations(): void {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  /** Creates the collectible stars and gives each one a small bounce. */
  private createStars(): void {
    const { width } = this.scale;
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 50, y: 0, stepX: Math.max(50, width / 12) },
    });
    
    this.stars.getChildren().forEach((child) => {
      (child as Phaser.Physics.Arcade.Sprite).setBounceY(
        Phaser.Math.FloatBetween(0.4, 0.8),
      );
    });
  }

  /** Connects collisions and overlaps so the objects interact as expected. */
  private createPhysicsRules(
    platforms: Phaser.Physics.Arcade.StaticGroup,
  ): void {
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(this.bombs, platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
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
  }

  /** Reads the arrow keys and moves or jumps the player each frame. */
  update(): void {
    if (this.gameOver) return;

    this.movePlayerHorizontally();
    this.jumpPlayer();
  }

  /** Moves the player left or right, or plays the standing animation. */
  private movePlayerHorizontally(): void {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-220).anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(220).anims.play("right", true);
    } else {
      this.player.setVelocityX(0).anims.play("turn");
    }
  }

  /** Jumps only when the player is touching or blocked by a surface below. */
  private jumpPlayer(): void {
    const body = this.player.body;
    const isGrounded = body?.touching.down || body?.blocked.down;
    if (this.cursors.up.isDown && isGrounded) {
      const platformHeightDifference = 100;
      const extraHeight = 20;
      const targetJumpHeight = platformHeightDifference + extraHeight;
      const gravity = this.physics.world.gravity.y;

      // Physics formula: jump height = velocity² / (2 × gravity).
      this.player.setVelocityY(-Math.sqrt(2 * gravity * targetJumpHeight));
    }
  }

  /** Hides a collected star, adds score, and starts the next round when needed. */
  private collectStar = (_player: unknown, starObject: unknown) => {
    const star = starObject as Phaser.Physics.Arcade.Sprite;
    star.disableBody(true, true);
    this.score += 10;
    this.game.events.emit("score-updated", this.score);

    if (this.stars.countActive(true) !== 0) return;

    this.resetStars();
    this.createBombAwayFromPlayer();
  };

  /** Makes all stars visible again at the top of the scene. */
  private resetStars(): void {
    this.stars.getChildren().forEach((child) => {
      const star = child as Phaser.Physics.Arcade.Sprite;
      star.enableBody(true, star.x, 0, true, true);
    });
  }

  /** Adds a bouncing bomb on the side opposite the player. */
  private createBombAwayFromPlayer(): void {
    const width = this.scale.width;
    const x =
      this.player.x < width / 2
        ? Phaser.Math.Between(width / 2, width - 50)
        : Phaser.Math.Between(50, width / 2);
    const bomb = this.bombs.create(
      x,
      16,
      "bomb",
    ) as Phaser.Physics.Arcade.Sprite;
    bomb.setBounce(1).setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(100, 300), 100);
    (bomb.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
  }

  /** Pauses the game and marks the player when they touch a bomb. */
  private hitBomb = () => {
    this.physics.pause();
    this.player.setTint(0xff0000).anims.play("turn");
    this.gameOver = true;
  };
}
