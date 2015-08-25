var menu = function(game) {}

// var breakoutSprite;
// var invadersSprite;

menu.prototype = {
    game: null,
    // preload: function() {
    //     this.game.load.spritesheet('sprite1', '../assets/sprites/orb-blue.png');
    //     this.game.load.spritesheet('sprite2', '../assets/sprites/orb-red.png');
    // },
    create: function(game) {
        menu.prototype.game = game;
        
        // breakoutSprite = this.game.add.sprite(40, 100, 'sprite1');
        // invadersSprite = this.game.add.sprite(140, 100, 'sprite2');
        
        //console.log(breakoutSprite);
        //console.log(breakoutSprite.events);
        // breakoutSprite.inputEnabled = true;
        // breakoutSprite.events.onInputDown.add(menu.prototype.onInputDown, this);
        if(mediator) {
            mediator.publish("SHOW_MENU");
            mediator.subscribe("SELECT_GAME", this.onSelectGame);
        }
    }
    // onInputDown: function(e) {
    //     menu.prototype.game.state.start("Boot");
    // },
    // onSelectGame: function() {
    //     menu.prototype.game.state.start("Boot");
    // }
}