import { createSlice } from "@reduxjs/toolkit";

const logSlice = createSlice({
   name: 'log',
   initialState: {battleLog: ['A Scourge Beast Appeared!']},
   reducers: {
      displayBattleLog(state, action) {
         state.battleLog.unshift(action.payload)
      },

      resetBattleLog(state) {
         state.battleLog = [];
      }
   }
});

export const logActions = logSlice.actions;
export default logSlice.reducer;
