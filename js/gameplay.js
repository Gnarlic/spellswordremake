$(document).ready(function () {

    var enemy;
    var enemies = [
        {
            name: "Goblin",
            health : 10,
            currentHealth : 10,
            attackPower : 1,
            defensePower : 1,
            speed : 3
        },
        {
            name : "Troll",
            health : 30,
            currentHealth: 30,
            attackPower : 4,
            defensePower : 5,
            speed : 0
        },
        {
            name : "Dragon",
            health : 100,
            currentHealth : 100,
            attackPower : 20,
            defensePower : 10,
            speed : 4
        }
    ];
    var weapons = {
        sword : {
            attackModifier : 3,
            defenseModifier : 2,
            speedModifier : 3,
            level :1
        },
        axe : {
            attackModifier : 5,
            defenseModifier : 0,
            speedModifier : 1,
            level : 1
        },
        spear : {
            attackModifier : 2,
            defenseModifier : 1,
            speedModifier : 5,
            level : 1
        }
    };
    var spells = {
        fireball : {
            damage : 5,
            effectDuration : 2,
            manaCost : 4
        },
        frostbeam : {
            damage : 3,
            effectDuration : 1,
            manaCost : 2
        },
        lightningBolt : {
            damage : 6,
            effectDuration : 0,
            manaCost : 3
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
            spellPower : 1
        }
    };


    $("#readyGame").click(function(){
        setUp(enemies);
        console.log(enemy.name);
        enemy.currentHealth = enemy.health;
        playerStats.player.currentHealth = playerStats.player.maxHealth;
        $("#enemyType").text(enemy.name);
        $("#enemyHealth").text(enemy.currentHealth);
        $("#playerName").text(playerStats.player.name);
        $("#banana").text(playerStats.player.currentMana);
        $("#playerHealth").text(playerStats.player.currentHealth);
        $("#enemyAttackPower").text(enemy.attackPower);
    });

    $("#weaponAttack").click(function (){
        if ($("#weaponChoice").val() == "sword") {
        enemy.currentHealth = enemy.currentHealth - 
        (playerStats.player.attackPower +
         weapons.sword.attackModifier);
            $("#enemyHealth").text(enemy.currentHealth);
        } else if ($("#weaponChoice").val() == "axe") {
            enemy.currentHealth = enemy.currentHealth - 
        (playerStats.player.attackPower +
         weapons.axe.attackModifier);
         $("#enemyHealth").text(enemy.currentHealth);
        } else if ($("#weaponChoice").val() == "spear") {
            enemy.currentHealth = enemy.currentHealth - 
        (playerStats.player.attackPower +
         weapons.spear.attackModifier);
         $("#enemyHealth").text(enemy.currentHealth);
        } else {
            alert("Please choose a weapon to attack with first");
        }
        if (enemy.currentHealth <= 0) {
            $("#enemyHealth").text("0");
            alert("You defeated the "+enemy.name);
        }
        $("#statusDiv").addClass("bg-success");
        $("#statusBar").text("Success!");

    });

    $("#spellCast").click(function () {
        if ($("#spellChoice").val() == "fireball") {
            enemy.currentHealth = enemy.currentHealth -
            (playerStats.player.attackPower + spells.fireball.damage);
            $("#enemyHealth").text(enemy.currentHealth);
        } else if ($("#spellChoice").val() == "frostbeam") {
            enemy.currentHealth = enemy.currentHealth -
            (playerStats.player.attackPower + spells.frostbeam.damage);
            $("#enemyHealth").text(enemy.currentHealth);
        } else if ($("#spellChoice").val() == "lightningbolt") {
            enemy.currentHealth = enemy.currentHealth -
            (playerStats.player.attackPower + spells.lightningBolt.damage);
            $("#enemyHealth").text(enemy.currentHealth);
        } else {
            alert("Please choose a spell to attack with first");
        }
        if (enemy.currentHealth <= 0) {
            $("#enemyHealth").text("0");
            alert("You defeated the "+enemy.name);
        }
    });
    
    function setUp () {
        var selectEnemy = Math.floor((Math.random() * 3));
        enemy = enemies[selectEnemy];
    }

});

