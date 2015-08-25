var preload = function(game) {}

preload.prototype = {
    preload: function() {
        
        var assets = preload.prototype.getAssetsJSON(selectedGame);
        if(assets.images) {
            for (var i = 0; i < assets.images.length; i++) {
                var values = preload.prototype.getAssetValues(assets.images[i]);
                this.game.load.image.apply(this.game.load, values);
            }    
        }
        
        
        if(assets.atlas) {
            for (var i = 0; i < assets.atlas.length; i++) {
                var values = preload.prototype.getAssetValues(assets.atlas[i]);
                this.game.load.atlas.apply(this.game.load, values);
            }
        }
        
        if(assets.spritesheets) {
            for (var i = 0; i < assets.spritesheets.length; i++) {
                var values = preload.prototype.getAssetValues(assets.spritesheets[i]);
                this.game.load.spritesheet.apply(this.game.load, values);
            }
        }
    },
    create: function(){
		this.game.state.start(selectedGame);
    },
    
    getAssetValues: function(asset) {
        var values = []
        for(var key in asset) {
            var value = asset[key];
            values.push(value);   
        }
        return values;
    },
    
    getAssetsJSON: function(gameName) {
        var breakoutAssets = {
            "images":[{"name":"starfield", "url":"../assets/misc/starfield.jpg"}],
            "atlas": [{"name":"breakout", "url":"../assets/games/breakout/breakout.png", "json":"../assets/games/breakout/breakout.json"}]
        };
            
        var invadersAssets = {
            "images":[{"name":"bullet", "url":"../assets/games/invaders/bullet.png"},
                        {"name":"enemyBullet", "url":"../assets/games/invaders/enemy-bullet.png"},
                        {"name":"ship", "url":"../assets/games/invaders/player.png"},
                        {"name":"starfield", "url":"../assets/games/invaders/starfield.png"}],
                        
            "spritesheets": [{"name":"invader", "url":"../assets/games/invaders/invader32x32x4.png", "width": 32, "height": 32}, 
                            {"name":"kaboom", "url":"../assets/games/invaders/explode.png", "width": 128, "height": 128}]
        };
        return gameName == 'breakout' ? breakoutAssets : invadersAssets;
    }
};