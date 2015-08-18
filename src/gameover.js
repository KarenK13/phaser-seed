var gameover = function(game) {}

gameover.prototype = {
    create: function(){
        this.game.state.start("Gameplay");
    }
};