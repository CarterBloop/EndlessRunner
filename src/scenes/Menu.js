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
            fontFamily: 'Georgia',
            fontSize: '38px',
            //backgroundColor: '#000000',
            color: '#0000FF',
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
        //this.add.text(game.config.width/2, game.config.height/2, 'P1 rides with ←→ arrows & (F) to fire', menuConfig).setOrigin(0.5);
        //this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'P2 drags the mouse', menuConfig).setOrigin(0.5);
        //menuConfig.backgroundColor = '#00FF00';
        //menuConfig.color = '#000';
        //this.add.text(game.config.width/2, game.config.height/2 + borderUISize *2 + borderUISize*2 , 'Press ← for Farmhand or → for Cowboy', menuConfig).setOrigin(0.5);
  
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
  
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          this.scene.start("PlayGame");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          this.scene.start("PlayGame");    
        }
      }
}