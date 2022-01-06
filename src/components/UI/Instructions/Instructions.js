import classes from './Instructions.module.css';

const Instructions = props => {
   return (
      <>
         <div className={classes['instructions-content']}>
            <h1 className={classes['primary-heading']}>Turn Based Bloodborne</h1>

            <div className={classes['instructions-text']}>
               <h2 className={classes['secondary-heading']}>Attack</h2>
               <p>The Saw Cleaver, a melee weapon. Deals a decent amount of damage.</p>
            </div>

            <div className={classes['instructions-text']}>
               <h2 className={classes['secondary-heading']}>Pistol</h2>
               <p>The Hunter's Pistol, a ranged weapon. Deals a massive amount of damage.</p>
            </div>

            <div className={classes['instructions-text']}>
               <h2 className={classes['secondary-heading']}>Blood Vial</h2>
               <p>Blood Vials heal 25 points of health.</p>
            </div>

            <div className={classes['instructions-text']}>
               <h2 className={classes['secondary-heading']}>Blood Ammo</h2>
               <p>Inflict 15 points damage on self and gain an extra 4 bullets made of blood.</p>
            </div>

            <div className={classes['instructions-btn']}>
               <button className={classes['btn-start']} onClick={props.onStart}>Start Game</button>
            </div>
         </div>
      </>
   );
};
export default Instructions;