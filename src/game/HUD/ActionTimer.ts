export class ActionTimer {
    
    scene: Phaser.Scene;
    timer: Phaser.Time.TimerEvent;
    remainingTime: number;
    timerText: Phaser.GameObjects.Text;
    textToDisplay:string;
    onTimerComplete: () => void;

    constructor(scene: Phaser.Scene, x:number, y:number, text:string, color:string, timeInSeconds: number, onTimerComplete: () => void) {
        this.scene = scene;
        this.remainingTime = timeInSeconds;
        this.onTimerComplete = onTimerComplete;
        this.textToDisplay = text;

        this.timerText = this.scene.add.text(x, y, `${text}: ${this.remainingTime}`, {
            fontSize: '32px',
            color: color,
            align: 'center', 
            fontFamily: 'unicephalon'
        });
        
    }

    setVisible(visible: boolean) {
        this.timerText.setVisible(visible);
    }
    start() {
        this.timer = this.scene.time.addEvent({
            delay: 1000, // Update every second
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        if (this.remainingTime > 0) {
            this.remainingTime--;
            this.timerText.text = `${this.textToDisplay}: ${this.remainingTime}`;
        } else {
            this.stop();
            this.onTimerComplete();
        }
    }

    stop() {
        if (this.timer) {
            this.timer.remove();
        }
    }

    getRemainingTime(): number {
        return this.remainingTime;
    }
}
