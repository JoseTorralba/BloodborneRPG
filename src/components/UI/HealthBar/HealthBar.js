import classes from './HealthBar.module.css';

const HealthBar = props => {
   return (
      <>
         <div className={classes["health-box"]}>
            <div className={classes["health-bar"]}>
               <div className={props.cname} style={{width: props.healthValue <= 0 ? '0%' : props.healthValue + '%' }}></div>
               <p className={classes["health-value"]}>{props.healthValue}</p>
            </div>
         </div>
      </>
   );
};
export default HealthBar;