$(document).ready(function () {
    
    var isPlaying = false;
    var breakLoop = 0;
    var enemy;
    var enemies = [
        {
            name: "Goblin",
            maxHealth : 10,
            currentHealth : 10,
            attackPower : 1,
            defensePower : 1,
            speed : 5,
            escapeChance : 10,
            experienceGained : 1
        },
        {
            name : "Troll",
            maxHealth : 30,
            currentHealth: 30,
            attackPower : 4,
            defensePower : 5,
            speed : 1,
            escapeChance : 40,
            experienceGained : 5
        },
        {
            name : "Dragon",
            maxHealth : 100,
            currentHealth : 100,
            attackPower : 20,
            defensePower : 10,
            speed : 4,
            escapeChance : 65,
            experienceGained : 25

        }
    ];
    var weapons = {
        sword : {
            name : "Sword",
            attackModifier : 3,
            defenseModifier : 2,
            speedModifier : 3,
            level :1
        },
        axe : {
            name : "Axe",
            attackModifier : 5,
            defenseModifier : 0,
            speedModifier : 1,
            level : 1
        },
        spear : {
            name : "Spear",
            attackModifier : 2,
            defenseModifier : 1,
            speedModifier : 5,
            level : 1
        }
    };
    var spells = {
        fireball : {
            name : "Fireball",
            damage : 5,
            effectDuration : 2,
            manaCost : 5
        },
        frostbeam : {
            name : "Frostbeam",
            damage : 3,
            effectDuration : 1,
            manaCost : 3
        },
        lightningBolt : {
            name : "Lighting Bolt",
            damage : 6,
            effectDuration : 0,
            manaCost : 4
        }
    };
    var playerStats = {
        player : {
            name : "Battleguy",
            maxHealth : 15,
            currentHealth : 15,
            attackPower : 1,
            defensePower : 1,
            maxMana : 10,
            currentMana : 10,
            manaRegen : 2,
            speed : 5,
            initiativeModifier : 0,
            spellPower : 1,
            experience : 0,
            experienceToNextLevel : 2,
            level : 1,
            skillPointsToSpend : 0
        }
    };
    experienceBarAdvance();
    playerHealthBar();
    playerManaBar();

    $("#readyGame").click(function(){
        if (!isPlaying) {
        clearStatusBar();
        readyGame();
        experienceBarAdvance();
        combatTimer();
        enemyAttackTimer();
        } else {
            alert("You are already playing.");
        }
    });

    $("#runAway").click(function (){
        runAway();
    });

    $("#progressButton").click(function (){
        levelUp();
        readyGame();
    })

    $("#weaponAttack").click(function (){
        if(!isPlaying) {
            alert("Start new game");
            return;
        }

        clearStatusBar();
        setAttackPower();
        regenMana();
        combatTimer();
        if (Math.floor(Math.random()*100)+1 < 51) {
            $("#attackStatusBar").removeClass("bg-success").addClass("bg-danger").text("Attack Failed!");
            return;
        }
        
        weaponAttackSuccess(weapons[$("#weaponChoice").val()].name);
        if(!enemyHealthCheck()) {
            return;
        } else {
         updatePlayerHealth();
         updatePlayerMana();
        };
         heroHealthCheck();      
    });

    $("#spellCast").click(function () {
        setAttackPower();
        if(!isPlaying) {
            alert("Start new game");
            return;
        };
        if (spells[$("#spellChoice").val()].manaCost > playerStats.player.currentMana) {
            clearStatusBar();
            updatePlayerMana();
            $("#messages").addClass("bg-warning").text("Not enough mana! Use your weapon!");

            return;
        };
        combatTimer();
        if (Math.floor(Math.random()*100)+1 < 51) {
            $("#attackStatusBar").removeClass("bg-success").addClass("bg-danger").text("Spell Attack Failed!");
            updatePlayerMana();
            updatePlayerHealth();
            heroHealthCheck();
            return;
        };
             spellAttackSuccess(spells[$("#spellChoice").val()].name);
             enemyHealthCheck();
        });
    
    function setUp () {
        var selectEnemy = Math.floor((Math.random() * 3));
        enemy = enemies[selectEnemy];
        enemy.currentHealth = enemy.maxHealth;
    };

    function weaponAttackSuccess(weapon) {
        enemy.currentHealth = enemy.currentHealth - 
        (playerStats.player.attackPower + 
            weapons[$("#weaponChoice").val()].attackModifier);
        updateEnemyHealth();
        $("#attackStatusBar").removeClass("bg-danger").addClass("bg-success").text(`${weapon} attack Success!`);
    };

    function spellAttackSuccess(spell) {
        enemy.currentHealth = enemy.currentHealth -
        (playerStats.player.attackPower + 
            spells[$("#spellChoice").val()].damage);
        manaDrain();
        updatePlayerMana();
        updateEnemyHealth();
        clearStatusBar();
        $("#attackStatusBar").addClass("bg-success").text(`${spell} attack Success!`)
    };

    function manaDrain() {
        playerStats.player.currentMana = playerStats.player.currentMana + playerStats.player.manaRegen
             - spells[$("#spellChoice").val()].manaCost;
    }

    function readyGame() {
        setUp(enemies);
        resetPlayer();
        updateEnemyHealth();
        setAttackPower();
        experienceBarAdvance();
        $("#enemyType").text(enemy.name);
        $("#playerName").text(playerStats.player.name);
        $("#enemyAttackPower").text(enemy.attackPower);
        $("#levelIndicator").text("Level: " + playerStats.player.level);
        isPlaying = true;
        breakLoop = 0;
    };

    function setAttackPower() {
        $("#playerPower").text(playerStats.player.attackPower + weapons[$("#weaponChoice").val()].attackModifier);
        $("#spellPower").text(playerStats.player.attackPower + spells[$("#spellChoice").val()].damage);
    };

    function runAway() {
        if (playerStats.player.currentHealth <= 0 || isPlaying==false) {
            alert("Start new game");
            return;
        }
        clearStatusBar();
        if (Math.floor(Math.random()*100)+1 < enemy.escapeChance) {
            
            
            enemyAttack();
            $("#messages").addClass("bg-danger");
            $("#messages").text("Failed to run away!");
        } else {
                   
            breakLoop = 1; 
            isPlaying = false;
            $("#messages").addClass("bg-success");
            $("#messages").text("You got away!");
        };
    };

    function enemyAttack() {
        console.log("testy testes");
        if (Math.floor(Math.random()*100)+1 > 55 ) {
            playerStats.player.currentHealth = 
            playerStats.player.currentHealth - enemy.attackPower;
            console.log(playerStats.player.currentHealth + "testing");
            heroHealthCheck();
            updatePlayerHealth();
            damageDisplay();
            
        } else {
            clearStatusBar();
            $("#damageStatusBar").text("Enemy attack failed!");
        };
    };

    function damageDisplay() {
        $("#damageStatusBar").text(" You took " + enemy.attackPower + " points of damage");
    }

    function clearStatusBar() {
        $("#experienceStatus").empty();
        $("#messages").removeClass().empty();
        $("#attackStatusBar").removeClass().empty();+
        $("#damageStatusBar").empty();
    };

    function heroHealthCheck() {
        if (playerStats.player.currentHealth <= 0) {
            clearStatusBar();
            playerStats.player.currentHealth=0;
            updatePlayerHealth();
            $("#messages").addClass("bg-danger");
            $("#messages").text(" You have died from the " + enemy.name + "'s attack. Press Start to play again!");
            isPlaying = false;
            breakLoop = 1;
            return false;
        } else {
            return true;
        }
    };

    function enemyHealthCheck() {
        if (enemy.currentHealth <= 0) {
            enemy.currentHealth=0;
            enemyHealthBar();
            $("#messages").addClass("bg-success");
            $("#messages").text("You defeated the "+enemy.name +". Press Start to play again!");
            addExperience();
            isPlaying = false;
            return false;
        } else {
            return true;
        };
    };

    function addExperience() {
        playerStats.player.experience = playerStats.player.experience + enemy.experienceGained;
        $("#experienceStatus").text("You have gained " + enemy.experienceGained + " experience points.");
        
        if (playerStats.player.experience >= playerStats.player.experienceToNextLevel) {
            levelUp();
        };
        experienceBarAdvance();
    };

    function levelUp() {
        playerStats.player.level = playerStats.player.level + 1;
        if (playerStats.player.level % 10 == 0) {
            playerStats.player.speed = playerStats.player.speed + 1;
        }
        playerStats.player.maxHealth = playerStats.player.maxHealth + 15;
        playerStats.player.maxMana = playerStats.player.maxMana + 5;
        playerStats.player.attackPower = Math.ceil(playerStats.player.attackPower *1.3);
        playerStats.player.experience = playerStats.player.experience - playerStats.player.experienceToNextLevel;
        playerStats.player.experienceToNextLevel = Math.ceil(playerStats.player.experienceToNextLevel * 1.3);
        $("#experienceStatus").append(" You have leveled up!");
        if (playerStats.player.experience >= playerStats.player.experienceToNextLevel) {
            levelUp();
        };
    };

    function resetPlayer() {
        playerStats.player.currentHealth = playerStats.player.maxHealth;
        playerStats.player.currentMana = playerStats.player.maxMana;
        updatePlayerHealth();
        updatePlayerMana();
    }

    function updatePlayerHealth() {
        playerHealthBar();
    };

    function updatePlayerMana() {
        playerManaBar();
    };

    function updateEnemyHealth() {
        enemyHealthBar();
    }

    function regenMana() {
        if (playerStats.player.currentMana <= playerStats.player.maxMana-playerStats.player.manaRegen) {
            playerStats.player.currentMana = 
            playerStats.player.currentMana + 
            playerStats.player.manaRegen;
        } else {
            playerStats.player.currentMana = playerStats.player.maxMana;
        };
    };


    function experienceBarAdvance() {
            var elem = document.getElementById("myBar");
            var width = (playerStats.player.experience/playerStats.player.experienceToNextLevel)*100;
            frame();
            function frame() {

                    console.log("test");
                    elem.style.width = width + "%";
                    elem.innerHTML = playerStats.player.experience + "/" + playerStats.player.experienceToNextLevel;
                
            }
        }

        function playerHealthBar() {
            var elem = document.getElementById("playerHealthBar");
            var width = (playerStats.player.currentHealth/playerStats.player.maxHealth)*100;
            elem.style.width = width+"%";
            elem.innerHTML = playerStats.player.currentHealth + "/" + playerStats.player.maxHealth;
        }

        function enemyHealthBar() {
            console.log(enemy.currentHealth);
            var width = (enemy.currentHealth/enemy.maxHealth)*100;
            $("#enemyHealthBar").css("width", width+"%");
            $("#enemyHealthBar").text(enemy.currentHealth + "/" + enemy.maxHealth);
        }

        function playerManaBar() {
            var width = (playerStats.player.currentMana/playerStats.player.maxMana)*100;
            $("#playerManaBar").css("width", width+"%");
            $("#playerManaBar").text(playerStats.player.currentMana + "/" + playerStats.player.maxMana);
        }           
            

        });

        function combatTimer(){
            var widthb = 0;
            var speeda =((playerStats.player.speed + weapons[$("#weaponChoice").val()].speedModifier)/100);
            console.log(speeda);
            var id = setInterval(frame, speeda);
            function frame () {
                if (breakLoop == 1) {
                    clearInterval(id);
                };
                if (widthb >= 100) {
                    widthb = 100;
                    $("#timerTestBar").text("Attack!");
                    $("#weaponAttack").prop('disabled', false);
                    $("#spellCast").prop('disabled', false);
                    clearInterval(id);
                } else {
                    if (!enemyHealthCheck) {
                        breakLoop = 1;
                        clearInterval(id);
                    }
                    $("#weaponAttack").prop('disabled', true);
                    $("#spellCast").prop('disabled', true);
                    widthb+=speeda;
                    $("#timerTestBar").css("width", widthb+"%");
                    $("#timerTestBar").text("Attack in " + (100- widthb).toFixed(0));
                    regenMana();
                }
            }

            
            

        }

        function enemyAttackTimer() {
            if (enemy.currentHealth <= 0) {
                return;
            }
            var widthE = 0;
            var speedE =(enemy.speed/100);
            console.log(speedE);
            var idE = setInterval(enemyFrame, speedE);
            function enemyFrame() {
                if (breakLoop == 1) {
                    console.log("broke loop");
                    clearInterval(idE);
                    return;
                }
                if (!heroHealthCheck()) {
                    $("#timerTestBar").text("Dead");
                    widthE=0;
                    clearInterval(idE);
                    return;
                }
                if (widthE >= 100) {
                    widthE = 100;
                    $("#enemyTimerBar").text("Attack Incoming");
                    enemyAttack();
                    widthE = 0;
                } else {
                    if( enemy.currentHealth <= 0) {
                        clearInterval(idE);
                        $("#enemyTimerBar").text("Dead");
                        return;
                    }
                    widthE+=speedE;
                    $("#enemyTimerBar").css("width", widthE+"%");
                    $("#enemyTimerBar").text("Attacking in " + (100-widthE).toFixed(0));
                }
            }
        }

        $("#testButton").click(function (){
            playerStats.player.experience += 5;
        })
});

