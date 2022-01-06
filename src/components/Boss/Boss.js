import { useSelector } from 'react-redux';
import img from './../../img/beast.gif';
import BossUI from '../UI/BossUI/BossUI';
import HealthBar from '../UI/HealthBar';
import classes from './Boss.module.css';

const Boss = () => {
   const health = useSelector(state => state.boss.health);

   return (
      <BossUI>
         <div>
            <img 
               className={classes['boss-img']} 
               style={{opacity: health <= 0 ? '0' : '100%'}} 
               src={img} 
               alt='Scourge Beast Sprite' 
            />
            <p className={classes['boss-name']}>Scourge Beast</p>
         </div>
         <HealthBar cname={classes['boss-health-color']} healthValue={health} />
      </BossUI>
   );
}
export default Boss;