/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameObjects } from 'phaser';

import { EventBus } from '../EventBus';
import { PlayerSettings } from '../Domain/PlayerSettings';
import { BaseScene } from './BaseScene';
import { MenuFunction } from '../MenuFunction';
import { UserDataStorage } from '../../services/UserDataStorage';


export class MainMenu extends BaseScene
{
    
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    isPopupDisplayed: boolean;
    optionsPopup: Phaser.GameObjects.Container;
    creditsPopup: Phaser.GameObjects.Container;

    checkbox: Phaser.GameObjects.Image;
    isChecked: boolean = false;

    randomize: Phaser.GameObjects.Image;

    textBox: Phaser.GameObjects.DOMElement;
    colorPicker1: Phaser.GameObjects.DOMElement;
    colorPicker2: Phaser.GameObjects.DOMElement;
    colorPicker3: Phaser.GameObjects.DOMElement;

    superiorPrimary: GameObjects.Image;
    superiorSecondary: GameObjects.Image;
    accesories: GameObjects.Image;

    colors: string[] = [];
    firstNames: string[]= [];
    lastNames: string[]= [];

    catmull: GameObjects.Particles.ParticleEmitter;
    dataAccess:UserDataStorage;
    playerSettings:PlayerSettings | null;
    constructor ()
    {
        super('MainMenu');
        this.isChecked = true;
        this.dataAccess = new UserDataStorage();
        
        
    }

    preload() {
        
        this.load.image('menuBackground', 'assets/menu.png');
        this.load.image('buttonLeft', 'assets/left.png');
        this.load.image('buttonRight', 'assets/right.png');
        this.load.image('buttonMid', 'assets/middle.png');
        this.load.image('checkboxCheck', 'assets/checked.png');
        this.load.image('checkboxUncheck', 'assets/unchecked.png');
        this.load.image('randomize', 'assets/randomize.png');
        this.load.image('customCursor', 'assets/cursor.png');
        this.load.image('superiorPrimary', 'assets/Character/primary.png');
        this.load.image('superiorSecondary', 'assets/Character/secondary.png');
        this.load.image('superiorSecondary2', 'assets/Character/secondary2.png');
        this.load.image('accesories', 'assets/Character/accesories.png');
        // this.load.image('superior', 'assets/superior2.jpg');
        this.load.image('spark', 'assets/particles/electric_small.png');
        this.load.json('settings', 'assets/Config/Settings.json');
        this.load.image('gamelogo', 'assets/gamelogo2.png');
        
        this.load.audio('bgMusic1', 'assets/Audio/battleThemeB.mp3');
        this.load.audio('bgMusic2', 'assets/Audio/battleThemeA.mp3');
        this.load.audio('bgMusic3', 'assets/Audio/SuperHero.ogg');
        
    }

    create ()
    {
        this.playerSettings = this.dataAccess.readLocal();
        
        if(this.sound.getAllPlaying().find(x => x != this.bgMusic)) {
            this.sound.stopAll();
        }
        this.playDefaultMusic();

        const settings = this.cache.json.get('settings');
        this.colors = settings.colors;
        this.firstNames = settings.firstNames;
        this.lastNames = settings.lastNames;

        const formContainer = this.add.container(200, 200);
        formContainer.depth = 1;
        
        
        // Add a title
        const nameLabel = this.add.text(-100, 400, 'Superior Name', { fontSize: '20px', color: '#fff', fontFamily: 'unicephalon' });
        formContainer.add(nameLabel);

        const capeLabel = this.add.text(-100, 120, 'Wears a Cape?', { fontSize: '20px', color: '#fff', fontFamily: 'unicephalon' });
        formContainer.add(capeLabel);

        const primaryColorLabel = this.add.text(-100, 190, 'Primary Color', { fontSize: '20px', color: '#fff', fontFamily: 'unicephalon' });
        formContainer.add(primaryColorLabel);

        const secondaryColorLabel = this.add.text(-100, 260, 'Secondary Color', { fontSize: '20px', color: '#fff', fontFamily: 'unicephalon' });
        formContainer.add(secondaryColorLabel);

        const accesoriesLabel = this.add.text(-100, 330, 'Accessories', { fontSize: '20px', color: '#fff', fontFamily: 'unicephalon' });
        formContainer.add(accesoriesLabel);
        // Add a textbox for letters only
        this.textBox = this.add.dom(325, 410).createFromHTML(
            `<input type="text" id="supName" maxlength="30" title="Letters only" style="width: 350px; padding: 10px; font-size: 35px; font-family: 'karisma'; background-color:#5608B5; color:#00FF04;">`
        );
        this.textBox.addListener('input').on('input', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const texBoxInput:any = this.textBox.getChildByID('supName') ; 
            const inputValue = texBoxInput.value.toUpperCase();
            const filteredValue = inputValue.replace(/[^a-zA-Z\s]/g, '').toUpperCase();

            if (filteredValue !== inputValue) {
                // Update the textbox value with the filtered value
                texBoxInput.value = filteredValue;
            }
            else {
                texBoxInput.value = inputValue;
            }
        });
        this.textBox.setDepth(2);
        formContainer.add(this.textBox);

        this.checkbox = this.add.image(165, 130, 'checkboxCheck').setInteractive();
        this.checkbox.on('pointerdown', () => {
            // Toggle isChecked flag
            this.isChecked = !this.isChecked;

            // Change checkbox image based on isChecked flag
            if (this.isChecked) {
                this.checkbox.setTexture('checkboxCheck');
            } else {
                this.checkbox.setTexture('checkboxUncheck');
            }

            // Your logic for handling checkbox state change goes here
            // For example, you can adjust game settings based on checkbox state
        });
        formContainer.add(this.checkbox);

        this.randomize = this.add.image(550, 410, 'randomize').setInteractive();
        this.randomize.on('pointerover', () => {
            this.randomize.setTint(0x0ae6ff);

        });
        this.randomize.on('pointerout', () => {
            this.randomize.clearTint();
            // button.fillStyle(0x666666, 1);
            // button.fillRoundedRect(x, y, 160, 40, 10);
        });
        this.randomize.on('pointerdown', () => {
            this.RandomizeColor(true);
            this.generateRandomSuperiorName();
        });

        formContainer.add(this.randomize);

        // Add color picker for the first color
        this.colorPicker1 = this.add.dom(165, 200).createFromHTML(
            `<input type="color" id="color1" name="color1" value="#ff0000" style="width: 50px; height: 50px;">`
        );

        this.colorPicker1.addListener('change').on('change', (event: PointerEvent) => {
            const target = event.target as HTMLInputElement;
            const newColor = target.value;
            const newColorHex = parseInt(newColor.slice(1), 16); 
            this.updatePrimaryColor(newColorHex);
        });
        this.colorPicker1.setDepth(2);
        formContainer.add(this.colorPicker1);

        // Add color picker for the second color
        this.colorPicker2 = this.add.dom(165, 270).createFromHTML(
            `<input type="color" id="color2" name="color2" value="#00ff00" style="width: 50px; height: 50px;">`
        );
        this.colorPicker2.addListener('change').on('change', (event: PointerEvent) => {
            const target = event.target as HTMLInputElement;
            const newColor = target.value;
            const newColorHex = parseInt(newColor.slice(1), 16); 
            this.updateSecondaryColor(newColorHex);
        });
        this.colorPicker2.setDepth(2);
        formContainer.add(this.colorPicker2);



        this.colorPicker3 = this.add.dom(165, 340).createFromHTML(
            `<input type="color" id="color3" name="color3" value="#00ff00" style="width: 50px; height: 50px;">`
        );
        this.colorPicker3.addListener('change').on('change', (event: PointerEvent) => {
            const target = event.target as HTMLInputElement;
            const newColor = target.value;
            const newColorHex = parseInt(newColor.slice(1), 16); 
            this.updateAccesoriesColor(newColorHex);
        });
        this.colorPicker3.setDepth(2);
        formContainer.add(this.colorPicker3);


        


        this.buttonContainer = this.add.container(0, 0);
        this.buttonContainer.setDepth(1);
        const image = this.add.image(500, 400, 'menuBackground');
        const scaleRatioX = .6; // Adjust this value as needed
        const scaleRatioY = .8; // Adjust this value as needed
        image.setScale(scaleRatioX, scaleRatioY);
        this.add.graphics(image);
        // menuBg.setDepth(1);
        // Reduce the size of the background image
       

        // Set the size of the container based on the scaled background image
        
        this.input.setDefaultCursor('url(assets/cursor.png), pointer');

        this.background = this.add.image(512, 384, 'background');
        this.background.setDepth(-1);

        this.logo = this.add.image(552, 70, 'gamelogo').setDepth(100);
        this.logo
        this.title = this.add.text(220, 270, 'Customize Character', {
            fontFamily: 'karisma', fontSize:35, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        const defaultTint = 0x0026ff;
        const nextScene = this.playerSettings?.power? 'Game' : 'PunchTest';
        this.addButton(-150, 30, 1, 80,'START', 'buttonLeft', () => this.handleButtonClick(nextScene, null, true), 0xff5900);

        // Add Options button
        this.addButton(80, 30, 1, 80,'LEADERBOARD', 'buttonMid', () => this.handleButtonClick('LeaderBoard', null, false), defaultTint);

        // Add Credits button
        this.addButton(310, 30, 1, 80,'CONTROLS', 'buttonMid',() => this.handleButtonClick('ControlsScene', null, false), defaultTint);
        
        // Add Exit button
        this.addButton(540, 30, 1, 80,'CREDITS', 'buttonRight', () => this.handleButtonClick('CreditsScene', null, false), defaultTint);

        // Initialize popups
        this.initPopups();
        
        this.buttonContainer.setPosition(250, 100);
        this.input.on('pointerdown', this.handleClickOutsidePopup, this);



        // character image
        this.superiorPrimary = this.add.image(600, 370, 'superiorPrimary');
        this.superiorPrimary.setTint(0x39fa00)
        this.superiorPrimary.setScale(.5);
        this.superiorPrimary.setDepth(3);

        this.superiorSecondary = this.add.image(600, 370, 'superiorSecondary');
        this.superiorSecondary.setTint(0xff0203)
        this.superiorSecondary.setScale(.5);
        this.superiorSecondary.setDepth(3);

        this.accesories = this.add.image(600, 370, 'accesories');
        this.accesories.setTint(0xb425f3)
        this.accesories.setScale(.5);
        this.accesories.setDepth(3);



        
        this.RandomizeColor();
        this.generateRandomSuperiorName();

        this.catmull = this.add.particles(100, 100, 'spark', {
            x: { values: [ 630, 450, 650, 400, 650 ], interpolation: 'bezier' },
            lifespan: 2500,
            gravityY: .5,
            speed: 200,
            scale: { start: 1.5, end: 1 },
            angle: { min: 0, max: 90 },
            frequency: 50,
            emitting: false,
            blendMode: 'ADD',
            quantity: 1,
        });
        this.catmull.emitting = true;
        this.catmull.setDepth(0);
        // //character effects
        // const emitZone1 = { type: 'edge', source: superior.getBounds(), quantity: 142 };
        // // const emitZone1 = { type: 'random', source: new Phaser.Geom.Circle(0, 0, 20) , quantity: 42 };
        // const sparks = this.add.particles(0, 0, 'spark', {
        //     x: 400, // x position of the emitter
        //     y: 300, // y position of the emitter
        //     speed: { min: -100, max: 100 }, // velocity range for sparks
        //     angle: { min: 0, max: 360 }, // angle range for sparks
        //     scale: { start: 1.5, end: .5 }, // scale range for sparks
        //     blendMode: 'ADD', // blend mode for the sparks
        //     lifespan: 1000, // lifespan of each spark particle
        //     frequency: 50, // frequency of emitting sparks
        //     quantity: 5, // number of sparks emitted per emission
        //     // emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 20) } // emit zone for sparks
        //     emitZone: [emitZone1]
        // });
        
        // // Create a graphics object for the electricity lines
        // // Create a graphics object for the lightning lines
        // const graphics = this.add.graphics();
        // graphics.lineStyle(2, 0xffffff); // Set line style

        // // Define the starting point for the lightning
        // let startX = 400;
        // let startY = 100;

        // // Draw the lightning lines
        // graphics.moveTo(startX, startY);
        // for (let i = 0; i < 10; i++) {
        //     const endX = startX + Phaser.Math.Between(-20, 20);
        //     const endY = startY + Phaser.Math.Between(20, 50);
        //     graphics.lineTo(endX, endY);
        //     startX = endX;
        //     startY = endY;
        // }

        // sparks.startFollow(graphics);
        // // Update the emitter position along the lightning lines
        // // sparkEmitter.startFollow(graphics);

        // // Animate the lightning lines
        // this.tweens.add({
        //     targets: graphics,
        //     alpha: { value: 0, duration: 100, yoyo: true, repeat: -1 }
        // });
        EventBus.emit('current-scene-ready', this);
    }

    private disposeScene() {
        this.colorPicker1.destroy();
        this.colorPicker2.destroy();
        this.colorPicker3.destroy();
        this.textBox.destroy();
    }

    private RandomizeColor = (override:boolean = false) => {
        
        const colorPicker1Input: any = this.colorPicker1.getChildByID('color1');
        const colorPicker2Input: any = this.colorPicker2.getChildByID('color2');
        const colorPicker3Input: any = this.colorPicker3.getChildByID('color3');
        if (!this.playerSettings?.name || override) {
            
            const randomColor1 = this.getRandomColor();
            const randomColor2 = this.getRandomColor();
            const randomColor3 = this.getRandomColor();
    
            colorPicker1Input.value = randomColor1;
            colorPicker2Input.value = randomColor2;
            colorPicker3Input.value = randomColor3;
    
            this.updatePrimaryColor(parseInt(randomColor1.slice(1), 16));
            this.updateSecondaryColor(parseInt(randomColor2.slice(1), 16));
            this.updateAccesoriesColor(parseInt(randomColor3.slice(1), 16));
        }
        else {
            console.log('else');
            this.updatePrimaryColor(this.playerSettings.primaryColor);
            this.updateSecondaryColor(this.playerSettings.secondaryColor);
            this.updateAccesoriesColor(this.playerSettings.accessoriesColor);
            colorPicker1Input.value = this.hexToHashString(this.playerSettings.primaryColor);
            colorPicker2Input.value = this.hexToHashString(this.playerSettings.secondaryColor);
            colorPicker3Input.value = this.hexToHashString(this.playerSettings.accessoriesColor);
        }
        
    }

    hexToHashString(hex: number): string {
        // Convert the hexadecimal number to a string
        let hexString = hex.toString(16);
        // Ensure the string has 6 characters (for RGB colors)
        while (hexString.length < 6) {
            hexString = '0' + hexString;
        }
        // Prepend '#' to the string
        return '#' + hexString;
    }

    generateRandomSuperiorName() {
        if (!this.playerSettings?.name) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const superiorTextBox:any = this.textBox.getChildByID('supName');
            const randomNameIndex = Math.floor(Math.random() * (this.firstNames.length));
            const randomLastNameIndex = Math.floor(Math.random() * (this.lastNames.length));
            superiorTextBox.value = `${this.firstNames[randomNameIndex]} ${this.lastNames[randomLastNameIndex]}`.toUpperCase() ;
        } else {
            const superiorTextBox:any = this.textBox.getChildByID('supName');
            superiorTextBox.value = this.playerSettings.name;
        }
    }
    updateSecondaryColor(newColor: number) {
        this.superiorSecondary.setTint(newColor)
    }

    updatePrimaryColor(newColor: number) {
        this.superiorPrimary.setTint(newColor)
    }

    updateAccesoriesColor(newColor: number) {
        this.accesories.setTint(newColor)
    }

    getRandomColor(): string {
        // Generate a random index to select a color from the array
        const randomIndex = Phaser.Math.Between(0, this.colors.length-1);
        return this.colors[randomIndex];
    }
    
    handleButtonClick = (sceneKey: string | null, callback: MenuFunction | null, savesData:boolean) => {
        if (sceneKey) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const texBoxInput:any = this.textBox.getChildByID('supName') ;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const colorPicker1Input:any = this.colorPicker1.getChildByID('color1');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const colorPicker2Input:any = this.colorPicker2.getChildByID('color2');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const colorPicker3Input:any = this.colorPicker3.getChildByID('color3');

            const sceneData:PlayerSettings = this.playerSettings?.name? this.playerSettings : new PlayerSettings() ;
            sceneData.name = texBoxInput.value;
            sceneData.primaryColor = parseInt(colorPicker1Input.value.slice(1), 16);
            sceneData.secondaryColor = parseInt(colorPicker2Input.value.slice(1), 16);
            sceneData.accessoriesColor = parseInt(colorPicker3Input.value.slice(1), 16);
            sceneData.wearsCape = this.isChecked;

            if (sceneData && savesData) {
                console.log('menu');
                console.log(sceneData);
                this.dataAccess.upsertLocal(sceneData);
            }
            this.disposeScene();
            this.children.removeAll();
            this.scene.start(sceneKey, sceneData);
        } else if (callback) {
            callback();
        }
    }


    initPopups() {
        // Options popup
        const depth = 2;
        this.optionsPopup = this.add.container(350, 300);
        this.optionsPopup.setDepth(depth);
        this.optionsPopup.setAlpha(0); // Initially hide the popup
        const optionsBackground = this.add.graphics();
        optionsBackground.fillStyle(0x000000, 0.8);
        optionsBackground.fillRect(-100, -100, 600, 400);
        optionsBackground.setDepth(depth);
        this.optionsPopup.add(optionsBackground);
        const optionsText = this.add.text(-60, -50, 'Options Popup', { fontSize: '24px', color: '#fff' });
        this.optionsPopup.add(optionsText);

        
        // Credits popup
        this.creditsPopup = this.add.container(350, 300);
        this.creditsPopup.setDepth(depth);
        this.creditsPopup.setAlpha(0); // Initially hide the popup
        const creditsBackground = this.add.graphics();
        creditsBackground.fillStyle(0x000000, 0.8);
        creditsBackground.fillRect(-100, -100, 600, 400);
        creditsBackground.setDepth(depth);
        this.creditsPopup.add(creditsBackground);
        const creditsText = this.add.text(-70, -50, 'Credits Popup', { fontSize: '24px', color: '#fff' });
        this.creditsPopup.add(creditsText);

    }

    showOptionsPopup = () => {

        this.tweens.add({
            targets: this.optionsPopup,
            alpha: 1,
            duration: 300,
            ease: 'Linear',
            onComplete: () => { this.isPopupDisplayed = true; }
        });
    }

    showCreditsPopup = () => {
        
        this.tweens.add({
            targets: this.creditsPopup,
            alpha: 1,
            duration: 300,
            ease: 'Linear',
            onComplete: () => { this.isPopupDisplayed = true; }
        });
    }

    handleClickOutsidePopup = (pointer: Phaser.Input.Pointer) =>{

        
        const optionsBounds = this.optionsPopup.getBounds();
        const creditsBounds = this.creditsPopup.getBounds();
        if (!optionsBounds.contains(pointer.x, pointer.y) 
            && !creditsBounds.contains(pointer.x, pointer.y)
            && (this.optionsPopup.visible
            || this.optionsPopup.visible)) {

            this.optionsPopup.setAlpha(0);
            this.creditsPopup.setAlpha(0);
            this.isPopupDisplayed = false;
        }
        
    }

    handleExit = () => {
        // Handle exit logic (e.g., close the game window)
        // This is a placeholder. Implement your own exit logic.
    }

    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('PunchTest');
    }

    moveLogo (vueCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        } 
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback)
                    {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
