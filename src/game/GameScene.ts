import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    create() {

        const rectangle = this.add.rectangle(
            400,
            50,
            80,
            80,
            0xff3366
        );

        this.tweens.add({
            targets: rectangle,
            y: 550,
            duration: 2000,
            ease: 'Linear'
        });
    }
}