var breakout = function(game) {}

breakout.prototype = {
    game: null,
    ball: null,
    paddle: null,
    ballOnPaddle: true,
    lives: 3,
    score: 0,
    scoreText: null,
    livesText: null,
    introText: null,
    endText: null,
    s: null,
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
        breakout.prototype.game = game;
        
        breakout.prototype.ballOnPaddle = true;
        breakout.prototype.lives = 3;
        breakout.prototype.score = 0;
        breakout.prototype.game.physics.startSystem(Phaser.Physics.ARCADE);
    
        //  We check bounds collisions against all walls other than the bottom one
        breakout.prototype.game.physics.arcade.checkCollision.down = false;
    
        breakout.prototype.s = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    
        breakout.prototype.bricks = game.add.group();
        breakout.prototype.bricks.enableBody = true;
        breakout.prototype.bricks.physicsBodyType = Phaser.Physics.ARCADE;
    
        var brick;
    
        for (var y = 0; y < 4; y++)
        {
            for (var x = 0; x < 15; x++)
            {
                brick = breakout.prototype.bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
                brick.body.bounce.set(1);
                brick.body.immovable = true;
            }
        }
    
        breakout.prototype.paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
        breakout.prototype.paddle.anchor.setTo(0.5, 0.5);
    
        breakout.prototype.game.physics.enable(breakout.prototype.paddle, Phaser.Physics.ARCADE);
    
        breakout.prototype.paddle.body.collideWorldBounds = true;
        breakout.prototype.paddle.body.bounce.set(1);
        breakout.prototype.paddle.body.immovable = true;
    
        breakout.prototype.ball = game.add.sprite(game.world.centerX, breakout.prototype.paddle.y - 16, 'breakout', 'ball_1.png');
        breakout.prototype.ball.anchor.set(0.5);
        breakout.prototype.ball.checkWorldBounds = true;
    
        game.physics.enable(breakout.prototype.ball, Phaser.Physics.ARCADE);
    
        breakout.prototype.ball.body.collideWorldBounds = true;
        breakout.prototype.ball.body.bounce.set(1);
    
        breakout.prototype.ball.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false);
    
        breakout.prototype.ball.events.onOutOfBounds.add(breakout.prototype.ballLost, this);
    
        breakout.prototype.scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
        breakout.prototype.livesText = game.add.text(680, 550, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
        breakout.prototype.introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
        breakout.prototype.introText.anchor.setTo(0.5, 0.5);
    
        game.input.onDown.add(breakout.prototype.releaseBall, this);
        
        if(mediator) {
            mediator.subscribe("REPLAY_GAME", this.onReplayGame);
        }
    },
    
    update: function (game) {
    
        // Fun, but a little sea-sick inducing :) Uncomment if you like!
        //s.tilePosition.x += (game.input.speed.x / 2);
    
        breakout.prototype.paddle.x = game.input.x;
    
        if (breakout.prototype.paddle.x < 24)
        {
            breakout.prototype.paddle.x = 24;
        }
        else if (breakout.prototype.paddle.x > game.width - 24)
        {
            breakout.prototype.paddle.x = game.width - 24;
        }
    
        if (breakout.prototype.ballOnPaddle)
        {
            breakout.prototype.ball.body.x = breakout.prototype.paddle.x;
        }
        else
        {
            game.physics.arcade.collide(breakout.prototype.ball, breakout.prototype.paddle, breakout.prototype.ballHitPaddle, null, this);
            game.physics.arcade.collide(breakout.prototype.ball, breakout.prototype.bricks, breakout.prototype.ballHitBrick, null, this);
        }
    
    },
    
    onReplayGame: function () {
        if(mediator) {
            mediator.remove("REPLAY_GAME", this.onReplayGame);
        }
        breakout.prototype.game.state.start("gameover");
    },
    
    releaseBall: function () {
    
        if (breakout.prototype.ballOnPaddle)
        {
            breakout.prototype.ballOnPaddle = false;
            breakout.prototype.ball.body.velocity.y = -300;
            breakout.prototype.ball.body.velocity.x = -75;
            breakout.prototype.ball.animations.play('spin');
            breakout.prototype.introText.visible = false;
        }
    
    },
    
    ballLost: function () {
    
        breakout.prototype.lives--;
        breakout.prototype.livesText.text = 'lives: ' + breakout.prototype.lives;
    
        if (breakout.prototype.lives === 0) {
            breakout.prototype.gameOver(breakout.prototype.game);
        } else {
            breakout.prototype.ballOnPaddle = true;
    
            breakout.prototype.ball.reset(breakout.prototype.paddle.body.x + 16, breakout.prototype.paddle.y - 16);
            
            breakout.prototype.ball.animations.stop();
        }
    },
    
    gameOver: function (game) {
        //breakout.prototype.game = game;
    
        breakout.prototype.ball.body.velocity.setTo(0, 0);
        
        breakout.prototype.introText.text = 'Game Over!';
        breakout.prototype.introText.visible = true;
        
        setTimeout(function() {
            if(breakout.prototype.isHighScore(breakout.prototype.score)) {
                breakout.prototype.showNameInput();
                breakout.prototype.addHighScore(breakout.prototype.name, breakout.prototype.score);
                
                mediator.publish("SHOW_HIGH_SCORES", breakout.prototype.highScores);
            }
            // } else {
            //     breakout.prototype.endText = game.add.text(game.world.centerX, 400, 'Click to continue', { font: "40px Arial", fill: "#ffffff", align: "center" });
            //     game.input.onDown.add(breakout.prototype.gameOverClicked, this);
            // }
        }, 2000);
    
    },
    
    // gameOverClicked: function () {
    //     breakout.prototype.game.state.start("gameover");
    // },
    
    isHighScore: function (score) {
        return true; // needs to be changed eventually
    },
    
    showNameInput: function() {
        // Get user's name from input field
        var person = prompt("Please enter your name", "Harry Potter");
        person = person != null ? person : "Guest";
        breakout.prototype.name = person;
    },
    
    addHighScore: function(name, score) {
        var highScores = breakout.prototype.highScores;
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
    
    ballHitBrick: function (_ball, _brick) {
    
        if(_brick.y == 100) {
            breakout.prototype.score += 15;
        }
        
        else if(_brick.y == 152) {
            breakout.prototype.score += 9;
        }
        
        else if(_brick.y == 204) {
            breakout.prototype.score += 5;
        }
        
        else if(_brick.y == 256) {
            breakout.prototype.score += 2;
        }
        
        _brick.kill();
    
        breakout.prototype.scoreText.text = 'score: ' + breakout.prototype.score;
    
        //  Are they any bricks left?
        if (breakout.prototype.bricks.countLiving() == 0)
        {
            //  New level starts
            breakout.prototype.score += 1000;
            breakout.prototype.scoreText.text = 'score: ' + breakout.prototype.score;
            breakout.prototype.introText.text = '- Next Level -';
    
            //  Let's move the ball back to the paddle
            breakout.prototype.ballOnPaddle = true;
            breakout.prototype.ball.body.velocity.set(0);
            breakout.prototype.ball.x = breakout.prototype.paddle.x + 16;
            breakout.prototype.ball.y = breakout.prototype.paddle.y - 16;
            breakout.prototype.ball.animations.stop();
    
            //  And bring the bricks back from the dead :)
            breakout.prototype.bricks.callAll('revive');
        }
    
    },
    
    ballHitPaddle: function (_ball, _paddle) {
    
        var diff = 0;
    
        if (_ball.x < _paddle.x)
        {
            //  Ball is on the left-hand side of the paddle
            diff = _paddle.x - _ball.x;
            _ball.body.velocity.x = (-10 * diff);
        }
        else if (_ball.x > _paddle.x)
        {
            //  Ball is on the right-hand side of the paddle
            diff = _ball.x -_paddle.x;
            _ball.body.velocity.x = (10 * diff);
        }
        else
        {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            _ball.body.velocity.x = 2 + Math.random() * 8;
        }
    
    }
};