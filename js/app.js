var instructions = new Vue ({
    el: '#game-instructions',
    data: {
        gameStarted: false,
    },

    methods: {
        startGame: function() {
            this.gameStarted = true;
            game.gameOngoing = false;
        }
    }
})

var game = new Vue({
    el: '#game-app',

    data: {
        // Battle Log
        battleLog: [],
        // gameStarted: true,

        gameOngoing: true,

        animationDelay: 300,
        turnDelay: 900,

        // Player Health
        playerHealth: 100,

        // Blood Vials & Ammo
        playerBloodVials: 20,
        playerAmmo: 16,
        ammoUsed: 2,

        // Enemy Properties
        enemyHealth: 100,
        enemyImg: "media/rom.gif",
        romIsAttacking: false,

        // Background Music
        backgroundMusic: [
            {
                name: 'BGM',
                file: new Audio('media/bg-music.mp3'),
                isPlaying: false
            }
        ],

        // Animations
        attackedAnimation: 'attacked-animation',
        specialAttackAnimation: 'special-animation',
        healEffect: 'heal-effect',
        stareAnimation: 'stare-animation',

        // Sound Effects
        attackSFX: 'media/Explosion.wav',
        specialAttackSFX: 'media/SpecialAttack.wav',
        bloodBulletSFX: 'media/BloodBullet.wav',
        emptySFX: 'media/Empty.wav',
        healSFX: 'media/Heal.wav',
        fanfareSFX: 'media/Victory.wav',

        // Attack Options
        options: {

            romAttack: {
                minDamage: 14,
                maxDamage: 18
            },

            romLeech: {
                minDamage: 6,
                maxDamage: 7
            },

            romMeteor: {
                minDamage: 20,
                maxDamage: 25
            },

            regAttack: {
                minDamage: 6,
                maxDamage: 12
            },

            specialAttack: {
                minDamage: 15,
                maxDamage: 20
            },
            cure: 25
        },
        // Ended becomes true after game is done
        ended: false
    },

    methods: {

        // Player's Normal Attack
        attack: function() {
            var playerDamage = this.randomAttackValue(this.options.regAttack.minDamage, this.options.regAttack.maxDamage);

            // Deals Damage, plays SFX / Animation and Updates Battle Log
            this.enemyHealth -= playerDamage;
            this.playSFX('attack');
            this.enemyAnimation('attack');
            this.updateBattleLog({
                type: 'hunter attacks',
                playerDamage: 'Hunter attacks with Saw Cleaver, Deals ' + playerDamage + ' Damage',
            });

            // Enemy's Turn
            this.romIsAttacking = true;
            this.enemyAttack();
            this.gameOver();
        },

        // Enemy's Normal Attack
        enemyAttack: function() {
            var enemyDamage = this.randomAttackValue(this.options.romAttack.minDamage, this.options.romAttack.maxDamage);

            if (this.enemyHealth <= 0) {
                this.romIsAttacking = false;

            } else if (this.enemyHealth < 100) {

                setTimeout(function () { 
                    // Deals Damage, plays SFX / Animation and Updates Battle Log
                    this.playerHealth -= enemyDamage;
                    this.playSFX('attack');
                    this.playerAnimation('attack');
                    this.updateBattleLog({
                        type: 'enemy attacks',
                        enemyDamage: 'Rom attacks, Deals  ' + enemyDamage + ' Damage',
                    });
    
                    // This enables all buttons back
                    this.romIsAttacking = false;
                    this.gameOver();
    
                }.bind(this), this.turnDelay)
            }
        },

        // Enemy's Special Attack
        enemySpecialAttack: function() {
            var enemyDamage = this.randomAttackValue(this.options.romMeteor.minDamage, this.options.romMeteor.maxDamage);

            if(this.enemyHealth <= 0) {
                this.romIsAttacking = false;

            } else if (this.enemyHealth < 100) {

                setTimeout(function() {
                    // Deals Damage, plays SFX / Animation and Updates Battle Log
                    this.playerHealth -= enemyDamage;
                    this.playSFX('special attack');
                    this.playerAnimation('special attack');
                    this.updateBattleLog({
                        type: 'enemy attacks',
                        enemyDamage: 'Rom casts Meteor, Deals ' + enemyDamage + ' Damage',
                    });
                    this.romIsAttacking = false;
                    this.gameOver();     
    
                }.bind(this), this.turnDelay);
            }
        },

        // Player Special Attack
        specialAttack: function() {
            // Player & Enemy Damage Values
            var playerDamage = this.randomAttackValue(this.options.specialAttack.minDamage, this.options.specialAttack.maxDamage);
            this.playerAmmo -= 2;

            if (this.playerAmmo <= 16 && this.playerAmmo >= 0) {
                this.enemyHealth -= playerDamage;
                this.enemyAnimation('special attack');
                this.playSFX('special attack');
                this.updateBattleLog({
                    type: 'hunter attacks',
                    playerDamage: 'Hunter Fires Hunter Pistol, Deals ' + playerDamage + ' Damage',
                });

                // Rom's Turn
                this.romIsAttacking = true;
                this.enemySpecialAttack();
            }

            // Enemy Attacks, but Hunter Wont
            if (this.playerAmmo < 0) {
                playerDamage = 0;
                this.playerAmmo = 0;
                this.playSFX('empty');
                this.updateBattleLog({
                    type: 'hunter attacks',
                    playerDamage: 'Hunter ran out of Ammo!',
                });

                // Rom's Turn
                this.romIsAttacking = true;
                this.enemySpecialAttack();
            }
            // Checks if Game is Over
            this.gameOver();
        },

        // RESTOCK AMMO
        bloodBullet: function() {
            var selfDamage;

            if (this.playerAmmo >= 16) {
                selfDamage = 0;

                // Updates Battle Log
                this.updateBattleLog({
                    type: 'hunter attacks',
                    playerDamage: 'Hunter Cannot Get More Bullets, already at Full Ammo!',
                });

                // Rom's Turn
                this.romIsAttacking = true;
                this.enemyIdle();

            } else if (this.playerAmmo <= 15) {
                selfDamage = 10;
                this.playerHealth -= selfDamage;
                this.playerAmmo += 4;

                // Updates Battle Log
                this.updateBattleLog({
                    type: 'hunter attacks',
                    playerDamage: 'Hunter regained 4 extra Bullets and took 10 Damage',
                });

                // Rom's Turn
                this.romIsAttacking = true;
                this.enemyIdle();
            } 
            // Checks if Game is Over
            this.gameOver();
            this.playSFX('blood bullet');
        },


        // ROM STARE
        enemyIdle: function() {
            setTimeout( function () {
                this.enemyAnimation('stare');
                this.updateBattleLog({
                    type: 'enemy attacks',
                    enemyDamage: 'Rom stares you down, preparing for your next move',
                });
                this.romIsAttacking = false;
                
            }.bind(this), this.turnDelay)
        },
        
        // HEALING
        heal: function() {
            this.playerBloodVials -= 1;

            if (this.playerBloodVials <= 20 && this.playerBloodVials >= 0) {
                
                // Heals, Plays SFX / Animation & Updates Battle Log
                this.playerHealth += this.options.cure;
                this.playSFX('heal');
                this.playerAnimation('heal');
                this.updateBattleLog({
                    type: 'hunter attacks',
                    playerDamage: 'Hunter Used a Blood Vial, ' + this.options.cure + ' Health regained',
                });

                // Rom's Turn
                this.romIsAttacking = true;
                this.enemyLeech();
            }        

            // If Player runs out of Blood Vials
            if (this.playerBloodVials < 0) {

                // Does not Heal, Plays SFX & Updates Battle Log
                playerDamage = 0;
                this.playerBloodVials = 0;
                this.options.cure = 0;
                this.playSFX('empty');
                this.updateBattleLog({
                    type: 'hunter attacks',
                    playerDamage: 'Hunter ran out of Blood Vials!',
                });

                // Rom's Turn
                this.romIsAttacking = true;
                this.enemyLeech();
            } 
                
            if (this.playerHealth >= 100) {
                this.playerHealth = 100;
            } 
            // Checks if Game is Over
            this.gameOver();
        },

        // ROM LEECH
        enemyLeech: function() {
            var enemyDamage = this.randomAttackValue(this.options.romLeech.minDamage, this.options.romLeech.maxDamage);

            setTimeout( function () {
                // Player Takes Damage, Enemy Leeches, Plays SFX / Animation & Updates Battle Log
                this.playerHealth -= enemyDamage;       
                this.enemyHealth += enemyDamage;
                this.playSFX('heal');
                this.enemyAnimation('heal');
                this.updateBattleLog({
                    type: 'enemy attacks',
                    enemyDamage: 'Rom Leeches Health From you, ' + enemyDamage + ' Health regained',
                });

                if (this.enemyHealth >= 100) {
                    this.enemyHealth = 100;
                }

                this.romIsAttacking = false;
                this.gameOver();
                
            }.bind(this), this.turnDelay)
        },

        // UPDATE BATTLE LOG
        updateBattleLog: function({ type, playerDamage, enemyDamage }) {

            // Updates when Enemy attacks
            if (type == 'enemy attacks') {
                const enemyLogInfo = {
                    isAttacking: true,
                    damage: enemyDamage
                }
                this.battleLog.unshift(enemyLogInfo);
                
            // Updates when Player attacks
            } else if (type == 'hunter attacks') {
                const playerLogInfo = {
                    isAttacking: true,
                    damage: playerDamage
                }
                this.battleLog.unshift(playerLogInfo);  
            }
        },

        // Checks if Game is Over
        gameOver: function() {
            // sign was < before not <=
            if (this.enemyHealth <= 0) {
                this.enemyHealth = 0;
                this.enemyDamage = 0;
                this.ended = true;
                this.enemyAnimation('defeated');

                const fanfare = new Audio(this.fanfareSFX);
                fanfare.play();
                fanfare.volume = 0.8;


            } else if (this.playerHealth <= 0) {
                this.playerHealth = 0;
                this.ended = true;
                alert('Rom, the Vacuous Spider won!')
            }
        },

        // Restarts Battle
        restart: function() {
            this.battleLog = [];
            this.enemyHealth = 100;
            this.playerHealth = 100;
            this.playerBloodVials = 20;
            this.playerAmmo = 16;
            this.ended = false;

            // maybe try adding this to the data?
            const romImage = document.getElementById('rom-img');
            romImage.style.opacity = '1';
        },

        randomAttackValue: function(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },

        // Plays CSS Animation when Hit / Healed
        // Instead of play animation, make a new on for both the enemy and player
        enemyAnimation: function(type) {
            const romImage = document.getElementById('rom-img');

            if (type == 'attack') {

                romImage.classList.add('attacked-animation');

                setTimeout(function () {
                    romImage.classList.remove('attacked-animation');
                }.bind(this), this.animationDelay)

            } else if (type == 'special attack') {

                romImage.classList.add(this.specialAttackAnimation);

                setTimeout(function () {
                    romImage.classList.remove(this.specialAttackAnimation);
                }.bind(this), this.animationDelay)

            } else if (type == 'heal') {

                romImage.classList.add(this.healEffect);  

                setTimeout(function () {
                    romImage.classList.remove(this.healEffect);
                }.bind(this), this.animationDelay)

            } else if (type == 'stare') {

                romImage.classList.add(this.stareAnimation);  

                setTimeout(function () {
                    romImage.classList.remove(this.stareAnimation);
                }.bind(this), this.animationDelay)

            } else if (type == 'defeated') {

                romImage.classList.add('defeated-animation');
  
                setTimeout(function () {
                  
                  romImage.classList.remove('defeated-animation');
                  romImage.style.opacity = '0';
                }, 1000)
            }
        },

        playerAnimation: function(type) {
            const healthBar = document.getElementById('player-health-bar');

            if (type == 'attack') {
                healthBar.classList.add(this.attackedAnimation);

                setTimeout(function () {
                    healthBar.classList.remove(this.attackedAnimation);
                }.bind(this), this.animationDelay)

            } else if (type == 'special attack') {

                healthBar.classList.add(this.specialAttackAnimation);

                setTimeout(function () {
                    healthBar.classList.remove(this.specialAttackAnimation);
                }.bind(this), this.animationDelay)

            } else if (type == 'heal') {

                healthBar.classList.add(this.healEffect);  

                setTimeout(function () {
                    healthBar.classList.remove(this.healEffect);
                }.bind(this), this.animationDelay)

            } 
        },

        // Plays & Pauses Background Music
        play: function(audio) {
            audio.isPlaying = true;
            audio.file.play();
            audio.file.volume = 0.4;
        },
        pause: function(audio) {
            audio.isPlaying = false;
            audio.file.pause();
        },

        // Plays Sound Effects
        playSFX: function(type) {

            if (type == 'attack') {
                const attackAudio = new Audio(this.attackSFX);
                attackAudio.play();
                attackAudio.volume = 0.2;

            } else if (type == 'special attack') {
                const specialAttackAudio = new Audio(this.specialAttackSFX);
                specialAttackAudio.play();
                specialAttackAudio.volume = 0.2;

            } else if (type == 'blood bullet') {
                const bloodBulletAudio = new Audio(this.bloodBulletSFX);
                bloodBulletAudio.play();
                bloodBulletAudio.volume = 0.2;

            } else if (type == 'heal') {
                const healAudio = new Audio(this.healSFX);
                healAudio.play();
                healAudio.volume = 0.1;

            } else if (type == 'empty') {
                const emptyAudio = new Audio(this.emptySFX);
                emptyAudio.play();
                emptyAudio.volume = 0.1;
            }
        }
    },

    computed: {
        enemyHealthBar: function() {
            return {
                width: this.enemyHealth + '%'
            }
        },
        playerHealthBar: function() {
            return {
                width: this.playerHealth + '%'
            }
        },

        ammoColorStyle: function() {
            let ammoLeftStyle = '';

            if (this.playerAmmo <= 5) {
                ammoLeftStyle = 'player-info__gun--low-ammo'

            } else if (this.playerAmmo <= 10) {
                ammoLeftStyle = 'player-info__gun--half-ammo'

            } else {
                ammoLeftStyle = 'player-info__gun--full-ammo'
            }
            return ammoLeftStyle
        },

        vialColorStyle: function() {
            let vialsLeftStyle = '';

            if (this.playerBloodVials <= 6) {
                vialsLeftStyle = 'player-info__vial--low-vials'

            } else if (this.playerBloodVials <= 12) {
                vialsLeftStyle = 'player-info__vial--half-vials'

            } else {
                vialsLeftStyle = 'player-info__vial--full-vials'
            }
            return vialsLeftStyle
        },
    }
});