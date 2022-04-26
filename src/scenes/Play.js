class Play extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image("hero", "./assets/player1.png");
        this.load.image("platform", "./assets/platform.png");
        this.load.image("cloud", "./assets/cloud.png");
    }
    create() {

        this.cloud = this.add.tileSprite(0, 0, 640, 480, "cloud").setOrigin(0, 0);
        // creation of the physics group which will contain all platforms
        this.platformGroup = this.physics.add.group();

        // create starting platform
        let platform = this.platformGroup.create(game.config.width / 2, game.config.height - 40, "platform");

        // platform won't physically react to collisions
        platform.setImmovable(true);

        // we are going to create 3 more platforms which we'll reuse to save resources
        for(let i = 0; i < 3; i ++) {

            // platform creation, as a member of platformGroup physics group
            let platform = this.platformGroup.create(640, 480, "platform");

            // platform won't physically react to collisions
            platform.setImmovable(true);

            // position the platform
            this.positionPlatform(platform)
        }

        // add the hero
        this.hero = this.physics.add.sprite(game.config.width / 2, 0, "hero");

        // set hero gravity
        this.hero.body.gravity.y = gameOptions.gameGravity;

        // input listener to move the hero
        this.input.on("pointerdown", this.moveHero, this);

        // input listener to stop the hero
        this.input.on("pointerup", this.stopHero, this);

        // we are waiting for player first move
        this.firstMove = true;
    }

    // method to return a random value between index 0 and 1 of a giver array
    randomValue(a) {
        return Phaser.Math.Between(a[0], a[1]);
    }

    // method to move the hero
    moveHero(e) {

        // set hero velocity according to input horizontal coordinate
        this.hero.setVelocityX(gameOptions.heroSpeed * ((e.x > game.config.width / 2) ? 1 : -1));

        this.hero.setVelocityY(gameOptions.heroJump);

        // is it the first move?
        if(this.firstMove) {

            // it's no longer the first move
            this.firstMove = false;

            // move platform group
            this.platformGroup.setVelocityY(-gameOptions.platformSpeed);
        }
    }

    // method to stop the hero
    stopHero() {

        // ... just stop the hero :)
        this.hero.setVelocityX(0);
    }

    // method to get the lowest platform, returns the position of the lowest platform, in pixels
    getHighestPlatform() {
        let currentHighest = game.config.height;
        this.platformGroup.getChildren().forEach(function(platform) {
            if (platform.y < currentHighest) {
                currentHighest = platform.y;
            }
        });
        return currentHighest;
    }

    // method to position a platform
    positionPlatform(platform) {

        // vertical position
        platform.y = this.getHighestPlatform() - this.randomValue(gameOptions.platformVerticalDistanceRange);

        // horizontal position
        platform.x = game.config.width / 2 + this.randomValue(gameOptions.platformHorizontalDistanceRange) * Phaser.Math.RND.sign();

        // platform width
        platform.displayWidth = this.randomValue(gameOptions.platformLengthRange);
    }

    // method to be executed at each frame
    update(){

        this.cloud.tilePositionY += 2;
        // handle collision between ball and platforms
        this.physics.world.collide(this.platformGroup, this.hero);

        // loop through all platforms
        this.platformGroup.getChildren().forEach(function(platform) {

            // if a platform leaves the stage to the upper side...
            if(platform.getBounds().bottom > game.config.height) {

                // ... recycle the platform
                this.positionPlatform(platform);
            }
        }, this);

        // if the hero falls down or leaves the stage from the top...
        if(this.hero.y > game.config.height || this.hero.y < 0) {

            // restart the scene
            this.scene.start("PlayGame");
        }
    }
}
