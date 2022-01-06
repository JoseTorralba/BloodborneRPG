import classes from './BossUI.module.css';

const BossUI = props => {
   return <div className={classes.boss}>{props.children}</div>
};
export default BossUI;