var invadersGameplay = function(game) {}

invadersGameplay.prototype = {
    player: null,
    aliens: null,
    bullets: null,
    bulletTime: 0,
    cursors: null,
    fireButton: null,
    explosions: null,
    starfield: null,
    score: 0,
    scoreString: '',
    scoreText: null,
    lives: null,
    enemyBullet: null,
    firingTimer: 0,
    stateText: null,
    livingEnemies: [],
    highScores: [
            ["Clementine B. Heidenreich", 100],
            ["Bridget E. Craft", 200],
            ["Melvin N. Fernandez", 300],
            ["Steven E. Peter", 400],
            ["Leona P. Williams", 500],
            ["Clementine B. Heidenreich", 600],
            ["Bridget E. Craft", 700],
            ["Melvin N. Fernandez", 800],
            ["Steven E. Peter", 900],
            ["Leona P. Williams", 1000]
            ],
    
    create: function(game){
        invadersGameplay.prototype.game = game;
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //  The scrolling starfield background
        invadersGameplay.prototype.starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    
        //  Our bullet group
        invadersGameplay.prototype.bullets = game.add.group();
        invadersGameplay.prototype.bullets.enableBody = true;
        invadersGameplay.prototype.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        invadersGameplay.prototype.bullets.createMultiple(30, 'bullet');
        invadersGameplay.prototype.bullets.setAll('anchor.x', 0.5);
        invadersGameplay.prototype.bullets.setAll('anchor.y', 1);
        invadersGameplay.prototype.bullets.setAll('outOfBoundsKill', true);
        invadersGameplay.prototype.bullets.setAll('checkWorldBounds', true);
    
        // The enemy's bullets
        invadersGameplay.prototype.enemyBullets = game.add.group();
        invadersGameplay.prototype.enemyBullets.enableBody = true;
        invadersGameplay.prototype.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        invadersGameplay.prototype.enemyBullets.createMultiple(30, 'enemyBullet');
        invadersGameplay.prototype.enemyBullets.setAll('anchor.x', 0.5);
        invadersGameplay.prototype.enemyBullets.setAll('anchor.y', 1);
        invadersGameplay.prototype.enemyBullets.setAll('outOfBoundsKill', true);
        invadersGameplay.prototype.enemyBullets.setAll('checkWorldBounds', true);
    
        //  The hero!
        invadersGameplay.prototype.player = game.add.sprite(400, 500, 'ship');
        invadersGameplay.prototype.player.anchor.setTo(0.5, 0.5);
        game.physics.enable(invadersGameplay.prototype.player, Phaser.Physics.ARCADE);
    
        //  The baddies!
        invadersGameplay.prototype.aliens = game.add.group();
        invadersGameplay.prototype.aliens.enableBody = true;
        invadersGameplay.prototype.aliens.physicsBodyType = Phaser.Physics.ARCADE;
    
        invadersGameplay.prototype.createAliens();
    
        //  The score
        invadersGameplay.prototype.scoreString = 'Score : ';
        invadersGameplay.prototype.score = 0;
        invadersGameplay.prototype.scoreText = game.add.text(10, 10, invadersGameplay.prototype.scoreString + invadersGameplay.prototype.score, { font: '30px Arial', fill: '#fff' });
    
        //  Lives
        invadersGameplay.prototype.lives = game.add.group();
        game.add.text(game.world.width - 110, 10, 'Lives : ', { font: '30px Arial', fill: '#fff' });
    
        //  Text
        invadersGameplay.prototype.stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
        invadersGameplay.prototype.stateText.anchor.setTo(0.5, 0.5);
        invadersGameplay.prototype.stateText.visible = false;
    
        for (var i = 0; i < 3; i++) 
        {
            var ship = invadersGameplay.prototype.lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
            ship.anchor.setTo(0.5, 0.5);
            ship.angle = 90;
            ship.alpha = 0.4;
        }
    
        //  An explosion pool
        invadersGameplay.prototype.explosions = game.add.group();
        invadersGameplay.prototype.explosions.createMultiple(30, 'kaboom');
        invadersGameplay.prototype.explosions.forEach(invadersGameplay.prototype.setupInvader, this);
    
        //  And some controls to play the game with
        invadersGameplay.prototype.cursors = game.input.keyboard.createCursorKeys();
        invadersGameplay.prototype.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        if(mediator) {
            mediator.subscribe("REPLAY_GAME", this.onReplayGame);
        }
    },
    
    createAliens: function() {
        for (var y = 0; y < 4; y++)
        {
            for (var x = 0; x < 10; x++)
            {
                var alien = invadersGameplay.prototype.aliens.create(x * 48, y * 50, 'invader');
                alien.anchor.setTo(0.5, 0.5);
                alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
                alien.play('fly');
                alien.body.moves = false;
            }
        }
    
        invadersGameplay.prototype.aliens.x = 100;
        invadersGameplay.prototype.aliens.y = 50;
    
        //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        var tween = invadersGameplay.prototype.game.add.tween(invadersGameplay.prototype.aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    
        //  When the tween loops it calls descend
        tween.onLoop.add(invadersGameplay.prototype.descend, this);
    },
    
    setupInvader: function(invader) {
        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');
    },
    
    descend: function() {
        invadersGameplay.prototype.aliens.y += 10;
    },
    
    update: function() {
        //  Scroll the background
        invadersGameplay.prototype.starfield.tilePosition.y += 2;
    
        if (invadersGameplay.prototype.player.alive)
        {
            //  Reset the player, then check for movement keys
            invadersGameplay.prototype.player.body.velocity.setTo(0, 0);
    
            // Left and right arrow key movement
            // if (invadersGameplay.prototype.cursors.left.isDown)
            // {
            //     invadersGameplay.prototype.player.body.velocity.x = -200;
            // }
            // else if (invadersGameplay.prototype.cursors.right.isDown)
            // {
            //     invadersGameplay.prototype.player.body.velocity.x = 200;
            // }
            
            // Update mouse for movement
            invadersGameplay.prototype.player.x = invadersGameplay.prototype.game.input.mousePointer.x;
    
            //  Firing?
            invadersGameplay.prototype.game.input.onDown.add(invadersGameplay.prototype.fireBullet, this);

            if (invadersGameplay.prototype.game.time.now > invadersGameplay.prototype.firingTimer)
            {
                invadersGameplay.prototype.enemyFires();
            }
    
            //  Run collision
            invadersGameplay.prototype.game.physics.arcade.overlap(invadersGameplay.prototype.bullets, invadersGameplay.prototype.aliens, invadersGameplay.prototype.collisionHandler, null, this);
            invadersGameplay.prototype.game.physics.arcade.overlap(invadersGameplay.prototype.enemyBullets, invadersGameplay.prototype.player, invadersGameplay.prototype.enemyHitsPlayer, null, this);
        }
    },
    
    render: function() {
        // for (var i = 0; i < aliens.length; i++)
        // {
        //     game.debug.body(aliens.children[i]);
        // }
    },
    
    collisionHandler: function(bullet, alien) {
        //  When a bullet hits an alien we kill them both
        bullet.kill();
        alien.kill();
    
        //  Increase the score
        invadersGameplay.prototype.score += 20;
        invadersGameplay.prototype.scoreText.text = invadersGameplay.prototype.scoreString + invadersGameplay.prototype.score;
    
        //  And create an explosion :)
        var explosion = invadersGameplay.prototype.explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);
    
        if (invadersGameplay.prototype.aliens.countLiving() == 0)
        {
            invadersGameplay.prototype.score += 1000;
            invadersGameplay.prototype.scoreText.text = invadersGameplay.prototype.scoreString + invadersGameplay.prototype.score;
    
            invadersGameplay.prototype.enemyBullets.callAll('kill',this);
            invadersGameplay.prototype.stateText.text = " You Won, \n Click to restart";
            invadersGameplay.prototype.stateText.visible = true;
    
            //the "click to restart" handler
            invadersGameplay.prototype.game.input.onTap.addOnce(invadersGameplay.prototype.restart,this);
        }
    },
    
    enemyHitsPlayer: function(player, bullet) {
        bullet.kill();

        invadersGameplay.prototype.live = invadersGameplay.prototype.lives.getFirstAlive();
    
        if (invadersGameplay.prototype.live)
        {
            invadersGameplay.prototype.live.kill();
        }
    
        //  And create an explosion :)
        var explosion = invadersGameplay.prototype.explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);
    
        // When the player dies
        if (invadersGameplay.prototype.lives.countLiving() < 1)
        {
            player.kill();
            invadersGameplay.prototype.enemyBullets.callAll('kill');
    
            //invadersGameplay.prototype.stateText.text=" GAME OVER \n Click to restart";
            //invadersGameplay.prototype.stateText.visible = true;
    
            //the "click to restart" handler
            //invadersGameplay.prototype.game.input.onTap.addOnce(invadersGameplay.prototype.restart,this);
            
            invadersGameplay.prototype.gameOver(invadersGameplay.prototype.game);
        }
    },
    
    gameOver: function(game) {
        setTimeout(function() {
            if(invadersGameplay.prototype.isHighScore(invadersGameplay.prototype.score)) {
                invadersGameplay.prototype.showNameInput();
                invadersGameplay.prototype.addHighScore(invadersGameplay.prototype.name, invadersGameplay.prototype.score);
                
                mediator.publish("SHOW_HIGH_SCORES", invadersGameplay.prototype.highScores);
                
            } else {
                invadersGameplay.prototype.endText = game.add.text(game.world.centerX, 400, 'Click to continue', { font: "40px Arial", fill: "#ffffff", align: "center" });
                game.input.onDown.add(invadersGameplay.prototype.gameOverClicked, this);
            }
        }, 2000);
    },
    
    onReplayGame: function () {
        if(mediator) {
            mediator.remove("REPLAY_GAME", this.onReplayGame);
        }
        invadersGameplay.prototype.game.state.start("gameover");
    },
    
    isHighScore: function (score) {
        return true; // needs to be changed eventually
    },
    
    showNameInput: function() {
        // Get user's name from input field
        var person = prompt("Please enter your name", "Harry Potter");
        person = person != null ? person : "Guest";
        invadersGameplay.prototype.name = person;
    },
    
    addHighScore: function(name, score) {
        var highScores = invadersGameplay.prototype.highScores;
        var maxTotalScores = 10;
        
        
        // Sorts scores from highest to lowest
        highScores.sort(function(a, b) {
            return b[1] - a[1];
        });
        
        for(var i = 0; i < highScores.length; i++) {
            var person = highScores[i];
            // Once you reach a score that's higher insert the new score beneath it, unless there's a tie - then the old one stays
            if(person[1] < score || (i == highScores.length && person[1] != score)) {
                highScores.splice(i, highScores.length >= maxTotalScores ? 1 : 0, [name, score]);
                break;
            }
        }
        
    },
    
    enemyFires: function() {
        //  Grab the first bullet we can from the pool
        invadersGameplay.prototype.enemyBullet = invadersGameplay.prototype.enemyBullets.getFirstExists(false);
    
        invadersGameplay.prototype.livingEnemies.length=0;
    
        invadersGameplay.prototype.aliens.forEachAlive(function(alien){
    
            // put every living enemy in an array
            invadersGameplay.prototype.livingEnemies.push(alien);
        });
    
    
        if (invadersGameplay.prototype.enemyBullet && invadersGameplay.prototype.livingEnemies.length > 0)
        {
            
            var random = invadersGameplay.prototype.game.rnd.integerInRange(0,invadersGameplay.prototype.livingEnemies.length-1);
    
            // randomly select one of them
            var shooter=invadersGameplay.prototype.livingEnemies[random];
            // And fire the bullet from this enemy
            invadersGameplay.prototype.enemyBullet.reset(shooter.body.x, shooter.body.y);
    
            invadersGameplay.prototype.game.physics.arcade.moveToObject(invadersGameplay.prototype.enemyBullet,invadersGameplay.prototype.player,120);
            invadersGameplay.prototype.firingTimer = invadersGameplay.prototype.game.time.now + 2000;
        }

    },
    
    fireBullet: function() {
         //  To avoid them being allowed to fire too fast we set a time limit
        if (invadersGameplay.prototype.game.time.now > invadersGameplay.prototype.bulletTime && invadersGameplay.prototype.lives.countLiving() > 0)
        {
            //  Grab the first bullet we can from the pool
            invadersGameplay.prototype.bullet = invadersGameplay.prototype.bullets.getFirstExists(false);
    
            if (invadersGameplay.prototype.bullet)
            {
                //  And fire it
                invadersGameplay.prototype.bullet.reset(invadersGameplay.prototype.player.x, invadersGameplay.prototype.player.y + 8);
                invadersGameplay.prototype.bullet.body.velocity.y = -400;
                invadersGameplay.prototype.bulletTime = invadersGameplay.prototype.game.time.now + 200;
            }
        }
    },
    
    resetBullet: function() {
        //  Called if the bullet goes out of the screen
        invadersGameplay.prototype.bullet.kill();
    },
    
    restart: function() {
        //  A new level starts
    
        //resets the life count
        invadersGameplay.prototype.lives.callAll('revive');
        //  And brings the aliens back from the dead :)
        invadersGameplay.prototype.aliens.removeAll();
        invadersGameplay.prototype.createAliens();
    
        //revives the player
        invadersGameplay.prototype.player.revive();
        //hides the text
        invadersGameplay.prototype.stateText.visible = false;
    }
};