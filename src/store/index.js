import { configureStore } from "@reduxjs/toolkit";
import bossReducer from './boss-slice';
import playerReducer from './player-slice';
import logReducer from './log-slice';

const store = configureStore({
   reducer: {
      boss: bossReducer,
      player: playerReducer,
      log: logReducer
   }
});
export default store;