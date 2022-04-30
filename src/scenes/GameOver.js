class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    preload() {
        this.load.image("cloud", "./assets/stars.png");
    }

    create () {

        this.cloud = this.add.tileSprite(0, 0, 640, 480, "cloud").setOrigin(0, 0);

        // menu text configuration
        let menuConfig = {
            fontFamily: 'Impact',
            fontSize: '35px',
            color: '#00FFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'GAME OVER', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or (M) for Menu', menuConfig).setOrigin(0.5);
        
        // keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    }

    update () {
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start("PlayGame");
        }
        if (Phaser.Input.Keyboard.JustDown(keyM)) {
            this.scene.start("menuScene");
        }

        this.cloud.tilePositionY -= 2;
    }
}