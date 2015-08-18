var preload = function(game) {}

preload.prototype = {
    preload: function() {
        this.game.load.atlas('breakout', '../assets/games/breakout/breakout.png', '../assets/games/breakout/breakout.json');
        this.game.load.image('starfield', '../assets/misc/starfield.jpg');
    },
    create: function(){
		this.game.state.start("Gameplay");
    }
};