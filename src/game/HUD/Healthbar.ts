export class HealthBar extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Graphics;
    private bar: Phaser.GameObjects.Graphics;
    private health: number;
    private healthColor:number;
    private fullHealth:number;
    private showHpText:boolean;
    private healthText:Phaser.GameObjects.Text;
    constructor(scene: Phaser.Scene, 
            x: number,
            y: number,
            width: number, 
            height: number, 
            maxValue: number, 
            showHpText:boolean,
            hpColor: number = 0x35dc35,
            backgroundColor:number = 0x272626) {
        super(scene, x, y);

        this.showHpText = showHpText;
        // Store width and height
        this.width = width;
        this.height = height;
        this.healthColor = hpColor;
        // Create the background for the health bar
        this.background = scene.add.graphics();
        this.background.fillStyle(backgroundColor); // Black color
        this.background.fillRect(0, 0, width, height);
        this.add(this.background);

        // Create the bar itself
        this.bar = scene.add.graphics();
        this.bar.fillStyle(0x000000); // Red color
        this.add(this.bar);

        // Set initial values
        this.health = maxValue;
        this.fullHealth = maxValue;
        this.setValue(this.health);
        // Add the container to the scene
        scene.add.existing(this);

        this.healthText = scene.add.text(x + this.width/2 - 25, y, `${this.health}`, { fontSize: '20px', color: '#ffffffff', fontFamily: 'unicephalon' });
        this.healthText.setDepth(3);
        this.healthText.setVisible(showHpText);

        this.setDepth(2);
    }

    disposeObject() {
        this.background.destroy();
        this.bar.destroy();
        this.healthText.destroy();
        this.destroy();
    }
    getTotalHealth() {
        return this.fullHealth;
    }

    getHealth() {
        return this.health;
    }

    Show(visible:boolean) {
        this.background.setVisible(visible);
        this.bar.setVisible(visible);
        this.healthText.setVisible(visible);
    }

    dealDamange(damage:number) {
        this.health = this.health - damage;
        if (this.health <= 0) {
            this.health = 0;
        }
        this.setValue(this.health);
        this.healthText.text = `${this.health}`;
    }

    setValue(value: number) {
        // Clamp the value to be within the range [0, maxValue]
        const clampedValue = Phaser.Math.Clamp(value, 0, this.fullHealth);
        // Update the bar width
        this.bar.clear();
        this.bar.fillStyle(this.healthColor); // Red color
        this.bar.fillRect(0, 0, (clampedValue / this.fullHealth) * this.width, this.height);
        
    }
}
