import { EventBus } from "../EventBus";
import { AnimatedSprite } from "./AnimatedSprite";
import { PowerIndicator } from "./PowerIndicator";
import {PowerbarHUD} from "./PowerbarHUD";
import { HealthBar } from "../HUD/Healthbar";
import { PowerGlasses } from "../HUD/Powerglasses";
import { PlayerSettings } from "../Domain/PlayerSettings";
import { ActionTimer } from "../HUD/ActionTimer";
import { UserDataStorage } from "../../services/UserDataStorage";
import { BaseScene } from "./BaseScene";

export default class PunchTest extends BaseScene {

    readonly defaultInitPower:number = 200;
    readonly defaultInitHealth:number = 2000;
    readonly assesmentTimer = 25;
    readonly defaultPower = 40;

    private blocker: Phaser.GameObjects.Rectangle;
    private uiGameObjectsLocked: boolean = true;

    private animatedSprite: AnimatedSprite;
    private powerHud: PowerIndicator;
    private playerHealthBar: HealthBar;
    private cardboardHealthBar: HealthBar;
    private powerGlasses:PowerGlasses;
    private playerSettings:PlayerSettings;
    private enemyCardboardSettings: PlayerSettings;
    private punchPower:number;
    private levelDescription:Phaser.GameObjects.Text;
    private tutorialIndex = 0;
    private enableTutorialNavigation = false;
    private background: Phaser.GameObjects.Image;
    private qKey: Phaser.Input.Keyboard.Key;
    private qPressedFirstTime = false;
    private numberOfClicks = 0;
    private assesmentFinished = false;
    private powerRecords:number[]= [];
    private actionTimer:ActionTimer;
    private dataAccess:UserDataStorage;
    private punchingVfxs: Phaser.Sound.BaseSound[] = [];
    private onboardingTexts = ["Are you the superior version of yourself across different realms?\nWe will soon find out.\n" +
        "but before we need to measure your initial power level. \n\n(click dialogue to continue)",
        "Welcome to the Superior Assessment Center! \nDue to budget cuts, our villain simulation is... \nwell, it's a dummy.. \nBut don't let that stop you from unleashing your powers!\n(click dialogue to continue)",
        "Press the letter Q to activate your power glasses, \nit will allow you to see some valuable information about the superior\nyour are going to face." +
        "\nThen hover the mouse over the fearless cardboard to see\n its current power level.",
        "Now Time to defeat it, punch it as much as you can!! \nbeware that you can get damaged if you punch it when its power level\nis higher than yours.",
        "Congratulations!!, your power level is {0} \nThere are another habilites that you can activate pressing W, E and R.\nwhat they do?\nWell, you will find out during battle..\nor maybe not.. Good Luck!! \t\t (click to continue)",
        
    ]
    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init(playerSettings:PlayerSettings) {
        this.playerSettings = playerSettings;
        if(!this.playerSettings.totalHealth) {
            this.playerSettings.totalHealth = this.defaultInitHealth;
        }
    }

    constructor() {
        super("PunchTest");
        this.enemyCardboardSettings = new PlayerSettings();
        this.enemyCardboardSettings.name = "Cardboard dummy mannequin";
        
        this.enemyCardboardSettings.power = this.defaultInitPower;
        this.enemyCardboardSettings.totalHealth = this.defaultInitHealth;
        this.dataAccess = new UserDataStorage();
        this.assesmentFinished = false;
    }

    preload() {
        this.load.image("punchcardboard", "assets/Character/cardboardcolor.png");
        this.load.image("punchcardboardBack", "assets/Character/cardboardcolorBack.png");
        this.load.image("punchcardboardBack2", "assets/Character/cardboardcolorBack2.png");
        this.load.image("punchcardboardBack3", "assets/Character/cardboardcolorBack3.png");
        this.load.image("punchBg", "assets/bgPunchTest.png");


        this.load.image("rose", "assets/particles/rose.png");
        this.load.image("green", "assets/particles/GreenPortal2.png");
        this.load.spritesheet('punches', 'assets/particles/punchesSprites.png', {
            frameWidth: 400, // Width of each frame
            frameHeight: 400, // Height of each frame
            startFrame: 0, // Optional: Index of the first frame (default is 0)
            endFrame: -1, // Optional: Index of the last frame (default is -1, which loads all frames)
            margin: 0, // Optional: Margin between frames
            spacing: 0 // Optional: Spacing between frames
            
        });

        this.load.image('powerbarBg', "assets/progressBarEmpty.png");
        this.load.image('powerbarcontent', "assets/progressBarColorized.png");
        this.load.image('powerGlasses', "assets/Character/PowerGlasses.png");
        this.load.image('powerGlassesBorder', "assets/Character/PowerGlassesBorder.png");
        this.load.image('comicPanel', 'assets/ComicPanel.png');
        this.load.audio('punch1', 'assets/Audio/body_hit_small_11.wav');
        this.load.audio('punch2', 'assets/Audio/body_hit_small_23.wav');
        this.load.audio('punch3', 'assets/Audio/face_hit_small_23.wav');
        this.load.audio('punchSpecial', 'assets/Audio/fire_punch_02.wav');
        
    }

    create() {

        this.sound.stopAll();
        this.playAssesmentMusic();
        
        this.background = this.add.image(512, 384, 'background');
        this.background.setDepth(-1);
        
        this.input.on('pointerdown', () => {
            if (this.assesmentFinished && !this.uiGameObjectsLocked) {
                this.children.removeAll();
                this.scene.start("Game", this.playerSettings);
            }
        }, this);


        const description = this.onboardingTexts[0];
        this.levelDescription = this.add.text(50, -300, description, {
            fontSize: '32px',
            color: '#000000',
            fontStyle: 'Bold',
            align: 'left', 
            fontFamily: 'steel-city'
        });

        this.levelDescription.setDepth(2);

        const comicPanel = this.add.image(0, -300, "comicPanel");
        comicPanel.setInteractive();
        comicPanel.scaleX = 2;
        comicPanel.setDepth(1);
        comicPanel.setOrigin(0);
        comicPanel.on('pointerdown', () => {
            this.numberOfClicks += 1;
            if (this.tutorialIndex < this.onboardingTexts.length-1
                //if clicked more than 16, workaround when event is corrupted by changing tabs during animation
                && (this.enableTutorialNavigation || (this.numberOfClicks>= 16 && this.tutorialIndex == 0))) {
                this.displayNextTutorialText();
            }
        });

        this.tweens.add({
            targets: comicPanel,
            y: 0,
            duration: 3000,
            ease: 'Power3'
        });

        this.tweens.add({
            targets: this.levelDescription,
            y: 30,
            duration: 3000,
            ease: 'Power3'
        });
        //this.levelDescription.setOrigin(.1);
        // const cardboard = this.add.image(550, 450, 'punchcardboard').setInteractive();
        // cardboard.setScale(.7, .7);
        // this.add.graphics(cardboard);
        // cardboard.on('pointerdown', () => {console.log('hey there2!')}, this);

        
        this.time.addEvent({
            delay: 3500, // Update every second
            callback: this.nextAction,
            callbackScope: this,
            loop: false
        });


        //this.createGame();

        
        EventBus.emit('current-scene-ready', this);
    }

    private displayNextTutorialText(textParam:string = '') {
        this.tutorialIndex += 1;
        let nextDescription = this.onboardingTexts[this.tutorialIndex];
        if (nextDescription.indexOf('{0}')) {
            nextDescription = nextDescription.replace('{0}', textParam);
        }
        this.levelDescription.text = nextDescription;
        this.enableTutorialNavigation = false;
        this.nextTutorialStep();
    }

    private mapKeys() {
        if (this.input?.keyboard) {

            this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
            // Listen for the "down" event on the "Q" key
            this.qKey.on('down', () => {
                this.powerGlasses.showGlasses();
                this.powerGlasses.hideStats();
                if (!this.qPressedFirstTime) {

                    this.enableTutorialNavigation = true;
                    const finalPower = this.calculatePowerAvg()
                    this.displayNextTutorialText(finalPower.toString());
                    this.qPressedFirstTime = true;
                    this.displayAssesmentTimer();
                    this.events.emit('disableBlocker');
                }
            });
        }
    }

    private displayAssesmentTimer() {

        this.actionTimer = new ActionTimer(this,20, 220, 'Remaining time','#000000', this.assesmentTimer, () => { 
            this.finalizeAssesment();
        });
        this.actionTimer.start();
    }

    private finalizeAssesment() {
        this.enableTutorialNavigation = true;
        this.actionTimer.setVisible(false);
        this.displayPowerResults();
    }

    private nextTutorialStep() {
        if (this.tutorialIndex == 1) {
            this.background = this.add.image(500, 400, 'punchBg');
            const scaleRatioX = 1.1; // Adjust this value as needed
            const scaleRatioY = 1.1; // Adjust this value as needed
            this.background.setScale(scaleRatioX, scaleRatioY);
            this.add.graphics(this.background);
            this.lockGameInteraction();
            this.createGame();
            this.enableTutorialNavigation = true;
        }
        else if (this.tutorialIndex == 2) {
            this.mapKeys();
        }
    }

    private nextAction() {
        this.enableTutorialNavigation = true;
    }
    private createGame() {
        const emitter = this.add.particles(400, 250, 'punches', {
            frame: [0, 1, 2, 3, 4],
            lifespan: 250,
            speed: { min: 150, max: 250 },
            scale: { start: .2, end: .8 },
            gravityY: 150,
            blendMode: 'SCREEN',
            emitting: false,
        });

        if (this.punchingVfxs.length <= 0) {

            this.punchingVfxs.push(this.sound.add('punch1', { loop: false }));
            this.punchingVfxs.push(this.sound.add('punch2', { loop: false }));
            this.punchingVfxs.push(this.sound.add('punch3', { loop: false }));
        }


        const damageDoneText = this.add.text(700, 400, '', { fontSize: '40px', color: '#03fc35', fontFamily: 'unicephalon' });
        const damageReceivedText = this.add.text(700, 450, '', { fontSize: '40px', color: '#ff0000', fontFamily: 'unicephalon' });
        damageDoneText.setDepth(1);
        damageReceivedText.setDepth(1);
        const powerbar = new PowerbarHUD(this, 500, 700, 2, 1.3, ['powerbarBg', 'powerbarcontent']);
        this.add.existing(powerbar);

        emitter.on('complete', () => {
            damageDoneText.text = '';
            damageReceivedText.text = '';
            //console.log('Particle emission complete');
            // Your completion callback logic here
        });

        const currentPowerText = this.add.text(710, 690, '', {
            fontSize: '40px',
            color: '#f7f5f7',
            fontFamily: 'unicephalon',
            stroke: '#69039c',
            strokeThickness: 10
        });
        currentPowerText.setDepth(3);

        const randomPowerTime = Phaser.Math.Between(400, 700);
        this.powerHud = new PowerIndicator(this, 306, 690, 198, 20, 200, 0xfffffff, currentPowerText);
        this.powerHud.animatePower(randomPowerTime, 2);

        this.powerGlasses = new PowerGlasses(this, 510, 550, 'powerGlasses', 'powerGlassesBorder', this.playerSettings.accessoriesColor);
        this.powerGlasses.setPlayerSettings(this.playerSettings);
        this.powerGlasses.setTargetEnemy(this.enemyCardboardSettings);
        this.powerGlasses.hideGlasses();
        this.playerHealthBar = new HealthBar(this, 305, 720, 390, 25, 2000, true, 0x35dc35, 0xc8000a);
        this.cardboardHealthBar = new HealthBar(this, 390, 290, 200, 20, 2000, false, 0xc8000a);


        const textureKeys = ['punchcardboard', 'punchcardboardBack', 'punchcardboardBack2', 'punchcardboardBack3'];

        // Load textures into the scene (assuming they are already loaded)
        const imageTextures = textureKeys.map(key => this.textures.get(key));

        this.animatedSprite = new AnimatedSprite(this, 500, 500, imageTextures);
        this.animatedSprite.setScale(.5);
        this.animatedSprite.playIddle();
        this.animatedSprite.on('pointerdown', this.handlePunch);
        this.animatedSprite.on('pointerout', () => {
            this.powerGlasses.hideStats();
        });
        this.animatedSprite.on('pointerover', () => {
            this.powerGlasses.showStats();
        });

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const cardboardBounds = this.animatedSprite.getBounds();
            if (cardboardBounds.contains(pointer.x, pointer.y)
                && !this.uiGameObjectsLocked) {

                // Get the current power value
                const currentPower = this.powerHud.getCurrentPower();
                const playerPower = Math.floor(currentPower);
                const enemyPower = Math.floor(this.powerGlasses.getTargetPower());
                
                this.powerRecords.push(playerPower);
                const playerHealth = this.playerHealthBar.getHealth();
                let enemyHealth = this.cardboardHealthBar.getHealth();
                if (playerHealth > 0 && enemyHealth > 0) {
                    if (playerPower < enemyPower) {
                        damageReceivedText.text = `-${enemyPower}`;
                        this.playerHealthBar.dealDamange(playerPower);

                    } else if (playerPower > enemyPower) {
                        damageDoneText.text = `${playerPower}`;
                        this.cardboardHealthBar.dealDamange(playerPower);
                        enemyHealth = this.cardboardHealthBar.getHealth();
                        this.powerGlasses.updateHealthStats(enemyHealth);
                    }
                }
                if (playerHealth <= 0 || enemyHealth <= 0) {
                    this.finalizeAssesment();
                }




                this.punchPower = playerPower;
                emitter.setX(pointer.x);
                emitter.setY(pointer.y);
                emitter.explode(1);
            }


        });

        this.input.on('pointerover', (pointer: Phaser.Input.Pointer) => {
            const cardboardBounds = this.animatedSprite.getBounds();
            if (cardboardBounds.contains(pointer.x, pointer.y)) {
                //console.log('display: enemy info')
            }
        });
    }

    displayPowerResults() {
        if (!this.assesmentFinished) {
            this.events.emit('enableBlocker');
            this.time.delayedCall(1000, () => {
                this.events.emit('disableBlocker');
            });

            const finalPower = this.calculatePowerAvg();
            this.playerSettings.power = finalPower;
            this.displayNextTutorialText(finalPower.toString());
            const resultsPanel = this.add.rectangle(500, 500, 800, 500, 0x0e0578, 0.9);
            const resultText = this.add.text(300, 350, `POWER: ${finalPower}`, {
                fontSize: '55px',
                color: '#00db0f',
                fontStyle: 'Bold',
                align: 'left', 
                fontFamily: 'unicephalon'
            });

            const noticeText = this.add.text(300, 450, 'This is your initial power,\nYou will get stronger by defeating\nother superior versions like you.', {
                fontSize: '35px',
                color: '#820580',
                fontStyle: 'Bold',
                align: 'center', 
                fontFamily: 'steel-city'
            });
            // resultsPanel.setOrigin(0.5);
            resultText.setDepth(5);
            resultsPanel.setDepth(5);
            noticeText.setDepth(5);
            this.dataAccess.upsertLocal(this.playerSettings);
            this.assesmentFinished = true;
        }

    }

    private calculatePowerAvg() {
        let finalPower = this.defaultPower;
        if (this.powerRecords.length >= 1) {

            finalPower = this.powerRecords.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / this.powerRecords.length;
            finalPower = Math.floor(finalPower);
        }
        return finalPower;
    }

    lockGameInteraction() {
        this.blocker = this.add.rectangle(0, 0, this.sys.canvas.width, this.sys.canvas.height, 0x000000, 0);
        this.blocker.setOrigin(0);
        
        // Disable input on the blocker initially
        this.blocker.setInteractive({ visible: false });

        // Listen for events to toggle interactivity of the blocker
        // For example, when certain events occur, enable or disable input on the blocker
        this.events.on('enableBlocker', () => {
            this.uiGameObjectsLocked = true;
            this.blocker.setInteractive();
        });

        this.events.on('disableBlocker', () => {
            this.uiGameObjectsLocked = false;
            if (this.blocker) {
                console.log('remove interactive')
                this.blocker.removeInteractive();
            }
        });

        // // Example: Enable the blocker after 3 seconds
        // this.time.delayedCall(5000, () => {
        //     this.events.emit('disableBlocker');
        // });
    }

    handlePunch = () => {
        if (this.uiGameObjectsLocked) {
            return false;
        }

        // if(!this.punchingVfxs.find(x => x.isPlaying)) {

        const soundIndex = Phaser.Math.Between(0, this.punchingVfxs.length-1);
        this.punchingVfxs[soundIndex].play();
        // }
        this.time.addEvent({
            delay: 100, 
            callback: this.startPendule1,
            callbackScope: this,
            repeat: 1 
        });
        
        // this.time.addEvent({
        //     delay: 200, 
        //     callback: this.startPendule2,
        //     callbackScope: this,
        //     repeat: 1 
        // });

        // this.time.addEvent({
        //     delay: 200, 
        //     callback: this.startPendule3,
        //     callbackScope: this,
        //     repeat: 1 
        // });
        
    }

    startPendule1() {
        this.animatedSprite.startYoyoAnimation(200);
    }

    startPendule2() {
        this.animatedSprite.startYoyoAnimation(500,1);
    }

    startPendule3() {
        this.animatedSprite.startYoyoAnimation(2000);
    }

    changeScene ()
    {
        this.scene.start('Game');
    }
}