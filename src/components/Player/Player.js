import { useSelector } from 'react-redux';
import PlayerUI from '../UI/PlayerUI/PlayerUI';
import HealthBar from '../UI/HealthBar';
import classes from './Player.module.css';

const Player = () => {
   const health = useSelector(state => state.player.health);
   const bloodVials = useSelector(state => state.player.vials);
   const ammo = useSelector(state => state.player.ammo);

   let bloodVialColor;
   if (bloodVials <= 6) {
      bloodVialColor = 'player-vials-low';
   } else if (bloodVials <= 14) {
      bloodVialColor = 'player-vials-half';
   } else {
      bloodVialColor = 'player-vials-full';
   }

   let ammoColor;
   if (ammo <= 4) {
      ammoColor = 'player-ammo-low';
   } else if (ammo <= 8) {
      ammoColor = 'player-ammo-half';
   } else {
      ammoColor = 'player-ammo-full';
   }

   return (
      <PlayerUI>
         <h2 className={classes['player-name']}>Hunter</h2>

         <HealthBar cname={classes['player-health-color']} healthValue={health} />

         <h2 className={classes['player-vials']}>
            <span>Blood Vials: </span>
            <span className={classes[bloodVialColor]}>{bloodVials}</span>
            <span> / 20</span>
         </h2>

         <h2 className={classes['player-ammo']}>
            <span>Pistol Ammo: </span>
            <span className={classes[ammoColor]}>{ammo}</span>
            <span> / 12</span>
         </h2>
      </PlayerUI>
   );
}
export default Player;