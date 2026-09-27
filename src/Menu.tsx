import { useState } from "react";

const Menu = () => {
  const [score, setScore] = useState(0);

  return (
    <header className="d-flex align-items-center gap-3 p-3 bg-body-tertiary">
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => {
          setScore(score + 1);
        }}
      >
        NEW GAME
      </button>
      <h2 className="h4 mb-0">Score: {score}</h2>
    </header>
  );
};

export default Menu;
