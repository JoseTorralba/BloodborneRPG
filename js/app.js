new Vue({
    el: '#vue-app',

    data: {
        // Battle Log
        battleLog: [],

        // Player Health
        playerHealth: 100,

        // Blood Vials & Ammo
        playerBloodVials: 20,
        playerAmmo: 16,
        ammoUsed: 2,

        // Enemy Properties
        enemyHealth: 100,
        enemyImg: "media/rom.gif",

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

        // Sound Effects
        attackSFX: 'media/Explosion.wav',
        specialAttackSFX: 'media/SpecialAttack.wav',
        bloodBulletSFX: 'media/BloodBullet.wav',
        healSFX: 'media/Heal.wav',

        // Attack Options
        options: {

            romAttack: {
                minDamage: 5,
                maxDamage: 8
            },

            romLeech: {
                minDamage: 5,
                maxDamage: 8
            },

            romMeteor: {
                minDamage: 20,
                maxDamage: 25
            },

            regAttack: {
                minDamage: 3,
                maxDamage: 6
            },

            specialAttack: {
                minDamage: 15,
                maxDamage: 18
            },

            cure: 25
        },
        // Ended becomes true after game is done
        ended: false
    },

    methods: {

        // ATTACK BUTTON
        attack: function() {
            var playerDamage = this.randomAttackValue(this.options.regAttack.minDamage, this.options.regAttack.maxDamage);
            var enemyDamage = this.randomAttackValue(this.options.romAttack.minDamage, this.options.romAttack.maxDamage);

            // Player & Enemy Health Damage Input
            this.enemyHealth -= playerDamage;
            this.playerHealth -= enemyDamage;

            // Plays Animation & SFX when Hit
            this.playAnimation('attack');
            this.playSFX('attack');

            // Updates Battle Log
            this.updateBattleLog({
                type: 'attack',
                playerDamage: playerDamage,
                enemyDamage: enemyDamage
            });
                
            // Checks if Game is Over
            this.gameOver();
        },

        // HUNTER PISTOL
        specialAttack: function() {

            // Player & Enemy Damage Values
            var playerDamage = this.randomAttackValue(this.options.specialAttack.minDamage, this.options.specialAttack.maxDamage);
            var enemyDamage = this.randomAttackValue(this.options.romMeteor.minDamage, this.options.romMeteor.maxDamage);

            // Plays Animation & SFX when Hit
            this.playAnimation('special attack');
            this.playSFX('special attack');
            this.playerAmmo -= 2;

            if (this.playerAmmo <= 16 && this.playerAmmo >= 0) {
                this.enemyHealth -= playerDamage;
                this.playerHealth -= enemyDamage;

                // Updates Battle Log
                this.updateBattleLog({
                    type: 'special attack',
                    playerDamage: playerDamage,
                    enemyDamage: enemyDamage
                });
            } 

            if (this.playerAmmo < 0) {
                playerDamage = 0;
                this.playerHealth -= enemyDamage;
                this.playerAmmo = 0;

                // Updates Battle Log
                this.updateBattleLog({
                    type: 'no ammo',
                    playerDamage: playerDamage,
                    enemyDamage: enemyDamage
                });
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
                    type: 'full ammo',
                    playerDamage: selfDamage,
                    enemyDamage: 0
                });

            } else if (this.playerAmmo <= 15) {
                selfDamage = 10;
                this.playerHealth -= selfDamage;
                this.playerAmmo += 4;

                // Updates Battle Log
                this.updateBattleLog({
                    type: 'more ammo',
                    playerDamage: selfDamage,
                    enemyDamage: 0
                });
            } 

            // Checks if Game is Over
            this.gameOver();
            this.playSFX('blood bullet');
        },

        // HEALING
        heal: function() {
            var enemyDamage = this.randomAttackValue(this.options.romLeech.minDamage, this.options.romLeech.maxDamage);

            // Player heals but rom leeches from player and heals itself
            this.playerHealth += this.options.cure;
            this.playerHealth -= enemyDamage;

            // Rom leeches from player to heal itself
            this.enemyHealth += enemyDamage;


            // If both players are at 100% health, don't pass over 100
            if (this.playerHealth >= 100) {
                this.playerHealth = 100;
            } 
            if (this.enemyHealth >= 100) {
                this.enemyHealth = 100;
            }

            if (this.playerHealth >= 100 || this.playerHealth >= 0) {

                // Use One Blood Vial
                this.playerBloodVials -= 1;

                // If Player runs out of Blood Vials
                if (this.playerBloodVials <= 0) {
                    
                    playerDamage = 0;
                    this.playerBloodVials = 0;
                    this.options.cure = 0;

                    // Updates Battle Log
                    this.updateBattleLog({
                        type: 'no blood vials',
                        playerDamage: this.options.cure,
                        enemyDamage: enemyDamage
                    });

                } else {
                    // Updates Battle Log
                    this.updateBattleLog({
                        type: 'heal',
                        playerDamage: this.options.cure,
                        enemyDamage: enemyDamage
                    });
                }            
            } 
            // Checks if Game is Over
            this.gameOver();
            this.playAnimation('heal')
            this.playSFX('heal');
        },


        // UPDATE BATTLE LOG
        updateBattleLog: function({ type, playerDamage, enemyDamage }) {

            // Update when Attacking
            if (type == 'attack') {

                const enemyLogInfo = {
                    info: 'Rom Attacks, Deals',
                    isAttacking: true,
                    damage: enemyDamage
                }

                const playerLogInfo = {
                    info: 'Hunter Attacks with Saw Cleaver, Deals',
                    isAttacking: true,
                    damage: playerDamage
                }

                this.battleLog.unshift(enemyLogInfo);
                this.battleLog.unshift(playerLogInfo);  
                
            // Update when Special Attacking
            } else if (type == 'special attack') {

                const enemyLogInfo = {
                    info: 'Rom Casts Meteor, Deals',
                    isSpecialAttacking: true,
                    damage: enemyDamage
                }

                const playerLogInfo = {
                    info: 'Hunter Fires Hunter Pistol, Deals',
                    isSpecialAttacking: true,
                    damage: playerDamage
                }

                this.battleLog.unshift(enemyLogInfo);
                this.battleLog.unshift(playerLogInfo);  

            // Update when Healing
            } else if (type == 'heal') {

                const enemyLogInfo = {
                    info: 'Rom Leeches Health From you, ' + playerDamage + ' Health regained',
                    isHealing: true,
                }

                const playerLogInfo = {
                    info: 'Hunter Used a Blood Vial, ' + enemyDamage + ' Health regained',
                    isHealing: true,
                }

                this.battleLog.unshift(enemyLogInfo);
                this.battleLog.unshift(playerLogInfo);  

            } else if (type == 'no blood vials') {

                const enemyLogInfo = {
                    info: 'Rom continued to leech health from you ' + enemyDamage + ' Health regained',
                    isHealing: true,
                    damage: enemyDamage
                }

                const playerLogInfo = {
                    info: 'Hunter ran out of Blood Vials!',
                    isHealing: true,
                    damage: playerDamage
                }

                this.battleLog.unshift(enemyLogInfo);
                this.battleLog.unshift(playerLogInfo);  
            } 
            
            else if (type == 'more ammo') {

                const enemyLogInfo = {
                    info: 'Rom stares you down, preparing for your next move',
                    isRestocking: true,
                }

                const playerLogInfo = {
                    info: 'Hunter regained 4 extra Bullets and took 10 Damage',
                    isRestocking: true,
                }

                this.battleLog.unshift(enemyLogInfo);
                this.battleLog.unshift(playerLogInfo);  

            } else if (type == 'full ammo') {

                const enemyLogInfo = {
                    info: 'Rom stares you down, preparing for your next move',
                    isRestocking: true,
                }

                const playerLogInfo = {
                    info: 'Hunter Cannot Get More Bullets, already at Full Ammo',
                    isRestocking: true,
                }

                this.battleLog.unshift(enemyLogInfo);
                this.battleLog.unshift(playerLogInfo);
                  
            } else if (type == 'no ammo') {

                const enemyLogInfo = {
                    info: 'Rom casts Meteor',
                    isRestocking: true,
                }

                const playerLogInfo = {
                    info: 'Hunter ran out of Ammo!',
                    isRestocking: true,
                }
                this.battleLog.unshift(enemyLogInfo);
                this.battleLog.unshift(playerLogInfo);
            }
        },

        // Checks if Game is Over
        gameOver: function() {
            if (this.enemyHealth <= 0) {
                this.enemyHealth = 0;
                this.ended = true;
                alert('The Player won!')

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
        },

        randomAttackValue: function(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },

        // Plays CSS Animation when Hit / Healed
        playAnimation: function(type) {
            const romImage = document.getElementById('rom-img');

            if (type == 'attack') {
                romImage.classList.remove(this.attackedAnimation);
                void romImage.offsetWidth;
                romImage.classList.add(this.attackedAnimation);

                // Removes Other Animations if They Were Used
                if (romImage.classList.contains(this.healEffect)) {
                    romImage.classList.remove(this.healEffect)

                } else if (romImage.classList.contains(this.specialAttackAnimation)) {
                    romImage.classList.remove(this.specialAttackAnimation)
                } 

            } else if (type == 'special attack') {
                romImage.classList.remove(this.specialAttackAnimation);
                void romImage.offsetWidth;
                romImage.classList.add(this.specialAttackAnimation);

                // Removes Other Animations if They Were Used
                if (romImage.classList.contains(this.healEffect)) {
                    romImage.classList.remove(this.healEffect)

                } else if (romImage.classList.contains(this.attackedAnimation)) {
                    romImage.classList.remove(this.attackedAnimation)
                } 

            } else if (type == 'heal') {
                romImage.classList.remove(this.healEffect);
                void romImage.offsetWidth;
                romImage.classList.add(this.healEffect);
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