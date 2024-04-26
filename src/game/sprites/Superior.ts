import Phaser, { GameObjects } from "phaser";
import { AnimatedSprite } from "../scenes/AnimatedSprite";
import { PlayerSettings } from "../Domain/PlayerSettings";

export default class Superior extends Phaser.GameObjects.Sprite {
    private animatedSprite:AnimatedSprite;
    // superiorPrimary: GameObjects.Image;
    // superiorSecondary: GameObjects.Image;
    private accesories: GameObjects.Image;
    private settings:PlayerSettings;
    private portal:Phaser.GameObjects.Particles.ParticleEmitter;
    private tweens:Phaser.Tweens.Tween[] = [];
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, initSettings:PlayerSettings, animationDuration:number, finalYposition:number) {
        super(scene, x, y, texture);
        
        const initialScale = .1;
        const finalScale = 1;
        //const animationDuration = 5000;
        //const finalYposition = 500;

        this.settings = initSettings;
        this.scale = initialScale;

        this.setDepth(1);
        // Add enemy to the scene
        scene.add.existing(this);
        this.setInteractive();
        this.setTint(this.settings.primaryColor);
        //this.superiorSecondary = scene.add.image(x, y, 'superiorSecondary');
        //this.superiorSecondary.setTint(settings.secondaryColor);
        
        //this.superiorSecondary.setDepth(3);
       
        this.accesories = scene.add.image(x, y, 'accesories');
        this.accesories.setTint(this.settings.accessoriesColor);
        this.accesories.scale = initialScale;
        this.accesories.setDepth(1);
        //this.accesories.setOrigin(0);

        const textureKeys = ['superiorSecondary','superiorSecondary2'];
        
        // Load textures into the scene (assuming they are already loaded)
        const imageTextures = textureKeys.map(key => scene.textures.get(key));
        this.animatedSprite = new AnimatedSprite(scene, x, y, imageTextures);
        this.animatedSprite.setTint(this.settings.secondaryColor);
        this.animatedSprite.setScale(initialScale);
        this.animatedSprite.startAnimation(500, -1);
        //this.animatedSprite.on('pointerdown', this.handlePunch);
        this.animatedSprite.on('pointerout', () => {console.log('remove statistics')});
        this.animatedSprite.on('pointerover', () => {console.log('display statistics')});
        this.animatedSprite.setDepth(1);
        this.animatedSprite.removeInteractive();
        //this.animatedSprite.setOrigin(0);
        // Add animations if needed
        // this.anims.create({
        //     key: 'enemyAnimation',
        //     frames: scene.anims.generateFrameNumbers(texture, { start: 0, end: 3 }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        // Initialize properties
        // this.setScale(0.1);
        // this.setPosition(x, 0); // Start at y: 0

        const emitZone1 = { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 50) , quantity: 42 };
        
        this.portal = scene.add.particles(0, 0, 'spark', {
            x: this.x, // x position of the emitter
            y: this.y, // y position of the emitter
            speed: { min: -100, max: 100 }, // velocity range for sparks
            angle: { min: 0, max: 45 }, // angle range for sparks
            scale: { start: 1, end: 0 }, // scale range for sparks
            blendMode: 'ADD', // blend mode for the sparks
            lifespan: 1000, // lifespan of each spark particle
            frequency: 50, // frequency of emitting sparks
            quantity: 5, // number of sparks emitted per emission
            
            // emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 20) } // emit zone for sparks
            emitZone: [emitZone1],
            
        });

        this.portal.setPosition(0.5, 0.5);
        

        this.portal.setDepth(0);
        
        this.scene.time.addEvent({
            delay: 1500, // Update every second
            callback: this.closePortal,
            callbackScope: this,
            loop: false
        });

        // scene.input.on('pointermove', (pointer:Phaser.Input.Pointer) => {
        //     // Set the position of the emitter to follow the cursor
        //     portal.setPosition(pointer.x, pointer.y);

        //     // Emit particles from the cursor position
        //     portal.emitParticle(1);
        // });
        

        //Tween animation for scaling
        const tween1 = this.scene.tweens.add({
            targets: this,
            scale:finalScale,
            duration: animationDuration, // 5 seconds
            ease: 'Linear',
        });

        // Tween animation for position
        const tween2 = this.scene.tweens.add({
            targets: this,
            y: finalYposition, // End at y: finalYposition
            duration: animationDuration, // 5 seconds
            ease: 'Linear',
        });

        const tween3 = this.scene.tweens.add({
            targets: this.accesories,
            scale:finalScale,
            duration: animationDuration, // 5 seconds
            ease: 'Linear',
        });

        // Tween animation for position
        const tween4 = this.scene.tweens.add({
            targets: this.accesories,
            y: finalYposition, // End at y: finalYposition
            duration: animationDuration, // 5 seconds
            ease: 'Linear',
        });

        const tween5 = this.scene.tweens.add({
            targets: this.animatedSprite,
            scale:finalScale,
            duration: animationDuration, // 5 seconds
            ease: 'Linear',
        });

        // Tween animation for position
        const tween6 = this.scene.tweens.add({
            targets: this.animatedSprite,
            y: finalYposition, // End at y: finalYposition
            duration: animationDuration, // 5 seconds
            ease: 'Linear',
        });
        
        this.tweens.push(tween1);
        this.tweens.push(tween2);
        this.tweens.push(tween3);
        this.tweens.push(tween4);
        this.tweens.push(tween5);
        this.tweens.push(tween6);
    }

    disposeObject() {
        this.tweens.forEach(x => {
            x.stop();
            x.destroy();
        });
        this.portal.destroy();
        this.animatedSprite.disposeObjects();
        this.animatedSprite.destroy();
        this.accesories.destroy();
        
    }

    closePortal() {
        this.portal.stop();
    }
    // Add any additional enemy logic here
    update() {
        // Add enemy movement, AI, or other behavior
    }
}