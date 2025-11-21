import { useApp } from './context/AppContext';
import WelcomeScreen from './components/WelcomeScreen';
import GameSelector from './components/GameSelector';
import SwipeDeck from './components/SwipeDeck';
import SettingsMenu from './components/SettingsMenu';

function App() {
  const { apiKeys, gameInfo } = useApp();

  return (
    <div className="app-container" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {!apiKeys.nexus ? (
        <WelcomeScreen />
      ) : !gameInfo.game ? (
        <GameSelector />
      ) : (
        <>
          <SettingsMenu />
          <div style={{ paddingTop: '4rem' }}>
            <SwipeDeck />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
