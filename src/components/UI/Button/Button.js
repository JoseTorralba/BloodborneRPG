import classes from './Button.module.css';
import { useSelector } from 'react-redux';

const Button = props => {
   let bossIsAttacking = useSelector(state => state.boss.isAttacking);

   return(
      <button 
         className={classes.btn} 
         onClick={props.onClick}
         disabled={bossIsAttacking}>
         {props.children}
      </button>
   );
};
export default Button;