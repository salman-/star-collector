import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private stars!: Phaser.Physics.Arcade.Group;
  private bombs!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private score = 0;
  private gameOver = false;

  constructor() {
    super("GameScene");
  }

  preload() {
    const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;
    this.load.image("sky", asset("sky.png"));
    this.load.image("ground", asset("platform.png"));
    this.load.image("star", asset("star.png"));
    this.load.image("bomb", asset("bomb.png"));
    this.load.spritesheet("dude", asset("dude.png"), {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "sky").setDisplaySize(width, height);

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

    // Spawn slightly above the ground so Arcade Physics can resolve a clean landing.
    this.player = this.physics.add.sprite(width / 2, height - 72, "dude");
    this.player.setBounce(0.2).setCollideWorldBounds(true);

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

    this.cursors = this.input.keyboard!.createCursorKeys();
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
    this.bombs = this.physics.add.group();
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

  update() {
    if (this.gameOver) return;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-220).anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(220).anims.play("right", true);
    } else {
      this.player.setVelocityX(0).anims.play("turn");
    }

    const body = this.player.body;
    const isGrounded = body?.touching.down || body?.blocked.down;
    if (this.cursors.up.isDown && isGrounded) {
      this.player.setVelocityY(-450);
    }
  }

  private collectStar = (_player: unknown, starObject: unknown) => {
    const star = starObject as Phaser.Physics.Arcade.Sprite;
    star.disableBody(true, true);
    this.score += 10;
    this.game.events.emit("score-updated", this.score);

    if (this.stars.countActive(true) !== 0) return;

    this.stars.getChildren().forEach((child) => {
      const item = child as Phaser.Physics.Arcade.Sprite;
      item.enableBody(true, item.x, 0, true, true);
    });

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
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    (bomb.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
  };

  private hitBomb = () => {
    this.physics.pause();
    this.player.setTint(0xff0000).anims.play("turn");
    this.gameOver = true;
  };
}
