var boxExample = function(game) {};

var box;

boxExample.prototype = {
    temp: [
        {"type":"box", "x":"random", "y":"random", "width": 100, "height": 100, color: "#FF0000"},
        {"type":"box", "x":"random", "y":"random", "width": 100, "height": 100, color: "#0000FF"},
        {"type":"circle", "x":"random", "y":"random", "radius": 100, color: "0x009933"}
    ],
    
    preloadAssets: [
        {"name": "download", "url":"/assets/box_images/download.jpg"},
        {"name": "download2", "url":"/assets/box_images/download2.png"},
        {"name": "download4", "url":"/assets/box_images/download4.png"},
        {"name": "download8", "url":"/assets/box_images/download8.png"},
        {"name": "box_image0", "url":"/assets/box_images/0.png"}, 
        {"name": "box_image1", "url":"/assets/box_images/1.png"}, 
        {"name": "box_image2", "url":"/assets/box_images/2.png"},
        {"name": "box_image3", "url":"/assets/box_images/3.png"},
        {"name": "box_image4", "url":"/assets/box_images/4.png"},
        {"name": "box_image5", "url":"/assets/box_images/5.png"},
        {"name": "box_image6", "url":"/assets/box_images/6.png"},
        {"name": "box_image7", "url":"/assets/box_images/7.png"},
        {"name": "box_image8", "url":"/assets/box_images/8.png"},
        {"name": "box_image9", "url":"/assets/box_images/9.png"}
    ],
    palette: 
    {
        "type":"normal",
        "elements": [
            {"type": "image", "name":"download", "value": "1"}, 
            {"type": "image", "name":"download2", "value": "1/2"}, 
            {"type": "image", "name":"download4", "value": "1/4"}, 
            {"type": "image", "name":"download8", "value": "1/8"}
        ]
    },
    
    paletteNumpad:
    {
        "type":"numpad",
        "elements": [
            {"type": "image", "name":"box_image0", "value": 0}, 
            {"type": "image", "name":"box_image1", "value": 1}, 
            {"type": "image", "name":"box_image2", "value": 2},
            {"type": "image", "name":"box_image3", "value": 3},
            {"type": "image", "name":"box_image4", "value": 4},
            {"type": "image", "name":"box_image5", "value": 5},
            {"type": "image", "name":"box_image6", "value": 6},
            {"type": "image", "name":"box_image7", "value": 7},
            {"type": "image", "name":"box_image8", "value": 8},
            {"type": "image", "name":"box_image9", "value": 9}
        ]
    },
    
    preload: function(game) {
        var elements = boxExample.prototype.preloadAssets;
        for(var i=0; i<elements.length; i++){
            game.load.image(elements[i].name, elements[i].url);
        }
    },
    
    create: function(game) {
        boxExample.prototype.createPalette(game, boxExample.prototype.palette);
        boxExample.prototype.createPaletteItems(game, boxExample.prototype.palette.type, boxExample.prototype.palette.elements);
        boxExample.prototype.createAllElements(game, boxExample.prototype.temp);
    },

    createAllElements: function(game, elements) {
        
        //var elements = [];
        for(var i=0; i<elements.length; i++){
            var temp = elements[i];
            
            boxExample.prototype.createAsset(game, temp);
            
        }
        
        
        //return elements;
    },

    createBox: function(game, temp) {
        var drawnObject;
        var width = temp.width;
        var height = temp.height;
        var bmd = game.add.bitmapData(width, height);
         
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, width, height);
        bmd.ctx.fillStyle = temp.color;
        bmd.ctx.fill();
        drawnObject = game.add.sprite(temp.x, temp.y, bmd);
        drawnObject.anchor.setTo(0.5, 0.5);
        return drawnObject;
    },
    
    createCircle: function(game, temp) {
        var graphics = game.add.graphics(0, 0);
        // graphics.lineStyle(2, 0xffd900, 1);
        graphics.beginFill(temp.color, 1);
        graphics.drawCircle(temp.x, temp.y, temp.radius);
        
        return graphics;
    },
    
    generateRandomNumber: function() {
        var num = Math.random() * 499 + 251;
        return num;
    },
    
    //create palette
    createPalette: function(game, palette) {
        var drawnObject;
        var width = 300;
        var height = 1200;
        var bmd = game.add.bitmapData(width, height);
         
        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, width, height);
        bmd.ctx.fillStyle = "#660066";
        bmd.ctx.fill();
        drawnObject = game.add.sprite(0, 0 , bmd);
        drawnObject.anchor.setTo(0.5, 0.5);
        return drawnObject;
    },
    
    
    //create palette items (type, elements)
    createPaletteItems: function(game, type, elements) {
        for(var i=0; i<elements.length; i++){
            var temp = elements[i];
            
           boxExample.prototype.createAsset(game, temp);
            
        }
    },
    
    createAsset: function(game, info) {
        var asset;
        for(var key in info) {
            var value = info[key];
            if(value == "random") {
                info[key] = boxExample.prototype.generateRandomNumber();
            }
        }
        
        if(info.type == "box") {
            asset = boxExample.prototype.createBox(game, info);
        } else if(info.type == "circle") {
            asset = boxExample.prototype.createCircle(game, info);
        } else if(info.type == "image") {
            asset = boxExample.prototype.createImage(game, info);
        }
        return asset;
    },
    
    createImage: function(game, info) {
        game.add.sprite(15, 50, info.name);
    }
    
    //clear palette items
};