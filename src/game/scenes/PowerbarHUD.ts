export class PowerbarHUD extends Phaser.GameObjects.Container {
    private textures:string[];
    private powerbar: Phaser.GameObjects.Sprite;
    constructor(scene: Phaser.Scene, x: number, y: number, scaleX: number, scaleY: number, textures:string[]) {
        super(scene, x, y);
        this.scene = scene;
        this.textures = textures;

        
        const powerbarBackground = this.scene.add.image(0, 0, this.textures[0]);
        powerbarBackground.scaleX = scaleX;
        powerbarBackground.scaleY = scaleY;
        this.add(powerbarBackground);

        this.powerbar = this.scene.add.sprite(0, 0, this.textures[1]);
        this.powerbar.scaleX = scaleX;
        this.powerbar.scaleY = scaleY;
        this.add(this.powerbar);

        this.setDepth(2);
        scene.add.existing(this);
    }
    
}



