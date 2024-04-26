export class PowerIndicator {
    private scene: Phaser.Scene;
    private powerIndicator: Phaser.GameObjects.Graphics;
    private currentPower: number;
    private positionX:number;
    private minPower:number;
    private maxPower:number;
    private indicatorColor:number = 0xffffff;
    private powerNumber:Phaser.GameObjects.Text;
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, maxPower:number, indicatorColor:number, textToUpdate:Phaser.GameObjects.Text) {
        this.scene = scene;
        this.powerNumber = textToUpdate;
        this.indicatorColor = indicatorColor;
        this.positionX = x;
        this.maxPower = maxPower;
        this.minPower = maxPower * .2; //20% of maximum power
        this.powerIndicator = scene.add.graphics();
        this.drawIndicator(x, y, width, height);
        this.powerIndicator.alpha = 0.5;
        this.currentPower = 0; // Initialize current power to 0
        this.powerIndicator.setDepth(3);
    }


    disposeObject() {
        this.powerIndicator.destroy();
        this.powerNumber.destroy();
        
    }
    private drawIndicator(x: number, y: number, width: number, height: number) {
        this.powerIndicator.fillStyle(this.indicatorColor);
        this.powerIndicator.fillRect(x, y, width, height);
    }

    setVisible(visible:boolean) {
        this.powerIndicator.setVisible(visible);
    }

    animatePower(duration: number, scaleFactor: number) {
        
        this.currentPower = this.minPower; // Update the current power value
        this.scene.tweens.add({
            targets: this.powerIndicator,
            scaleX: [scaleFactor,0],
            duration: duration,
            yoyo: true,
            repeat: -1,
            ease: 'Quad.easeInOut',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onUpdate: (tween: Phaser.Tweens.Tween, target: any, key: string, current:number) => {
                target.x = this.positionX - current * this.positionX;
                this.currentPower =  Phaser.Math.Clamp(current/2 * this.maxPower, this.minPower, this.maxPower);
                //console.log(this.powerNumber);
                //console.log('current:::' + this.currentPower);
                this.powerNumber.text = `${Math.floor(this.currentPower)}`;
            }
           
        });
    }

    setPower(powerToDisplay:number) {
        this.minPower = powerToDisplay * .2;
        this.maxPower = powerToDisplay;
    }

    getCurrentPower(): number {
        return this.currentPower;
    }
}



