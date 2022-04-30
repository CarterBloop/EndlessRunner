class Play extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        // load assets
        this.load.image("platform", "./assets/platform.png");
        this.load.image("cloud", "./assets/stars.png");
        this.load.image("skyscraper", "./assets/skyscraper.png");
        this.load.spritesheet('hero', './assets/player1.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.image("window", "./assets/window.png");
    }
    create() {

        this.cloud = this.add.tileSprite(0, 0, 640, 480, "cloud").setOrigin(0, 0);
        this.skyscraper = this.add.sprite(115, 0, "skyscraper").setOrigin(0,0);
        
        // platform physics group
        this.platformGroup = this.physics.add.group();
        
        this.windowGroup = this.physics.add.group();

        // create starting platform
        let platform = this.platformGroup.create(game.config.width / 2, game.config.height - 40, "platform");
        this.windowGroup.create(game.config.width / 2, platform.y - 55, "window");
        platform.setImmovable(true);

        // create platforms
        for(let i = 0; i < 3; i ++) {
            let platform = this.platformGroup.create(640, 480, "platform");
            let window = this.windowGroup.create(0, 0, "window");
            platform.setImmovable(true);
            this.positionPlatform(platform, window);
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
        this.hero.depth = 1; // puts player to front

        // set the appropriate keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

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
            this.windowGroup.setVelocityY(-gameOptions.platformSpeed);
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
    positionPlatform(platform, window) {

        // vertical position
        platform.y = this.getHighestPlatform() - this.randomValue(gameOptions.platformVerticalDistanceRange);

        // Platform Toggle
        platformToggle = platformToggle * -1;

        // horizontal position
        platform.x = game.config.width / 2 + this.randomValue(gameOptions.platformHorizontalDistanceRange) * platformToggle;

        window.y = platform.y - 55;
        window.x = platform.x;

        // platform width
        let platform_length = this.randomValue(gameOptions.platformLengthRange);
        platform.displayWidth = platform_length;
        window.displayWidth = platform_length;
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

        this.windowGroup.getChildren().forEach(function(window) {
            if (window.getBounds().top > game.config.height && window.active) {
                window.active = false; // set window child as false
            }
        });

        // loop through all platforms
        this.platformGroup.getChildren().forEach(function(platform) {
            // if a platform leaves the stage to the upper side...
            if(platform.getBounds().top > game.config.height) {
                let window = this.windowGroup.getFirstDead(true, 100, 100, "window", 0, true);
                window.active = true;
                //let window = this.physics.add.sprite(0, 0, "window");
                // ... recycle the platform
                this.positionPlatform(platform, window);
                platform.y = -1; // platforms spawn at the top
                window.y = platform.y - 56;
                window.setVelocityY(-gameOptions.platformSpeed);
            }
        }, this);

        // restart scene if player falls and die
        if(this.hero.y > game.config.height) {
            this.scene.start("gameOver");
        }
    }
}
