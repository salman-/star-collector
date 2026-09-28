import { useState } from 'react';
import Menu from './Menu';
import PhaserGame from './PhaserGame';

function App() {
    const [score, setScore] = useState(0);

    return (
        <div className="container-fluid p-0 d-flex flex-column vh-100 overflow-hidden">
            <Menu score={score} />
            <PhaserGame onScoreChange={setScore} />
        </div>
    );
}

export default App;
