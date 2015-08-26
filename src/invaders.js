var invaders = function(game) {}

invaders.prototype = {
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
        invaders.prototype.game = game;
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //  The scrolling starfield background
        invaders.prototype.starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    
        //  Our bullet group
        invaders.prototype.bullets = game.add.group();
        invaders.prototype.bullets.enableBody = true;
        invaders.prototype.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        invaders.prototype.bullets.createMultiple(30, 'bullet');
        invaders.prototype.bullets.setAll('anchor.x', 0.5);
        invaders.prototype.bullets.setAll('anchor.y', 1);
        invaders.prototype.bullets.setAll('outOfBoundsKill', true);
        invaders.prototype.bullets.setAll('checkWorldBounds', true);
    
        // The enemy's bullets
        invaders.prototype.enemyBullets = game.add.group();
        invaders.prototype.enemyBullets.enableBody = true;
        invaders.prototype.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        invaders.prototype.enemyBullets.createMultiple(30, 'enemyBullet');
        invaders.prototype.enemyBullets.setAll('anchor.x', 0.5);
        invaders.prototype.enemyBullets.setAll('anchor.y', 1);
        invaders.prototype.enemyBullets.setAll('outOfBoundsKill', true);
        invaders.prototype.enemyBullets.setAll('checkWorldBounds', true);
    
        //  The hero!
        invaders.prototype.player = game.add.sprite(400, 500, 'ship');
        invaders.prototype.player.anchor.setTo(0.5, 0.5);
        game.physics.enable(invaders.prototype.player, Phaser.Physics.ARCADE);
    
        //  The baddies!
        invaders.prototype.aliens = game.add.group();
        invaders.prototype.aliens.enableBody = true;
        invaders.prototype.aliens.physicsBodyType = Phaser.Physics.ARCADE;
    
        invaders.prototype.createAliens();
    
        //  The score
        invaders.prototype.scoreString = 'Score : ';
        invaders.prototype.score = 0;
        invaders.prototype.scoreText = game.add.text(10, 10, invaders.prototype.scoreString + invaders.prototype.score, { font: '30px Arial', fill: '#fff' });
    
        //  Lives
        invaders.prototype.lives = game.add.group();
        game.add.text(game.world.width - 110, 10, 'Lives : ', { font: '30px Arial', fill: '#fff' });
    
        //  Text
        invaders.prototype.stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
        invaders.prototype.stateText.anchor.setTo(0.5, 0.5);
        invaders.prototype.stateText.visible = false;
    
        for (var i = 0; i < 3; i++) 
        {
            var ship = invaders.prototype.lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
            ship.anchor.setTo(0.5, 0.5);
            ship.angle = 90;
            ship.alpha = 0.4;
        }
    
        //  An explosion pool
        invaders.prototype.explosions = game.add.group();
        invaders.prototype.explosions.createMultiple(30, 'kaboom');
        invaders.prototype.explosions.forEach(invaders.prototype.setupInvader, this);
    
        //  And some controls to play the game with
        invaders.prototype.cursors = game.input.keyboard.createCursorKeys();
        invaders.prototype.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        if(mediator) {
            mediator.subscribe("REPLAY_GAME", this.onReplayGame);
        }
    },
    
    createAliens: function() {
        for (var y = 0; y < 4; y++)
        {
            for (var x = 0; x < 10; x++)
            {
                var alien = invaders.prototype.aliens.create(x * 48, y * 50, 'invader');
                alien.anchor.setTo(0.5, 0.5);
                alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
                alien.play('fly');
                alien.body.moves = false;
            }
        }
    
        invaders.prototype.aliens.x = 100;
        invaders.prototype.aliens.y = 50;
    
        //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        var tween = invaders.prototype.game.add.tween(invaders.prototype.aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    
        //  When the tween loops it calls descend
        tween.onLoop.add(invaders.prototype.descend, this);
    },
    
    setupInvader: function(invader) {
        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');
    },
    
    descend: function() {
        invaders.prototype.aliens.y += 10;
    },
    
    update: function() {
        //  Scroll the background
        invaders.prototype.starfield.tilePosition.y += 2;
    
        if (invaders.prototype.player.alive)
        {
            //  Reset the player, then check for movement keys
            invaders.prototype.player.body.velocity.setTo(0, 0);
    
            // Left and right arrow key movement
            // if (invaders.prototype.cursors.left.isDown)
            // {
            //     invaders.prototype.player.body.velocity.x = -200;
            // }
            // else if (invaders.prototype.cursors.right.isDown)
            // {
            //     invaders.prototype.player.body.velocity.x = 200;
            // }
            
            // Update mouse for movement
            invaders.prototype.player.x = invaders.prototype.game.input.mousePointer.x;
    
            //  Firing?
            invaders.prototype.game.input.onDown.add(invaders.prototype.fireBullet, this);

            if (invaders.prototype.game.time.now > invaders.prototype.firingTimer)
            {
                invaders.prototype.enemyFires();
            }
    
            //  Run collision
            invaders.prototype.game.physics.arcade.overlap(invaders.prototype.bullets, invaders.prototype.aliens, invaders.prototype.collisionHandler, null, this);
            invaders.prototype.game.physics.arcade.overlap(invaders.prototype.enemyBullets, invaders.prototype.player, invaders.prototype.enemyHitsPlayer, null, this);
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
        invaders.prototype.score += 20;
        invaders.prototype.scoreText.text = invaders.prototype.scoreString + invaders.prototype.score;
    
        //  And create an explosion :)
        var explosion = invaders.prototype.explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);
    
        if (invaders.prototype.aliens.countLiving() == 0)
        {
            invaders.prototype.score += 1000;
            invaders.prototype.scoreText.text = invaders.prototype.scoreString + invaders.prototype.score;
    
            invaders.prototype.enemyBullets.callAll('kill',this);
            invaders.prototype.stateText.text = " You Won, \n Click to restart";
            invaders.prototype.stateText.visible = true;
    
            //the "click to restart" handler
            invaders.prototype.game.input.onTap.addOnce(invaders.prototype.restart,this);
        }
    },
    
    enemyHitsPlayer: function(player, bullet) {
        bullet.kill();

        invaders.prototype.live = invaders.prototype.lives.getFirstAlive();
    
        if (invaders.prototype.live)
        {
            invaders.prototype.live.kill();
        }
    
        //  And create an explosion :)
        var explosion = invaders.prototype.explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);
    
        // When the player dies
        if (invaders.prototype.lives.countLiving() < 1)
        {
            player.kill();
            invaders.prototype.enemyBullets.callAll('kill');
    
            //invaders.prototype.stateText.text=" GAME OVER \n Click to restart";
            //invaders.prototype.stateText.visible = true;
    
            //the "click to restart" handler
            //invaders.prototype.game.input.onTap.addOnce(invaders.prototype.restart,this);
            
            invaders.prototype.gameOver(invaders.prototype.game);
        }
    },
    
    gameOver: function(game) {
        setTimeout(function() {
            if(invaders.prototype.isHighScore(invaders.prototype.score)) {
                invaders.prototype.showNameInput();
                invaders.prototype.addHighScore(invaders.prototype.name, invaders.prototype.score);
                
                mediator.publish("SHOW_HIGH_SCORES", invaders.prototype.highScores);
                
            } else {
                invaders.prototype.endText = game.add.text(game.world.centerX, 400, 'Click to continue', { font: "40px Arial", fill: "#ffffff", align: "center" });
                game.input.onDown.add(invaders.prototype.gameOverClicked, this);
            }
        }, 2000);
    },
    
    onReplayGame: function () {
        if(mediator) {
            mediator.remove("REPLAY_GAME", this.onReplayGame);
        }
        invaders.prototype.game.state.start("gameover");
    },
    
    isHighScore: function (score) {
        return true; // needs to be changed eventually
    },
    
    showNameInput: function() {
        // Get user's name from input field
        var person = prompt("Please enter your name", "Harry Potter");
        person = person != null ? person : "Guest";
        invaders.prototype.name = person;
    },
    
    addHighScore: function(name, score) {
        var highScores = invaders.prototype.highScores;
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
        invaders.prototype.enemyBullet = invaders.prototype.enemyBullets.getFirstExists(false);
    
        invaders.prototype.livingEnemies.length=0;
    
        invaders.prototype.aliens.forEachAlive(function(alien){
    
            // put every living enemy in an array
            invaders.prototype.livingEnemies.push(alien);
        });
    
    
        if (invaders.prototype.enemyBullet && invaders.prototype.livingEnemies.length > 0)
        {
            
            var random = invaders.prototype.game.rnd.integerInRange(0,invaders.prototype.livingEnemies.length-1);
    
            // randomly select one of them
            var shooter=invaders.prototype.livingEnemies[random];
            // And fire the bullet from this enemy
            invaders.prototype.enemyBullet.reset(shooter.body.x, shooter.body.y);
    
            invaders.prototype.game.physics.arcade.moveToObject(invaders.prototype.enemyBullet,invaders.prototype.player,120);
            invaders.prototype.firingTimer = invaders.prototype.game.time.now + 2000;
        }

    },
    
    fireBullet: function() {
         //  To avoid them being allowed to fire too fast we set a time limit
        if (invaders.prototype.game.time.now > invaders.prototype.bulletTime && invaders.prototype.lives.countLiving() > 0)
        {
            //  Grab the first bullet we can from the pool
            invaders.prototype.bullet = invaders.prototype.bullets.getFirstExists(false);
    
            if (invaders.prototype.bullet)
            {
                //  And fire it
                invaders.prototype.bullet.reset(invaders.prototype.player.x, invaders.prototype.player.y + 8);
                invaders.prototype.bullet.body.velocity.y = -400;
                invaders.prototype.bulletTime = invaders.prototype.game.time.now + 200;
            }
        }
    },
    
    resetBullet: function() {
        //  Called if the bullet goes out of the screen
        invaders.prototype.bullet.kill();
    },
    
    restart: function() {
        //  A new level starts
    
        //resets the life count
        invaders.prototype.lives.callAll('revive');
        //  And brings the aliens back from the dead :)
        invaders.prototype.aliens.removeAll();
        invaders.prototype.createAliens();
    
        //revives the player
        invaders.prototype.player.revive();
        //hides the text
        invaders.prototype.stateText.visible = false;
    }
};