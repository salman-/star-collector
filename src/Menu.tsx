type MenuProps = {
  score: number;
};

const Menu = ({ score }: MenuProps) => {
  return (
    <header className="d-flex align-items-center gap-3 p-3 bg-body-tertiary">
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => window.location.reload()}
      >
        NEW GAME
      </button>
      <h2 className="h4 mb-0">Score: {score}</h2>
    </header>
  );
};

export default Menu;
