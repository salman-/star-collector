import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { GameScene } from "./game/GameScene";

function PhaserGame() {
  const gameContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip Phaser setup if the container element is not mounted.
    if (!gameContainer.current) {
      return;
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: gameContainer.current,
      backgroundColor: '#000000',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
      },
      physics: {
        default: 'arcade',
        arcade: { gravity: { x: 0, y: 300 }, debug: false },
      },
      scene: GameScene,
    });

    return () => {
      // Destroy the Phaser game when the component unmounts.
      game.destroy(true);
    };
  }, []);

  return <div ref={gameContainer} className="game-container flex-grow-1" />;
}

export default PhaserGame;
