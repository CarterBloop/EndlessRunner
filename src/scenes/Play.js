class Play extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        //this.load.image("hero", "./assets/player1.png");
        this.load.image("platform", "./assets/platform.png");
        this.load.image("cloud", "./assets/cloud.png");
        this.load.spritesheet('hero', './assets/player1.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});
    }
    create() {

        this.cloud = this.add.tileSprite(0, 0, 640, 480, "cloud").setOrigin(0, 0);
        
        // platform physics group
        this.platformGroup = this.physics.add.group();

        // create starting platform
        let platform = this.platformGroup.create(game.config.width / 2, game.config.height - 40, "platform");
        platform.setImmovable(true);

        // create platforms
        for(let i = 0; i < 4; i ++) {
            let platform = this.platformGroup.create(640, 480, "platform");
            platform.setImmovable(true);
            this.positionPlatform(platform)
        }

        // add the hero
        this.hero = this.physics.add.sprite(game.config.width / 2, game.config.height - 90, "hero");
        this.anims.create({
            key: 'jumping',
            frames: this.anims.generateFrameNumbers('hero', {start: 1, end: 0, first: 1}),
            frameRate: 8
        });

        // set hero gravity
        this.hero.body.gravity.y = gameOptions.gameGravity;

        // set the appropriate keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // player jump on space
        this.input.keyboard.on("keydown-SPACE", () => {
            this.moveHero(this.hero);
            this.hero.anims.play('jumping');
        }, this);

        // we are waiting for player first move
        this.firstMove = true;

    }

    // method to return a random value between index 0 and 1 of a giver array
    randomValue(a) {
        return Phaser.Math.Between(a[0], a[1]);
    }

    // method to move the hero
    moveHero(e) {

        if(e.x > (game.config.width/2) + (game.config.width/5)) {
            this.hero.setVelocityX(gameOptions.heroSpeed);
        } else if(e.x < (game.config.width/2) - (game.config.width/5)) {
            this.hero.setVelocityX(gameOptions.heroSpeed * -1);
        } else {
            this.hero.setVelocityX(0);
        }
        // set hero velocity according to input horizontal coordinate
        //this.hero.setVelocityX(gameOptions.heroSpeed * ((e.x > game.config.width / 2) ? 1 : -1));

        if(this.hero.body.touching.down) {
            this.hero.setVelocityY(gameOptions.heroJump);
        }
        
        // is it the first move?
        if(this.firstMove) {
            this.firstMove = false;
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


    update(){

        this.cloud.tilePositionY -= 2;

        // right and left movement for player
        if (keyLEFT.isDown && this.hero.x >= 0) {
            this.hero.setVelocityX(-gameOptions.heroSpeed);
        } else if (keyRIGHT.isDown && this.hero.x <= game.config.width) {
            this.hero.setVelocityX(gameOptions.heroSpeed);
        } else {
            this.stopHero(this.hero);
        }

        // handle collision between player and platforms
        this.physics.world.collide(this.platformGroup, this.hero);

        // loop through all platforms
        this.platformGroup.getChildren().forEach(function(platform) {

            // if a platform leaves the stage to the upper side...
            if(platform.getBounds().bottom > game.config.height) {

                // ... recycle the platform
                this.positionPlatform(platform);
                platform.y = 0; // platforms spawn at the top
            }
        }, this);

        // restart scene if player falls and die
        if(this.hero.y > game.config.height) {
            this.scene.start("PlayGame");
        }
    }
}
