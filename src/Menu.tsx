import { useState } from "react";

const Menu = () => {
  const [score, setScore] = useState(0);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setScore(score + 1);
        }}
      >
        NEW GAME
      </button>
      <h1>score: {score}</h1>
    </div>
  );
};

export default Menu;
