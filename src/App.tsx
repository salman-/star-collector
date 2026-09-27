import { useEffect, useState } from 'react';
import PhaserGame from './PhaserGame';

function App() {
    const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement));

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error('Could not change fullscreen mode:', error);
        }
    };

    useEffect(() => {
        const updateFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener('fullscreenchange', updateFullscreen);
        return () => document.removeEventListener('fullscreenchange', updateFullscreen);
    }, []);

    return (
        <main className="game-page">
            <PhaserGame />
            <button className="fullscreen-button" type="button" onClick={toggleFullscreen}>
                {fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            </button>
        </main>
    );
}

export default App;
