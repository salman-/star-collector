import Menu from './Menu';
import PhaserGame from './PhaserGame';

function App() {
    return (
        <div className="container-fluid p-0 d-flex flex-column vh-100 overflow-hidden">
            <Menu />
            <PhaserGame />
        </div>
    );
}

export default App;
