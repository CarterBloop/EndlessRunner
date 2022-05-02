class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    
    preload() {
      // load audio/background
      this.load.image('background', './assets/sky.png');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Impact',
            fontSize: '27px',
            //backgroundColor: '#000000',
            color: '#FF0000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // show menu text
        this.add.image(450, 150, 'background');
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'WELCOME TO THE LOUD QUIET', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use <- or -> to control player movement left and right', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Use SPACE KEY to control player jump', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderUISize*2 , 'Press <- or -> arrow to start', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderUISize*2 + 50, 'Avoid bombs and the wind to stay on platform', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderUISize*2 + 100, 'Collide with the green animating powerup to advance up', menuConfig).setOrigin(0.5);

  
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
  
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          this.scene.start("PlayGame");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          this.scene.start("PlayGame");    
        }
      }
}