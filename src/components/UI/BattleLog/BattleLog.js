import classes from './BattleLog.module.css';

const BattleLog = props => {
   return(
      <div className={classes['battle-log']}>
         <ul className={classes['battle-log-info']}>
            {props.message.map((msg, i) => {
               return <li className={classes['battle-log-text']} key={i}>{msg}</li>
            })}
         </ul>
      </div>
   );
};
export default BattleLog;