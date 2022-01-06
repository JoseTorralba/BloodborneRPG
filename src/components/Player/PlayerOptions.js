/* eslint-disable react-hooks/exhaustive-deps */
import Button from "../UI/Button/Button";
import useRandomNumber from '../../hooks/use-random-number';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { playerActions } from "../../store/player-slice";
import { bossActions } from "../../store/boss-slice";
import { logActions } from '../../store/log-slice'

let bossInit = true;
let playerInit = true;

const PlayerOptions = () => {
   const dispatch = useDispatch();
   const boss = useSelector(state => state.boss);
   const player = useSelector(state => state.player);


   ///////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////
   // Boss Attack Handler

   const bossAttackValue = useRandomNumber(9, 12);
   const bossStrongValue = useRandomNumber(16, 19);
   const bossSpecialValue = useRandomNumber(25, 30);

   const bossAttacked = () => {
      setTimeout(() => {
         dispatch(bossActions.toggleIsAttacking());

         if (boss.health > 40) {
            dispatch(playerActions.damaged(bossAttackValue));
            dispatch(logActions.displayBattleLog(`The Scourge Beast attacked! Dealt ${bossAttackValue} points of damage`));
         } else if (boss.health > 10) {
            dispatch(playerActions.damaged(bossStrongValue));
            dispatch(logActions.displayBattleLog(`The Scourge Beast lunged at you! Dealt ${bossStrongValue} points of damage`));
         } else {
            dispatch(playerActions.damaged(bossSpecialValue));
            dispatch(logActions.displayBattleLog(`The Scourge Beast casted Meteor! Dealt ${bossSpecialValue} points of damage`));
         }
      }, 700);
   }

   ///////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////
   // useEffects

   useEffect(() => {
      if (bossInit) {
         bossInit = false;
         return;
      };

      if (boss.gameOver) {
         dispatch(bossActions.toggleIsAttacking());
         dispatch(logActions.displayBattleLog(`You defeated the Scourge Beast!`));
         return;
      }
      bossAttacked();
   }, [boss.health, player.vials, player.bloodAmmoUsage]);


   useEffect(() => {
      if (playerInit) {
         playerInit = false;
         return;
      };
      if (player.gameOver) dispatch(logActions.displayBattleLog(`You Died!`));

   }, [player.health]);
   

   ///////////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////////
   // Handlers

   const playerAttackValue = useRandomNumber(3, 6);
   const playerPistolDamage = useRandomNumber(9, 15);

   const attackHandler = () => {
      dispatch(bossActions.damaged(playerAttackValue));
      dispatch(logActions.displayBattleLog(`Hunter attacks with saw cleaver! Dealt ${playerAttackValue} points of damage.`));
      dispatch(bossActions.toggleIsAttacking());
   };


   const pistolHandler = () => {
      if (player.ammo <= 0) {
         dispatch(logActions.displayBattleLog(`Out of pistol ammo!`));
         return;
      };

      dispatch(playerActions.pistol());
      dispatch(bossActions.damaged(playerPistolDamage));
      dispatch(logActions.displayBattleLog(`Hunter fires pistol! Dealt ${playerPistolDamage} points of damage.`));
      dispatch(bossActions.toggleIsAttacking());
   };


   const healingHandler = () => {
      if (player.health === 100) {
         dispatch(logActions.displayBattleLog(`Already at full health!`));
         return;
      };

      if (player.vials === 0) {
         dispatch(logActions.displayBattleLog(`Out of blood vials!`));

      } else {
         dispatch(playerActions.healing(25));
         dispatch(bossActions.toggleIsAttacking());
         dispatch(logActions.displayBattleLog(`Hunter used a blood vial! 25 points of health regained!`));
      };
   };


   const ammoHandler = () => {
      if (player.health <= 15) {
         dispatch(logActions.displayBattleLog(`You're at low health, can't use or you'll die...`));
         return;
      };
      
      if (player.ammo >= 12) {
         dispatch(logActions.displayBattleLog(`Already full of ammo!`));
         return;

      } else {
         dispatch(playerActions.bloodAmmo());
         dispatch(logActions.displayBattleLog(`Hunter used blood ammo, gained 4 extra bullets!`));
         dispatch(bossActions.toggleIsAttacking());
      };
   };


   const restartHandler = () => {
      bossInit = true;
      playerInit = true;
      dispatch(playerActions.restart());
      dispatch(bossActions.restart());
      dispatch(logActions.resetBattleLog());
   };

   
   return (
      <>
         {!player.gameOver && !boss.gameOver && (
            <>
               <Button onClick={attackHandler}>Attack</Button>
               <Button onClick={pistolHandler}>Pistol</Button>
               <Button onClick={healingHandler}>Blood Vial</Button>
               <Button onClick={ammoHandler}>Blood Ammo</Button>
            </>
         )}

         {(player.gameOver || boss.gameOver) && (
            <>
               <Button onClick={restartHandler}>Restart</Button>
            </>
         )}
      </>
   );
};
export default PlayerOptions;