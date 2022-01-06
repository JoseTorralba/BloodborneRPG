import { createSlice } from "@reduxjs/toolkit";

const initialBossState = { 
   health: 100,
   isAttacking: false,
   bossGameOver: false
}

const bossSlice = createSlice({
   name: 'boss',
   initialState: initialBossState,
   reducers: {
      damaged(state, action) {
         state.health = state.health - action.payload;

         if (state.health <= 0) {
            state.health = 0;
            state.bossGameOver = true;
         }
      },

      toggleIsAttacking(state) {
         state.isAttacking = !state.isAttacking;
      },

      restart(state) {
         state.health = 100;
         state.bossGameOver = false;
      }
   }
});
export const bossActions = bossSlice.actions;
export default bossSlice.reducer;