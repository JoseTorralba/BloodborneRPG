import React from 'react';
import { useSelector } from 'react-redux';
import Player from './components/Player/Player';
import Boss from './components/Boss/Boss';
import PlayerOptions from './components/Player/PlayerOptions';
import BattleLog from './components/UI/BattleLog/BattleLog';
import './App.css';

function App() {
   const battleLogText = useSelector(state => state.log.battleLog);

   return (
      <div className="App">
         <div className='boss-container'>
            <Boss />
         </div>

         <div className='player-options'>
            <PlayerOptions />
         </div>

         <div className='row'>
            <Player />
            <BattleLog message={battleLogText} />
         </div>
      </div>
   );
};
export default App;