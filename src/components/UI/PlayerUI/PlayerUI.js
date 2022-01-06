import classes from './PlayerUI.module.css';

const PlayerUI = props => {
   return <div className={classes.player}>{props.children}</div>
};
export default PlayerUI;