class Play extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        // load assets
        this.load.image("platform", "./assets/platform.png");
        this.load.image("cloud", "./assets/stars.png");
        this.load.image("skyscraper", "./assets/skyscraper.png");
        //this.load.spritesheet('hero', './assets/player1.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});
        this.load.spritesheet('hero', './assets/player_jump.png', {frameWidth: 274, frameHeight: 484, startFrame: 0, endFrame: 274});

        this.load.image("window", "./assets/window.png");
        this.load.spritesheet("greenSound", "./assets/goodSound.png", {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 4});
        this.load.spritesheet("wind", "./assets/wind.png", {frameWidth: 100, frameHeight: 100, startFrame: 0, endFrame: 13});
        this.load.image("bomb", "./assets/ball2.png");
        this.load.audio('jump', ["./assets/Jump.wav"]);
        this.load.audio('boost', ["./assets/Boost.wav"]);
        this.load.audio('background', ["./assets/background.wav"]);
    }
    create() {

        this.cloud = this.add.tileSprite(0, 0, 640, 480, "cloud").setOrigin(0, 0);
        this.skyscraper = this.add.sprite(115, 0, "skyscraper").setOrigin(0,0);
        
        // platform physics group
        this.platformGroup = this.physics.add.group();
        
        // windows group
        this.windowGroup = this.physics.add.group();

        // sound group
        this.goodSoundGroup = this.physics.add.group();

        this.windGroup = this.physics.add.group();

        // bad item group
        this.badGroup = this.physics.add.group();

        // add the hero
        
        this.hero = this.physics.add.sprite(game.config.width / 2, game.config.height - 90, "hero");
        this.hero.setScale(0.08)
        // hero animation
        this.anims.create({
            key: 'jumping',
            frames: this.anims.generateFrameNumbers('hero', {start: 1, end: 0, first: 1}),
            frameRate: 2
        });
        // is hero floating?
        this.hero.floating = false;

        // we are waiting for player first move
        this.firstMove = true;

        this.heroScore = 500;

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 100
        }
        this.scoreConfig = scoreConfig;

        // Update score 
        this.scoreUpdateTimer = this.time.addEvent({
            paused: true,
            delay: 100,
            loop: true,
            callback: () => {
                this.heroScore -= 1;
            }
        });

        // Accelerate platforms every 5 seconds
        this.platformUpdate = this.time.addEvent({
            paused: true,
            delay: 5000,
            loop: true,
            callback: () => {
                gameOptions.platformSpeed += gameOptions.platformAcceleration;
                this.platformGroup.setVelocityY(-gameOptions.platformSpeed);
                this.windowGroup.setVelocityY(-gameOptions.platformSpeed);
                this.goodSoundGroup.setVelocityY(-gameOptions.platformSpeed);
                this.windGroup.setVelocityY(-gameOptions.platformSpeed);

            }
        });

        this.scoreDisplay = this.add.text(borderUISize + borderPadding - 15, borderUISize + borderPadding * 2, this.heroScore, scoreConfig);
        // create starting platform
        let platform = this.platformGroup.create(game.config.width / 2, game.config.height - 40, "platform");
        // starting window
        this.windowGroup.create(game.config.width / 2, platform.y - 55, "window");
        platform.setImmovable(true);

        // green sound animation
        this.anims.create({
            key: 'sound',
            frames: this.anims.generateFrameNumbers("greenSound", {start: 0, end: 4, first: 0}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'wind',
            frames: this.anims.generateFrameNumbers("wind", {start: 0, end: 13, first: 0}),
            frameRate: 12,
            repeat: -1
        });

        // create platforms
        for(let i = 0; i < 3; i ++) {
            let platform = this.platformGroup.create(640, 480, "platform");
            let window = this.windowGroup.create(0, 0, "window");
            platform.setImmovable(true);
            this.positionPlatform(platform, window);
        }

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

        this.jump = this.sound.add('jump', { loop: false });
        this.boost = this.sound.add('boost', { loop: false });
        this.background = this.sound.add('background', { loop: true });
        this.background.play();
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

        if(this.hero.body.touching.down) {
            this.jump.play();
            this.hero.setVelocityY(gameOptions.heroJump);
        }
        
        // is it the first move?
        if(this.firstMove) {
            this.firstMove = false;
            this.platformGroup.setVelocityY(-gameOptions.platformSpeed);
            this.windowGroup.setVelocityY(-gameOptions.platformSpeed);
            this.goodSoundGroup.setVelocityY(-gameOptions.platformSpeed);
            this.windGroup.setVelocityY(-gameOptions.platformSpeed);
            this.badGroup.setVelocityY(-gameOptions.platformSpeed);
        }
    }

    // method to stop the hero
    stopHero() {
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

        if (this.randomValue(gameOptions.powerUpChance) == 1) {
            let boom = this.physics.add.sprite(platform.x + (65 * platformToggle), 0, "greenSound").setOrigin(0.0);
            this.goodSoundGroup.add(boom);
            boom.anims.play('sound');
            if (this.firstMove == false) { // spawn from the top
                boom.y = -64;
                boom.setVelocityY(-gameOptions.platformSpeed);
            } else {
                boom.y = platform.y - 64;
            }
            boom.setImmovable(true);
        }
        if (this.randomValue(gameOptions.powerUpChance) == 2) {
            let blow = this.physics.add.sprite(platform.x + (65 * platformToggle), 0, "wind").setOrigin(0.0);
            this.windGroup.add(blow);
            blow.anims.play('wind');
            if (this.firstMove == false) { // spawn from the top
                blow.y = -64;
                blow.setVelocityY(-gameOptions.platformSpeed);
            } else {
                blow.y = platform.y - 64;
            }
            blow.setImmovable(true);
        }

        if (this.randomValue(gameOptions.badItemChance) == 3 && this.firstMove == false) {
            let bomb = this.physics.add.sprite(game.config.width / 2, 0, "bomb").setOrigin(0.0);
            this.badGroup.add(bomb);
            bomb.setImmovable(true);
            bomb.setVelocityY(-gameOptions.platformSpeed * 6);
        }
    }

    update(){

        this.cloud.tilePositionY -= 2;
        this.scoreDisplay.text = this.heroScore;

        if (this.firstMove == false) {
            this.scoreUpdateTimer.paused = false;
            this.platformUpdate.paused = false;
        }
        
        if (this.hero.floating == false) {
            this.physics.world.collide(this.goodSoundGroup, this.hero, () => {
                this.hero.floating = true;
                this.hero.body.gravity.y = 0;
                this.hero.setVelocityY(gameOptions.heroJump / 5);
                // floats for 2 seconds
                this.boost.play();
                this.time.delayedCall(2000, () => {
                    this.hero.floating = false;
                    this.hero.body.gravity.y = gameOptions.gameGravity;
                    this.physics.world.collide(this.platformGroup, this.hero);
                    this.hero.setVelocityY(0);
                }, null, this);
            });
        }
    
        this.physics.world.collide(this.windGroup, this.hero, () => {
                this.stopHero(this.hero);
                this.hero.x -=(50);
                this.hero.setVelocityX(-5000);
                this.hero.body.gravity.x = -5000;

                this.time.delayedCall(2000, () => {
                    //this.physics.world.collide(this.platformGroup, this.hero);
                    this.hero.setVelocityX(0);
                    this.hero.body.gravity.x = 0;
                }, null, this);
        });
        

        this.physics.world.collide(this.badGroup, this.hero, () => {
            this.hero.floating = true;
            this.stopHero(this.hero);
            this.hero.setVelocityY(gameOptions.gameGravity / 2);
        });


        // right and left movement for player
        if (keyLEFT.isDown && this.hero.x >= 0) {
            this.hero.setVelocityX(-gameOptions.heroSpeed);
            this.hero.flipX=false;
        } else if (keyRIGHT.isDown && this.hero.x <= game.config.width) {
            this.hero.setVelocityX(gameOptions.heroSpeed);
            this.hero.flipX=true;

        } else {
            this.stopHero(this.hero);
        }

        // handle collision between player and platforms
        if (this.hero.floating == false) {
            this.physics.world.collide(this.platformGroup, this.hero);
        }
    
        this.windowGroup.getChildren().forEach(function(window) {
            if (window.getBounds().top > game.config.height && window.active) {
                window.active = false; // set window child as false
            }
        });

        // recyle platforms and windows
        this.platformGroup.getChildren().forEach(function(platform) {
            if(platform.getBounds().top > game.config.height) {
                let window = this.windowGroup.getFirstDead(true, 100, 100, "window", 0, true);
                window.active = true;
                this.positionPlatform(platform, window);
                platform.y = -1; // platforms spawn at the top
                window.y = platform.y - 56;
                window.setVelocityY(-gameOptions.platformSpeed);
            }
        }, this);

        // restart scene if player falls and die
        if(this.hero.y > game.config.height) {
            this.scene.start("gameOver");
            this.background.stop();
        }

        // Game camera follow player
        if(this.hero.y < game.config.height/20 && this.hero.floating == false) {
            this.hero.body.gravity.y = gameOptions.gameGravity * 5;
        }
        // does not go out of the camera
        if (this.hero.y <= 0) {
            this.hero.setVelocityY(0);
        }
        if (this.firstMove == false) {
            if(this.hero.y < game.config.height / 6) {
                this.platformGroup.setVelocityY(-gameOptions.platformSpeed * 2);
                this.windowGroup.setVelocityY(-gameOptions.platformSpeed* 2);
                this.goodSoundGroup.setVelocityY(-gameOptions.platformSpeed* 2);
                if (this.hero.floating == false) {
                    this.hero.body.gravity.y = gameOptions.gameGravity * 1.5;
                }
            } else if(this.hero.y < game.config.height / 5){
                this.platformGroup.setVelocityY(-gameOptions.platformSpeed * 1.5);
                this.windowGroup.setVelocityY(-gameOptions.platformSpeed * 1.5);
                this.goodSoundGroup.setVelocityY(-gameOptions.platformSpeed * 1.5);
                if (this.hero.floating == false) {
                    this.hero.body.gravity.y = gameOptions.gameGravity * 1.2;
                }
            } else if(this.hero.y < game.config.height / 4) {
                this.platformGroup.setVelocityY(-gameOptions.platformSpeed * 1.25);
                this.windowGroup.setVelocityY(-gameOptions.platformSpeed * 1.25);
                this.goodSoundGroup.setVelocityY(-gameOptions.platformSpeed * 1.25);
                if (this.hero.floating == false) {
                    this.hero.body.gravity.y = gameOptions.gameGravity * 1.1;
                }
            } else if(this.hero.y < game.config.height / 3) {
                this.platformGroup.setVelocityY(-gameOptions.platformSpeed * 1.1);
                this.windowGroup.setVelocityY(-gameOptions.platformSpeed * 1.1);
                this.goodSoundGroup.setVelocityY(-gameOptions.platformSpeed * 1.1);
            } else {
                this.platformGroup.setVelocityY(-gameOptions.platformSpeed);
                this.windowGroup.setVelocityY(-gameOptions.platformSpeed);
                this.goodSoundGroup.setVelocityY(-gameOptions.platformSpeed);
            }
        }   
    }
}
