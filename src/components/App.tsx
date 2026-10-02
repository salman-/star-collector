import { useCallback, useRef, useState } from 'react';
import Menu from './Menu';
import PhaserGame from './PhaserGame';

function App() {
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(() => {
        const savedScore = Number(window.localStorage.getItem('bestScore'));
        return Number.isFinite(savedScore) ? savedScore : 0;
    });
    const bestScoreRef = useRef(bestScore);

    const handleScoreChange = useCallback((newScore: number) => {
        setScore(newScore);

        if (newScore > bestScoreRef.current) {
            bestScoreRef.current = newScore;
            setBestScore(newScore);
            window.localStorage.setItem('bestScore', String(newScore));
        }
    }, []);

    return (
        <div className="container-fluid p-0 d-flex flex-column vh-100 overflow-hidden">
            <Menu score={score} bestScore={bestScore} />
            <PhaserGame onScoreChange={handleScoreChange} />
        </div>
    );
}

export default App;
