type MenuProps = {
  score: number;
  bestScore: number;
};

const Menu = ({ score, bestScore }: MenuProps) => {
  return (
    <header className="game-menu">
      <button
        className="game-menu__new-game"
        type="button"
        onClick={() => window.location.reload()}
      >
        NEW GAME
      </button>
      <div className="game-menu__stats" aria-label="Game scores">
        <div className="game-menu__stat">
          <span className="game-menu__label">Score</span>
          <span className="game-menu__value">{score}</span>
        </div>
        <div className="game-menu__stat game-menu__stat--best">
          <span className="game-menu__label">Best score</span>
          <span className="game-menu__value">{bestScore}</span>
        </div>
      </div>
    </header>
  );
};

export default Menu;
