import { PlayerSettings } from "../Domain/PlayerSettings";
import { PowerIndicator } from "../scenes/PowerIndicator";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class PowerGlasses extends Phaser.GameObjects.Sprite {

    private playerSettings:PlayerSettings;
    private enemyTarget:PlayerSettings;
    private powerHud: PowerIndicator;
    private borderImage:Phaser.GameObjects.Image; 
    private powerNumber:Phaser.GameObjects.Text;
    private targetHealth:Phaser.GameObjects.Text;
    public isVisible:boolean = false;
    constructor(scene:Phaser.Scene, x:number, y:number, texture:string, borderTexture:string, color:number) {
        super(scene, x, y, texture);
        
        this.setTint(color);
        this.borderImage = this.scene.add.image(x,y, borderTexture);
        this.borderImage.setTint(color);
        this.borderImage.alpha = .5;
        this.alpha = .2;

        const scaleX = 1;
        const scaleY = 1;
        this.scaleX = scaleX;
        this.borderImage.scaleX = scaleX;

        this.scaleY = scaleY;
        this.borderImage.scaleY = scaleY;

        const depth = 0;
        this.setDepth(depth);
        this.borderImage.setDepth(depth);


        this.powerNumber = scene.add.text(156, 410, '', { fontSize: '40px', color: '#ffffffff', fontFamily: 'unicephalon' });
        this.powerNumber.setDepth(3);
        this.targetHealth = scene.add.text(156, 450, 'HP:', { fontSize: '40px', color: '#ffffffff', fontFamily: 'unicephalon' });
        this.targetHealth.setDepth(3);
        this.powerHud = new PowerIndicator(scene, 156, 390, 150, 20, 0, color, this.powerNumber);
        this.hideStats();
        //this.scale = .5;
        scene.add.existing(this);
    }

    disposeObject() {
        this.powerHud.disposeObject();
        this.borderImage.destroy();
        this.powerNumber.destroy();
        this.targetHealth.destroy();
        this.destroy();
    }

    getTargetPower() {
        return this.powerHud.getCurrentPower();
    }

    setPlayerSettings(playerSettings:PlayerSettings) {
        this.playerSettings = playerSettings;
    }
    

    hideStats() {
        this.powerNumber.setVisible(false);
        this.targetHealth.setVisible(false);
        this.powerHud.setVisible(false);
    }

    showStats() {
        if (this.isVisible) {

            this.powerNumber.setVisible(true);
            this.targetHealth.setVisible(true);
            this.powerHud.setVisible(true);
        }
    }

    hideGlasses() {
        this.setVisible(false);
        this.borderImage.setVisible(false);
        this.hideStats();
        this.isVisible = false;
    }

    showGlasses() {
        this.setVisible(true);
        this.borderImage.setVisible(true);
        this.isVisible = true;
        this.showStats();
    }

    setTargetEnemy(enemySettings:PlayerSettings) {
        this.enemyTarget = enemySettings;
        this.powerHud.setPower(enemySettings.power);
        const randomPowerTime = Phaser.Math.Between(300, 750);
        this.powerHud.animatePower(randomPowerTime, 2);
        this.targetHealth.text = `HP: ${enemySettings.totalHealth}`;
    }

    updateHealthStats(remainingHealth:number) {
        this.targetHealth.text = `HP: ${remainingHealth}`;
    }

}