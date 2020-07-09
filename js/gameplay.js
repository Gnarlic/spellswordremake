$(document).ready(function () {

    var isPlaying = false;
    var enemy;
    var enemies = [
        {
            name: "Goblin",
            maxHealth : 10,
            currentHealth : 10,
            attackPower : 1,
            defensePower : 1,
            speed : 3,
            escapeChance : 10,
            experienceGained : 1
        },
        {
            name : "Troll",
            maxHealth : 30,
            currentHealth: 30,
            attackPower : 4,
            defensePower : 5,
            speed : 0,
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
            escapeChance : 50,
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


    $("#readyGame").click(function(){
        if (!isPlaying) {
        clearStatusBar();
        readyGame();
        isPlaying = true;
        } else {
            alert("You are already playing.");
        }
    });

    $("#runAway").click(function (){
        runAway();
    });

    $("#weaponAttack").click(function (){
        if(!isPlaying) {
            alert("Start new game");
            return;
        }
        setAttackPower();
        clearStatusBar();
        playerStats.player.currentMana = playerStats.player.currentMana + playerStats.player.manaRegen;
        if (Math.floor(Math.random()*100)+1 < 51) {
            $("#attackStatusBar").removeClass("bg-success").addClass("bg-danger").text("Attack Failed!");
            enemyAttack();
            regenMana();
            updatePlayerMana();
            return;
        }
        enemy.currentHealth = enemy.currentHealth - (playerStats.player.attackPower + weapons[$("#weaponChoice").val()].attackModifier);
        weaponAttackSuccess(weapons[$("#weaponChoice").val()].name);
        console.log(weapons[$("#weaponChoice").val()].attackModifier)
        if(!enemyHealthCheck()) {
            return;
        } else {
         enemyAttack();
         updatePlayerHealth();
         regenMana();
         updatePlayerMana();
        };
         heroHealthCheck();      
    });

    $("#spellCast").click(function () {
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
        if (Math.floor(Math.random()*100)+1 < 51) {
            $("#attackStatusBar").removeClass("bg-success").addClass("bg-danger").text("Spell Attack Failed!");
            enemyAttack();
            updatePlayerMana();
            updatePlayerHealth();
            heroHealthCheck();
            return;
        };
             spellAttackSuccess(spells[$("#spellChoice").val()].name);
             enemyHealthCheck();
             enemyAttack();
        });
    
    function setUp () {
        var selectEnemy = Math.floor((Math.random() * 3));
        enemy = enemies[selectEnemy];
    };

    function weaponAttackSuccess(weapon) {
        updateEnemyHealth();
        $("#attackStatusBar").removeClass("bg-danger").addClass("bg-success").text(`${weapon} attack Success!`);
    };

    function spellAttackSuccess(spell) {
        enemy.currentHealth = enemy.currentHealth -
        (playerStats.player.attackPower + spells[$("#spellChoice").val()].damage);
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
        enemy.currentHealth = enemy.maxHealth;
        playerStats.player.currentHealth = playerStats.player.maxHealth;
        setAttackPower();
        $("#enemyType").text(enemy.name);
        $("#enemyHealth").text(enemy.currentHealth);
        $("#playerName").text(playerStats.player.name);
        $("#playerMana").text(playerStats.player.maxMana + "/" + playerStats.player.maxMana);
        $("#playerHealth").text(playerStats.player.maxHealth+"/"+playerStats.player.maxHealth);
        $("#enemyAttackPower").text(enemy.attackPower);
        $("#levelIndicator").text("Level: " + playerStats.player.level);
        $("#experienceDisplay").text(playerStats.player.experience + "/"+playerStats.player.experienceToNextLevel);
    
    };

    function setAttackPower() {
        $("#playerPower").text(playerStats.player.attackPower + weapons[$("#weaponChoice").val()].attackModifier);
        $("#spellPower").text(playerStats.player.attackPower + spells[$("#spellChoice").val()].damage);
    };

    function runAway() {
        if (Math.floor(Math.random()*100)+1 < enemy.escapeChance) {
            enemyOpportunityAttack();
            if(!heroHealthCheck()) {
                $("#messages").text(" The " + enemy.name + " killed you with " + enemy.attackPower + " damage in your attempt to run away."); 
                return;
            }
            clearStatusBar();
            $("#messages").addClass("bg-danger");
            $("#messages").text("Failed to run away!");
            damageDisplay();
        } else {
            clearStatusBar();            
            readyGame();
            $("#messages").addClass("bg-success");
            $("#messages").text("You got away!");
        };
    };

    function enemyOpportunityAttack() {
        playerStats.player.currentHealth = playerStats.player.currentHealth - enemy.attackPower;
        heroHealthCheck();
        updatePlayerHealth();
    };

    function enemyAttack() {
        if (Math.floor(Math.random()*100)+1 > 65 ) {
            playerStats.player.currentHealth = 
            playerStats.player.currentHealth - enemy.attackPower;
            heroHealthCheck();
            updatePlayerHealth();
            damageDisplay();
            
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
            return false;
        } else {
            return true;
        }
    };

    function enemyHealthCheck() {
        if (enemy.currentHealth <= 0) {
            $("#enemyHealth").text("0");
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
    };

    function levelUp() {
        playerStats.player.level = playerStats.player.level + 1;
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

    function updatePlayerHealth() {
        $("#playerHealth").text(playerStats.player.currentHealth+"/"+playerStats.player.maxHealth);
    };

    function updatePlayerMana() {
        $("#playerMana").text(playerStats.player.currentMana + "/" + playerStats.player.maxMana);
    };

    updateEnemyHealth() {
        $("#enemyHealth").text(enemy.currentHealth+"/"+enemy.maxHealth);
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

});

