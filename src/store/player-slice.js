import { createSlice } from "@reduxjs/toolkit";

const initialPlayerState = { 
   health: 100,
   ammo: 12,
   vials: 20,
   bloodAmmoUsage: false,
   gameOver: false
}

const playerSlice = createSlice({
   name: 'player',
   initialState: initialPlayerState,
   reducers: {

      damaged(state, action) {
         state.health = state.health - action.payload;
         
         if (state.health <= 0) {
            state.health = 0;
            state.gameOver = true;
         }
      },

      pistol(state) {
         state.ammo -= 2;

         if (state.ammo <= 0) {
            state.ammo = 0;
         }
      },


      healing(state, action) {
         // Blood Vials Usage
         if (state.vials <= 20 && state.vials > 0) {
            state.vials -= 1;
            state.health = state.health + action.payload;
         }      

         // No Blood Vials Left
         if (state.vials === 0) {
            state.vials = 0;
            state.health += 0;
         } 

         // Prevents Healing Over 100
         if (state.health >= 100) {
            state.health = 100;
         } 
      },

      bloodAmmo(state) {
         if (state.ammo <= 11) {
            state.health -= 15;
            state.ammo += 4;
            state.bloodAmmoUsage = !state.bloodAmmoUsage;
         }

         if (state.ammo >= 12 ) {
            state.ammo = 12;
         }         
      },

      restart(state) {
         state.health = 100;
         state.ammo = 12;
         state.vials = 20;
         state.gameOver = false;
      }
   }
});
export const playerActions = playerSlice.actions;
export default playerSlice.reducer;