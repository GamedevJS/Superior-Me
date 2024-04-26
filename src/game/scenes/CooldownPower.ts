// Import necessary modules from Phaser
import Phaser from 'phaser';
// Define the Phaser scene
export class CooldownSprite extends Phaser.GameObjects.Sprite {
    private cooldownTimer: number;
    private cooldownGraphics: Phaser.GameObjects.Graphics;
    private cooldownSize: number;
    private cooldownX: number;
    private cooldownY: number;
    
    public cooldownDuration: number;
    public isInCooldown:boolean;
    onTimerComplete: () => void;
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, duration:number, shortcut:string, onTimerComplete: () => void) {
        super(scene, x, y, texture);

        this.onTimerComplete = onTimerComplete;
        this.isInCooldown = true;
        scene.add.existing(this);
        this.cooldownTimer = 0;
        this.cooldownDuration = duration; // Cooldown duration in milliseconds (e.g., 3000ms = 3 seconds)
        this.cooldownSize = 100; // Size of the cooldown square
        this.cooldownX = x - 50; // X-coordinate of the top-left corner of the cooldown square
        this.cooldownY = y - 50; // Y-coordinate of the top-left corner of the cooldown square

        // Create a graphics object for the cooldown square
        this.cooldownGraphics = this.scene.add.graphics();
        this.cooldownGraphics.setDepth(3);

        const shortcutText = this.scene.add.text(x-60, y-70, shortcut, { 
            fontSize: '30px',
            color: '#f7f5f7',
            stroke: '#69039c',
            strokeThickness: 10,
            fontFamily: 'unicephalon' 
        });
        shortcutText.setDepth(3);
        // Draw the initial cooldown square
        this.drawCooldownSquare(1); // Pass fill amount of 1 (full) initially
        // EventBus.emit('current-scene-ready', this);
    }

    update(time: number, delta: number) {
        // Update the cooldown timer
        if (this.isInCooldown) {

            this.cooldownTimer += delta;
    
            // Calculate the current fill amount based on the cooldown timer
            const fillAmount = 1 - (this.cooldownTimer / this.cooldownDuration);
    
            // Draw the updated cooldown square
            this.drawCooldownSquare(fillAmount);
    
            // Check if the cooldown is complete
            if (this.cooldownTimer > this.cooldownDuration) {
                // Cooldown is complete, perform cooldown-related action here
    
                // Reset the cooldown timer
                this.cooldownTimer = 0;
                this.isInCooldown = false;
                this.cooldownGraphics.clear();
                this.onTimerComplete();
                
            }
        }
    }

    drawCooldownSquare(fillAmount: number) {
        // Clear the previous cooldown square
        this.cooldownGraphics.clear();
    
        // Set the fill color and alpha for the square container
        this.cooldownGraphics.fillStyle(0xffffff, 0);
    
        // Draw the cooldown square
        this.cooldownGraphics.fillRect(this.cooldownX, this.cooldownY, this.cooldownSize, this.cooldownSize);
    
        // Set the fill color and alpha for the circular progress bar
        this.cooldownGraphics.fillStyle(0x00ff00, .5);
    
        // Calculate the radius of the circle
        const radius = this.cooldownSize / 2;
    
        // Calculate the center of the circle within the square
        const centerX = this.cooldownX + radius;
        const centerY = this.cooldownY + radius;
    
        // Calculate the start angle and sweep angle based on the fill amount
        const startAngle = Math.PI / 2; // Start at 90 degrees
        const endAngle = startAngle + (Phaser.Math.PI2 * fillAmount);
    
        // Draw the filled circular progress bar
        this.cooldownGraphics.beginPath();
        this.cooldownGraphics.moveTo(centerX, centerY);
        this.cooldownGraphics.arc(centerX, centerY, radius, startAngle, endAngle, false);
        this.cooldownGraphics.closePath();
        this.cooldownGraphics.fillPath();
    }
    
    
    
}

