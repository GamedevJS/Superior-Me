export class AnimatedSprite extends Phaser.GameObjects.Sprite {
    private imageTextures: Phaser.Textures.Texture[];
    private currentIndex:number;
    private frameInicialVelocity:number;
    private isBackDirection:boolean;
    private isFirstRun: boolean;
    private maxFrames:number;
    private minFrames:number;
    private timers:Phaser.Time.TimerEvent[] = [];
    constructor(scene: Phaser.Scene, x: number, y: number, imageTextures: Phaser.Textures.Texture[]) {
        super(scene, x, y, imageTextures[0]);

        // Store the array of image textures
        this.imageTextures = imageTextures;
        scene.add.existing(this);
        this.setInteractive();
    }

    create() {
        
    }
    
    disposeObjects() {
        this.timers.forEach(x => x.destroy());
    }

    playIddle() {
        this.setTexture(this.imageTextures[0].key);
    }

    startAnimation(duration: number, repeat:number) {
        
        const timer = this.scene.time.addEvent({
            delay: duration, 
            callback: this.nextFrame,
            callbackScope: this,
            repeat: repeat 
        });
        this.timers.push(timer);
    }

    startYoyoAnimation(duration: number, minFrames:number = 0, maxFrames:number = this.imageTextures.length) {
        
        // console.log('start');
        this.maxFrames = maxFrames;
        this.minFrames = minFrames;
        if (this.maxFrames > this.imageTextures.length) {
            this.maxFrames = this.imageTextures.length;
        }
        if (this.minFrames < 0) {
            this.minFrames = 0;
        }
        this.currentIndex = minFrames;
        this.frameInicialVelocity = duration;
        this.isBackDirection = true;
        this.isFirstRun = true;
        this.scene.time.addEvent({
            delay: 100, 
            callback: this.nextYoyoFrame,
            callbackScope: this,
            repeat: 1,
            
        });
    }

    private nextYoyoFrame() {
        if (this.currentIndex == this.minFrames && !this.isFirstRun) {
            return;
        }
        if ( this.frameInicialVelocity <= 0) {
            this.frameInicialVelocity = 1;
        }
        this.isFirstRun = false;
        if (this.currentIndex == 3) {
            this.isBackDirection = false;
        }
        if (this.currentIndex == this.minFrames -1) {
            this.isBackDirection = true;
        }
        if (this.isBackDirection) {
            // console.log('goingback:::');
            this.currentIndex += 1;
        }
        else {
            // console.log('goingfront:::');
            this.currentIndex -=1;
        }

        if (this.currentIndex >= 0 && this.currentIndex < this.maxFrames) {
            this.setTexture(this.imageTextures[this.currentIndex].key);
        }
        
        this.scene.time.addEvent({
            delay: this.frameInicialVelocity, 
            callback: this.nextYoyoFrame,
            callbackScope: this,
            repeat: 1, 
           
        });
        this.frameInicialVelocity -= 100;
        
    }

    private nextFrame() {
        // Get the index of the current texture
        const currentIndex = this.imageTextures.indexOf(this.texture);

        // Calculate the index of the next texture
        const nextIndex = (currentIndex + 1) % this.imageTextures.length;

        // Set the next texture
        
        this.setTexture(this.imageTextures[nextIndex].key);
    }
}