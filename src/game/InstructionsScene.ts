import Phaser from "phaser";

/** Shows the game rules and starts gameplay when the player presses Space. */
export class InstructionsScene extends Phaser.Scene {
  private startKey!: Phaser.Input.Keyboard.Key;

  /** Creates the instruction scene with its own Phaser scene key. */
  constructor() {
    super("InstructionsScene");
  }

  /** Loads the sky image used behind the instructions. */
  preload(): void {
    this.load.image(
      "instructions-sky",
      `${import.meta.env.BASE_URL}assets/sky.png`,
    );
  }

  /** Draws the instructions and listens for the Space key to continue. */
  create(): void {
    const { width, height } = this.scale;
    this.startKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.add
      .image(width / 2, height / 2, "instructions-sky")
      .setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, 620, 340, 0x101827, 0.92)
      .setStrokeStyle(3, 0xffffff);

    this.add.text(width / 2, height / 2 - 130, "HOW TO PLAY", {
      fontSize: "36px",
      color: "#ffffff",
      fontStyle: "bold",
    }).setOrigin(0.5);

    this.add.text(
      width / 2,
      height / 2 - 10,
      "Collect a star: +10 points\n\n← / → Move     ↑ Jump\n\nMove left or right and press SPACE to shoot at bombs\nHit a bomb: +50 points, and two more bombs appear",
      {
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        lineSpacing: 4,
        wordWrap: { width: 560 },
      },
    ).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 140, "Press SPACE to start", {
      fontSize: "22px",
      color: "#ffe066",
      fontStyle: "bold",
    }).setOrigin(0.5);
  }

  /** Starts the gameplay scene once Space has been pressed. */
  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.startKey)) {
      this.scene.start("GameScene");
    }
  }
}
