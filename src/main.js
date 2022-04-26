// global object where to store game options
let gameOptions = {

    // first platform vertical position. 0 = top of the screen, 1 = bottom of the screen
    firstPlatformPosition: 480,

    // game gravity, which only affects the hero
    gameGravity: 1200,

    // hero speed, in pixels per second
    heroSpeed: 300,

    // hero speed, in pixels per second
    heroJump: -400,

    // platform speed, in pixels per second
    platformSpeed: -80,

    // platform length range, in pixels
    platformLengthRange: [50, 150],

    // platform horizontal distance range from the center of the stage, in pixels
    platformHorizontalDistanceRange: [0, 130],

    // platform vertical distance range, in pixels
    platformVerticalDistanceRange: [150, 180]
}

    // game configuration object
    let config = {
        type: Phaser.CANVAS,
        width: 640,
        height: 480,
        scene: [ Menu, Play ],
        backgroundColor: 0x808080,
        physics: {
            default: 'arcade',
            arcade: {
                debug: true
            }
        },
    }
    let game = new Phaser.Game(config);
    let borderUISize = game.config.height / 15;
    let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyUP, keyDOWN, keyLEFT, keyRIGHT;
