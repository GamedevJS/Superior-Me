import { PlayerSettings } from '../Domain/PlayerSettings';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { BaseScene } from './BaseScene';

export class GameOver extends BaseScene
{
    private camera: Phaser.Cameras.Scene2D.Camera;
    private background: Phaser.GameObjects.Image;
    private gameOverText : Phaser.GameObjects.Text;
    private playerSettings:PlayerSettings;
    private blocker: Phaser.GameObjects.Rectangle;
    init(playerSettings:PlayerSettings) {
        this.playerSettings = playerSettings;
    }

    preload() {
        this.load.image('buttonLeft', 'assets/left.png');
        this.load.image('buttonRight', 'assets/right.png');
    }

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.camera = this.cameras.main
        //this.camera.setBackgroundColor(0xff0000);

        this.buttonContainer = this.add.container(0, 0);
        const background = this.add.image(512, 384, 'background');
        
        background.setDepth(-1);
        
        this.addButton(300, 30, 1, 80,'PLAY AGAIN', 'buttonLeft', () => this.handleButtonClick('Game', null),  0xff5900);
        this.addButton(530, 30, 1, 80,'MENU', 'buttonRight', () => this.handleButtonClick('MainMenu', null), 0x0026ff);

        

        this.gameOverText = this.add.text(512, 184, 'YOUR STATS', {
            fontFamily: 'unicephalon', fontSize: 64, color: '#0cd2f5',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.add.text(512, 384, `NEW POWER: ${this.playerSettings.power}`, {
            fontFamily: 'unicephalon', 
            fontSize: 45, 
            color: '#f7f5f7',
            stroke: '#69039c',
            strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.add.text(512, 484, `HEALTH: ${this.playerSettings.totalHealth}`, {
            fontFamily: 'unicephalon', fontSize: 45, color: '#0bdb43',
            
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        
        
        EventBus.emit('current-scene-ready', this);
    }

    handleButtonClick = (sceneKey: string | null, callback: (() => void) | null) => {
        if (sceneKey) {
            this.scene.start(sceneKey);
        } else if (callback) {
            callback();
        }
    }

    lockGameInteraction() {
        this.blocker = this.add.rectangle(0, 0, this.sys.canvas.width, this.sys.canvas.height, 0xffffffff, 0);
        this.blocker.setOrigin(0);
        
        // Disable input on the blocker initially
        this.blocker.setInteractive({ visible: false });

        // Listen for events to toggle interactivity of the blocker
        // For example, when certain events occur, enable or disable input on the blocker
        this.events.on('enableBlocker', () => {
            this.blocker.setInteractive();
        });

        this.events.on('disableBlocker', () => {
            if (this.blocker) {
                this.blocker.removeInteractive();
            }
        });

        this.time.delayedCall(2000, () => {
            this.events.emit('disableBlocker');
        });
    }

    changeScene ()
    {
        // this.scene.start('MainMenu');
        this.scene.start('MainMenu');
    }
}
