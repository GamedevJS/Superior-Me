import { Scene } from "phaser";

export class BaseScene extends Scene {
    buttonContainer: Phaser.GameObjects.Container;
    bgMusic: Phaser.Sound.BaseSound;
    
    playDefaultMusic() {
        if (!this.bgMusic) {
            this.bgMusic = this.sound.add('bgMusic1', { loop: true, volume:.4 });
            //this.sound.stopAll();
        }
        
        if (!this.bgMusic.isPlaying)
        {

            this.bgMusic.play();
        }
    }

    playAssesmentMusic() {
        if (!this.bgMusic) {
            this.bgMusic = this.sound.add('bgMusic3', { loop: true, volume:.4 });
        }
        
        if (!this.bgMusic.isPlaying)
        {

            this.bgMusic.play();
        }
    }

    playMainGameMusic() {
        if (!this.bgMusic) {
            this.bgMusic = this.sound.add('bgMusic2', { loop: true, volume:.4 });
        }
        
        if (!this.bgMusic.isPlaying)
        {

            this.bgMusic.play();
        }
    }

    addButton(x: number, y: number, scaleXRatio:number, textMargin:number, text: string, buttonTexture:string, callback: () => void, tint:number) {

        const buttonImg = this.add.image(x,y, buttonTexture);
        buttonImg.setOrigin(0.2);
        const scaleRatioX = scaleXRatio; // Adjust this value as needed
        const scaleRatioY = .8; // Adjust this value as needed
        buttonImg.setScale(scaleRatioX, scaleRatioY);
        buttonImg.setTint(tint);
        this.buttonContainer.add(buttonImg);
        buttonImg.setDepth(3);
        const button = this.add.graphics();
        // button.fillStyle(0x666666, 1);
        // button.fillRoundedRect(x, y, 160, 40, 10); // Adjust the rounded corners radius as needed
        button.setInteractive(new Phaser.Geom.Rectangle(x, y, 200, 70), Phaser.Geom.Rectangle.Contains);
        button.on('pointerdown', () => {
            callback();
        });

        
        const buttonText = this.add.text(x + textMargin, y + 22, text, { fontSize: '40px', color: '#fff', align: 'center', fontStyle: 'bold', fontFamily: 'karisma' });
        buttonText.setOrigin(0.5);

        // Add a hover effect
        button.on('pointerover', () => {
            buttonImg.setTint(0x0ae6ff);
            // button.fillStyle(0x888888, 1);
            // button.fillRoundedRect(x, y, 160, 40, 10);
        });
        button.on('pointerout', () => {
            buttonImg.setTint(tint);
            // button.fillStyle(0x666666, 1);
            // button.fillRoundedRect(x, y, 160, 40, 10);
        });

        this.buttonContainer.add([button, buttonText]);
    }
}