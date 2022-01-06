import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import Instructions from './components/UI/Instructions/Instructions';
import Player from './components/Player/Player';
import Boss from './components/Boss/Boss';
import PlayerOptions from './components/Player/PlayerOptions';
import BattleLog from './components/UI/BattleLog/BattleLog';
import './App.css';

function App() {
   const [gameStarted, setGameStarted] = useState(false)
   const battleLogText = useSelector(state => state.log.battleLog);
   const bossGameOver = useSelector(state => state.boss.gameOver);
   const playerGameOver = useSelector(state => state.player.gameOver);

   const startGameHandler = () => setGameStarted(true);
   return (
      <div className="App">
         {gameStarted ? 
            <>
               <div className='boss-container'>
                  <Boss />
               </div>
   
               <div className={(bossGameOver || playerGameOver) ? 'restart' : 'player-options'}>
                  <PlayerOptions />
               </div>
   
               <div className='row'>
                  <Player />
                  <BattleLog message={battleLogText} />
               </div>
            </>
            :
            <Instructions onStart={startGameHandler} />
         }
      </div>
   );
};
export default App;