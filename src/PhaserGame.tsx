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

      width: 800,
      height: 600,

      parent: gameContainer.current,

      scene: GameScene,
    });

    return () => {
      // Destroy the Phaser game when the component unmounts.
      game.destroy(true);
    };
  }, []);

  return <div ref={gameContainer} />;
}

export default PhaserGame;
