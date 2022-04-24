let game;

// global object where to store game options
let gameOptions = {

    // first platform vertical position. 0 = top of the screen, 1 = bottom of the screen
    firstPlatformPosition: 1 / 10,

    // game gravity, which only affects the hero
    gameGravity: 1200,

    // hero speed, in pixels per second
    heroSpeed: 300,

    // platform speed, in pixels per second
    platformSpeed: 190,

    // platform length range, in pixels
    platformLengthRange: [50, 150],

    // platform horizontal distance range from the center of the stage, in pixels
    platformHorizontalDistanceRange: [0, 250],

    // platform vertical distance range, in pixels
    platformVerticalDistanceRange: [150, 300]
}

window.onload = function() {

    // game configuration object
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor:0x444444,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 750,
            height: 1334
        },
        physics: {
            default: "arcade"
        },
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}