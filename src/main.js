// Names: Grant Bosworth, Nelson Pham, Ernani Raffo, John Lynch
// Game Name: The Loud Quiet
// Date Completed: May 1, 2022
// We decided to go with a vertical endless runner type platform game where the player
// climbs up a skyscraper with platforms by it as windowsills and they have to avoid
// certain obstacles like bombs falling here and there or the winds blowing them down
// and causes them to die. There is a powerup where they can advance up multiple platforms
// that spawn at random areas of the skyscraper. The overall goal is to get to the negative
// score and to go far into the negative score as much as possible before you die. We also
// have sound effects for when the player collides with the powerups and the wind and for the 
// jumping animation as well. All powerups, bombs, and wind effects are all animation created by 
// us and it will spawn at random times during the game. Platforms will accelerate faster as you
// get to the top of the skyscraper.

// global object where to store game options
let gameOptions = {

    // first platform vertical position. 0 = top of the screen, 1 = bottom of the screen
    firstPlatformPosition: 480,

    // game gravity, which only affects the hero
    gameGravity: 1200,

    // hero speed, in pixels per second
    heroSpeed: 300,

    // hero speed, in pixels per second
    heroJump: -600,

    // platform intial speed, in pixels per second
    platformSpeed: -80,

    // platform acceleration
    platformAcceleration: -5,

    // platform length range, in pixels
    platformLengthRange: [60, 120],

    // platform horizontal distance range from the center of the stage, in pixels
    platformHorizontalDistanceRange: [110, 130],

    // platform vertical distance range, in pixels
    platformVerticalDistanceRange: [130,150],

    // chance of getting a powerup
    powerUpChance: [1, 10],

    // chance of getting hit by bomb
    badItemChance: [1, 13]
}

    // game configuration object
    let config = {
        type: Phaser.CANVAS,
        width: 640,
        height: 480,
        scene: [ Menu, Play, GameOver],
        backgroundColor: 0xFFDEAD,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
    }
    let game = new Phaser.Game(config);
    let borderUISize = game.config.height / 15;
    let borderPadding = borderUISize / 3;
    let platformToggle = -1;

// reserve keyboard variables
let keyUP, keyDOWN, keyLEFT, keyRIGHT, keyR, keyM;
