var gameplay = function(game) {}

gameplay.prototype = {
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
        gameplay.prototype.game = game;
        
        gameplay.prototype.ballOnPaddle = true;
        gameplay.prototype.lives = 3;
        gameplay.prototype.score = 0;
        gameplay.prototype.game.physics.startSystem(Phaser.Physics.ARCADE);
    
        //  We check bounds collisions against all walls other than the bottom one
        gameplay.prototype.game.physics.arcade.checkCollision.down = false;
    
        gameplay.prototype.s = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    
        gameplay.prototype.bricks = game.add.group();
        gameplay.prototype.bricks.enableBody = true;
        gameplay.prototype.bricks.physicsBodyType = Phaser.Physics.ARCADE;
    
        var brick;
    
        for (var y = 0; y < 4; y++)
        {
            for (var x = 0; x < 15; x++)
            {
                brick = gameplay.prototype.bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
                brick.body.bounce.set(1);
                brick.body.immovable = true;
            }
        }
    
        gameplay.prototype.paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
        gameplay.prototype.paddle.anchor.setTo(0.5, 0.5);
    
        gameplay.prototype.game.physics.enable(gameplay.prototype.paddle, Phaser.Physics.ARCADE);
    
        gameplay.prototype.paddle.body.collideWorldBounds = true;
        gameplay.prototype.paddle.body.bounce.set(1);
        gameplay.prototype.paddle.body.immovable = true;
    
        gameplay.prototype.ball = game.add.sprite(game.world.centerX, gameplay.prototype.paddle.y - 16, 'breakout', 'ball_1.png');
        gameplay.prototype.ball.anchor.set(0.5);
        gameplay.prototype.ball.checkWorldBounds = true;
    
        game.physics.enable(gameplay.prototype.ball, Phaser.Physics.ARCADE);
    
        gameplay.prototype.ball.body.collideWorldBounds = true;
        gameplay.prototype.ball.body.bounce.set(1);
    
        gameplay.prototype.ball.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false);
    
        gameplay.prototype.ball.events.onOutOfBounds.add(gameplay.prototype.ballLost, this);
    
        gameplay.prototype.scoreText = game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
        gameplay.prototype.livesText = game.add.text(680, 550, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
        gameplay.prototype.introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
        gameplay.prototype.introText.anchor.setTo(0.5, 0.5);
    
        game.input.onDown.add(gameplay.prototype.releaseBall, this);
        
        if(mediator) {
            mediator.subscribe("REPLAY_GAME", this.onReplayGame);
        }
    },
    
    update: function (game) {
    
        // Fun, but a little sea-sick inducing :) Uncomment if you like!
        //s.tilePosition.x += (game.input.speed.x / 2);
    
        gameplay.prototype.paddle.x = game.input.x;
    
        if (gameplay.prototype.paddle.x < 24)
        {
            gameplay.prototype.paddle.x = 24;
        }
        else if (gameplay.prototype.paddle.x > game.width - 24)
        {
            gameplay.prototype.paddle.x = game.width - 24;
        }
    
        if (gameplay.prototype.ballOnPaddle)
        {
            gameplay.prototype.ball.body.x = gameplay.prototype.paddle.x;
        }
        else
        {
            game.physics.arcade.collide(gameplay.prototype.ball, gameplay.prototype.paddle, gameplay.prototype.ballHitPaddle, null, this);
            game.physics.arcade.collide(gameplay.prototype.ball, gameplay.prototype.bricks, gameplay.prototype.ballHitBrick, null, this);
        }
    
    },
    
    onReplayGame: function () {
        if(mediator) {
            mediator.remove("REPLAY_GAME", this.onReplayGame);
        }
        gameplay.prototype.game.state.start("gameover");
    },
    
    releaseBall: function () {
    
        if (gameplay.prototype.ballOnPaddle)
        {
            gameplay.prototype.ballOnPaddle = false;
            gameplay.prototype.ball.body.velocity.y = -300;
            gameplay.prototype.ball.body.velocity.x = -75;
            gameplay.prototype.ball.animations.play('spin');
            gameplay.prototype.introText.visible = false;
        }
    
    },
    
    ballLost: function () {
    
        gameplay.prototype.lives--;
        gameplay.prototype.livesText.text = 'lives: ' + gameplay.prototype.lives;
    
        if (gameplay.prototype.lives === 0) {
            gameplay.prototype.gameOver(gameplay.prototype.game);
        } else {
            gameplay.prototype.ballOnPaddle = true;
    
            gameplay.prototype.ball.reset(gameplay.prototype.paddle.body.x + 16, gameplay.prototype.paddle.y - 16);
            
            gameplay.prototype.ball.animations.stop();
        }
    },
    
    gameOver: function (game) {
        //gameplay.prototype.game = game;
    
        gameplay.prototype.ball.body.velocity.setTo(0, 0);
        
        gameplay.prototype.introText.text = 'Game Over!';
        gameplay.prototype.introText.visible = true;
        
        setTimeout(function() {
            if(gameplay.prototype.isHighScore(gameplay.prototype.score)) {
                gameplay.prototype.showNameInput();
                gameplay.prototype.addHighScore(gameplay.prototype.name, gameplay.prototype.score);
                
                mediator.publish("SHOW_HIGH_SCORES", gameplay.prototype.highScores);
            }
            // } else {
            //     gameplay.prototype.endText = game.add.text(game.world.centerX, 400, 'Click to continue', { font: "40px Arial", fill: "#ffffff", align: "center" });
            //     game.input.onDown.add(gameplay.prototype.gameOverClicked, this);
            // }
        }, 2000);
    
    },
    
    // gameOverClicked: function () {
    //     gameplay.prototype.game.state.start("gameover");
    // },
    
    isHighScore: function (score) {
        return true; // needs to be changed eventually
    },
    
    showNameInput: function() {
        // Get user's name from input field
        var person = prompt("Please enter your name", "Harry Potter");
        person = person != null ? person : "Guest";
        gameplay.prototype.name = person;
    },
    
    addHighScore: function(name, score) {
        var highScores = gameplay.prototype.highScores;
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
            gameplay.prototype.score += 15;
        }
        
        else if(_brick.y == 152) {
            gameplay.prototype.score += 9;
        }
        
        else if(_brick.y == 204) {
            gameplay.prototype.score += 5;
        }
        
        else if(_brick.y == 256) {
            gameplay.prototype.score += 2;
        }
        
        _brick.kill();
    
        gameplay.prototype.scoreText.text = 'score: ' + gameplay.prototype.score;
    
        //  Are they any bricks left?
        if (gameplay.prototype.bricks.countLiving() == 0)
        {
            //  New level starts
            gameplay.prototype.score += 1000;
            gameplay.prototype.scoreText.text = 'score: ' + gameplay.prototype.score;
            gameplay.prototype.introText.text = '- Next Level -';
    
            //  Let's move the ball back to the paddle
            gameplay.prototype.ballOnPaddle = true;
            gameplay.prototype.ball.body.velocity.set(0);
            gameplay.prototype.ball.x = gameplay.prototype.paddle.x + 16;
            gameplay.prototype.ball.y = gameplay.prototype.paddle.y - 16;
            gameplay.prototype.ball.animations.stop();
    
            //  And bring the bricks back from the dead :)
            gameplay.prototype.bricks.callAll('revive');
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