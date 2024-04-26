import { EventBus } from '../EventBus';
import { CooldownSprite } from './CooldownPower';
import Superior from '../sprites/Superior';
import { PlayerSettings } from '../Domain/PlayerSettings';
import { BaseScene } from './BaseScene';
import { PowerbarHUD } from './PowerbarHUD';
import { PowerIndicator } from './PowerIndicator';
import { HealthBar } from '../HUD/Healthbar';
import { PowerGlasses } from '../HUD/Powerglasses';
import { ActionTimer } from '../HUD/ActionTimer';
import { UserDataStorage } from '../../services/UserDataStorage';
export class Game extends BaseScene
{
    private readonly gameStartSeconds = 5;
    private readonly enemyFinalYPoint = 500;
    private readonly powerExp = 30;
    private readonly healthExp = 10;

    private camera: Phaser.Cameras.Scene2D.Camera;
    private background: Phaser.GameObjects.Image;
    private bodyblock: Phaser.GameObjects.Image;
    private gameText: Phaser.GameObjects.Text;
    private q_cooldownSprite: CooldownSprite;
    private w_cooldownSprite: CooldownSprite;
    private e_cooldownSprite: CooldownSprite;
    private r_cooldownSprite: CooldownSprite;
    private playerSettings:PlayerSettings;
    private enemyNpc:Superior;
    private punchingVfxs: Phaser.Sound.BaseSound[] = [];
    private superVfx:Phaser.Sound.BaseSound;
    private powerHud: PowerIndicator;
    private playerHealthBar: HealthBar;
    private enemyHealthbar: HealthBar;
    private powerGlasses:PowerGlasses;
    private enemySettings: PlayerSettings;
    private actionTimer:ActionTimer;
    private enemyNumber:number = 1;
    private qKey: Phaser.Input.Keyboard.Key;
    private wKey: Phaser.Input.Keyboard.Key;
    private eKey: Phaser.Input.Keyboard.Key;
    private rKey: Phaser.Input.Keyboard.Key;
    private escKey: Phaser.Input.Keyboard.Key;
    private maxEnemyPower:number;
    private maxEnemyHp:number;
    private minEnemyPower:number;
    private minEnemyHp:number;
    private colors: string[] = [];
    private qExpiredEvent:Phaser.Time.TimerEvent;
    private wExpiredEvent:Phaser.Time.TimerEvent;
    private eExpiredEvent:Phaser.Time.TimerEvent;
    private rExpiredEvent:Phaser.Time.TimerEvent;
    private minEnemyVelocity:number;
    private maxEnemyVelocity:number;
    private damageDoneText:Phaser.GameObjects.Text;
    private damageReceivedText:Phaser.GameObjects.Text;
    private currentPowerText:Phaser.GameObjects.Text;
    private updatingVisuals:boolean = false;
    private spawningNewEnemy:boolean = false;
    private playerHitAtEnd = false;
    private superActivated:boolean = false;
    private dataAccess:UserDataStorage;
    private superParticlesEmiter:Phaser.GameObjects.Particles.ParticleEmitter;
    init(playerSettings:PlayerSettings) {
        const playerSettingsFromStorage = this.dataAccess.readLocal();
        this.playerSettings = playerSettingsFromStorage? playerSettingsFromStorage : playerSettings;
        this.minEnemyVelocity = 15000;
        this.maxEnemyVelocity = 20000;
        this.updateNpcSettingsAccordingPlayerStats();
    }

    constructor ()
    {
        super('Game');
        this.spawningNewEnemy =  false;
        this.superActivated = false;

        this.dataAccess = new UserDataStorage();
    }

    updateNpcSettingsAccordingPlayerStats() {
        this.minEnemyPower = this.playerSettings.power? this.playerSettings.power - 50: 200;
        // this.maxEnemyPower = this.playerSettings.power? this.playerSettings.power + 100 : 300;
        this.maxEnemyPower = this.playerSettings.power? this.playerSettings.power + 30 : 300;

        this.minEnemyHp = this.playerSettings.totalHealth? this.playerSettings.totalHealth - 100: 1500;
        this.maxEnemyHp = this.playerSettings.totalHealth? this.playerSettings.totalHealth + 100 :2000;
        // this.maxEnemyHp = this.playerSettings.totalHealth? this.playerSettings.totalHealth + 100 :2000;
    }

    increaseEnemyVelocity() {
        this.minEnemyVelocity -= 50;
        this.maxEnemyVelocity -= 50;
    }

    preload() {
        this.load.image('QPower', 'assets/UI/Q.png');
        this.load.image('WPower', 'assets/UI/W.png');
        this.load.image('EPower', 'assets/UI/E.png');
        this.load.image('RPower', 'assets/UI/R.png');
        this.load.image('gamebackground', 'assets/GameBg.png')

        this.load.image("rose", "assets/particles/rose.png");
        this.load.image("green", "assets/particles/GreenPortal2.png");
        this.load.spritesheet('punches', 'assets/particles/punchesSprites.png', {
            frameWidth: 400, // Width of each frame
            frameHeight: 400, // Height of each frame
            startFrame: 0, // Optional: Index of the first frame (default is 0)
            endFrame: -1, // Optional: Index of the last frame (default is -1, which loads all frames)
            margin: 0, // Optional: Margin between frames
            spacing: 0 // Optional: Spacing between frames
            
        });

        this.load.image('powerbarBg', "assets/progressBarEmpty.png");
        this.load.image('powerbarcontent', "assets/progressBarColorized.png");
        this.load.image('powerGlasses', "assets/Character/PowerGlasses.png");
        this.load.image('powerGlassesBorder', "assets/Character/PowerGlassesBorder.png");
        this.load.image('bodyblock', "assets/Character/EHud.png");
        this.load.audio('punch1', 'assets/Audio/body_hit_small_11.wav');
        this.load.audio('punch2', 'assets/Audio/body_hit_small_23.wav');
        this.load.audio('punch3', 'assets/Audio/face_hit_small_23.wav');
        this.load.audio('punchSpecial', 'assets/Audio/fire_punch_02.wav');
    }

   
    sleep() {
        this.bgMusic.pause();
    }

    wake() {
        this.playMainGameMusic();
    }

    setupEnemySettings() {
        this.updateNpcSettingsAccordingPlayerStats();
        this.increaseEnemyVelocity();
        this.enemySettings = new PlayerSettings();
        this.enemySettings.name = `Superior NPC ${this.enemyNumber}`;
        this.enemySettings.power = Phaser.Math.Between(this.minEnemyPower, this.maxEnemyPower);
        this.enemySettings.totalHealth = Phaser.Math.Between(this.minEnemyHp, this.maxEnemyHp);
        this.enemySettings.primaryColor = this.getRandomColor();
        this.enemySettings.secondaryColor = this.getRandomColor();
        this.enemySettings.accessoriesColor = this.getRandomColor();
        this.enemyNumber ++;
        this.powerGlasses.setTargetEnemy(this.enemySettings);
    }

    spawnEnemy() {
        if (!this.spawningNewEnemy) {
            this.spawningNewEnemy = true;
            this.playerHitAtEnd = false;
            this.powerGlasses.setTargetEnemy(this.enemySettings);
    
            const enemyVelocity = Phaser.Math.Between(this.minEnemyVelocity, this.maxEnemyVelocity);
            this.enemyNpc = new Superior(
                this, 
                Phaser.Math.Between(100, 700),
                Phaser.Math.Between(100, 500),
                'superiorPrimary',
                this.enemySettings,
                enemyVelocity,
                this.enemyFinalYPoint
            );
            this.enemyNpc.on('pointerdown', this.handlePunch);
            this.enemyNpc.on('pointerout', () => {
                this.powerGlasses.hideStats();
            });
            this.enemyNpc.on('pointerover', () => {
                this.powerGlasses.showStats();
            });
            this.spawningNewEnemy = false;
        }
    }

    startGame() {
        this.q_cooldownSprite = new CooldownSprite(this, 350, 600, 'QPower', 5000, 'Q', () => {
            if (this.qExpiredEvent) {
                this.q_cooldownSprite.cooldownDuration = 12000;
                this.qExpiredEvent.destroy();
            }
        });
        this.w_cooldownSprite = new CooldownSprite(this, 450, 600, 'WPower', 8000, 'W', ()=> {
            if (this.wExpiredEvent) {
                this.wExpiredEvent.destroy();
            }
        });
        this.e_cooldownSprite = new CooldownSprite(this, 550, 600, 'EPower', 5000, 'E', () => {
            if (this.eExpiredEvent) {
                this.eExpiredEvent.destroy();
            }
        });
        this.r_cooldownSprite = new CooldownSprite(this, 650, 600, 'RPower', 15000, 'R', () => {
            if (this.rExpiredEvent) {
                this.rExpiredEvent.destroy();
            }
        });

        this.q_cooldownSprite.setDepth(2);
        this.w_cooldownSprite.setDepth(2);
        this.e_cooldownSprite.setDepth(2);
        this.r_cooldownSprite.setDepth(2);

        this.createGame();
    }

    getRandomColor(): number {
        // Generate a random index to select a color from the array
        const randomIndex = Phaser.Math.Between(0, this.colors.length-1);
        return parseInt(this.colors[randomIndex].slice(1),16);
    }

    create ()
    {
        this.sound.stopAll();
        this.playMainGameMusic();
        
        const settings = this.cache.json.get('settings');
        this.colors = settings.colors;
        
        //this.enemyNpc.setOrigin(0);
        const gamebackground = this.add.image(512, 384, 'gamebackground');
        gamebackground.setDepth(-1);

        
        
        this.actionTimer = new ActionTimer(this,300, 100, 'Battle Begings in','#ffffff', this.gameStartSeconds, () => { 
            //this.startGame();
            this.actionTimer.setVisible(false);
            this.setupEnemySettings();
            this.spawnEnemy();
      
            this.enemyNpc.on('pointerdown', this.handlePunch);
            this.enemyNpc.on('pointerout', () => {
                this.powerGlasses.hideStats();
            });
            this.enemyNpc.on('pointerover', () => {
                this.powerGlasses.showStats();
            });
        });
        this.actionTimer.start();

        this.startGame();
        

        const emitZone1 = { type: 'edge', source: new Phaser.Geom.Rectangle(0, 0, 1024, 768) , quantity: 50 };
        
        this.superParticlesEmiter = this.add.particles(0, 0, 'spark', {
            x: 0, // x position of the emitter
            y: 0, // y position of the emitter
            speed: { min: -100, max: 100 }, // velocity range for sparks
            angle: { min: 0, max: 45 }, // angle range for sparks
            scale: { start: 1, end: 0 }, // scale range for sparks
            blendMode: 'ADD', // blend mode for the sparks
            lifespan: 1000, // lifespan of each spark particle
            frequency: 50, // frequency of emitting sparks
            quantity: 7, // number of sparks emitted per emission
            
            // emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 20) } // emit zone for sparks
            emitZone: [emitZone1],
            
        });
        this.superParticlesEmiter.stop();

        EventBus.emit('current-scene-ready', this);
    }

    shakeCamera () {
        const intensity = 0.05;
        const duration =1200;

        const shakeDuration = duration;
        const shakeIntensity = intensity;
        const horizontalShake = Math.random() * shakeIntensity * 2 - shakeIntensity;
        //const verticalShake = Math.random() * shakeIntensity * 2 - shakeIntensity;

        this.cameras.main.shake(shakeDuration, horizontalShake, true);
    }

    updateVisuals() {
        // const randomPowerTime = Phaser.Math.Between(400, 700);
        //this.powerHud.disposeObject();
        // this.powerHud = new PowerIndicator(this, 306, 690, 198, 20, this.playerSettings.power, 0xfffffff, this.currentPowerText);
        // this.powerHud.animatePower(randomPowerTime, 2);
        this.powerHud.setPower(this.playerSettings.power);
        //this.powerGlasses.disposeObject();
        // this.powerGlasses = new PowerGlasses(this, 510, 550, 'powerGlasses', 'powerGlassesBorder', this.playerSettings.accessoriesColor);
        this.powerGlasses.setPlayerSettings(this.playerSettings);
        //this.powerGlasses.hideGlasses();
        
        // this.playerHealthBar = new HealthBar(this, 305, 720, 390, 25, this.playerSettings.totalHealth, true, 0x35dc35, 0xc8000a);
        this.enemyHealthbar.disposeObject();
        this.enemyHealthbar = new HealthBar(this, 390, 290, 200, 20, this.enemySettings.totalHealth, false, 0xc8000a);
        this.enemyHealthbar.Show(false);
        
    }

    spawnNewEnemy() {
         
        if (this.enemyNpc) {
            this.enemyNpc.disposeObject();
            this.enemyNpc.destroy();
        }
        this.setupEnemySettings();
        this.updateVisuals();
        this.spawnEnemy();
    
    }
    update(time: number, delta: number) {

        const playerHealth = this.playerHealthBar.getHealth();
        const enemyHealth = this.enemyHealthbar.getHealth();
        if (this.enemyNpc && this.enemyNpc.y >= this.enemyFinalYPoint && !this.playerHitAtEnd && enemyHealth > 0) {
            const additionalDmgPercent = this.enemyHealthbar.getHealth() * 100 / this.enemyHealthbar.getTotalHealth();
            const additionalDmg = additionalDmgPercent/100 * this.enemySettings.power;
            const totalDamageToDeal = Math.floor(this.enemySettings.power + additionalDmg);
            this.damageReceivedText.text = `-${totalDamageToDeal}`;
            this.playerHealthBar.dealDamange(totalDamageToDeal);
            this.shakeCamera();
            this.playerHitAtEnd = true;
            this.spawnNewEnemy();
        }
        else if ( enemyHealth <= 0) {
            if (this.enemySettings.power > this.playerSettings.power) {
                this.playerSettings.power = this.enemySettings.power;
                
            }
            else {
                this.playerSettings.power += this.powerExp;
            }
            this.playerSettings.totalHealth += this.healthExp;
            this.spawnNewEnemy();
            
        }
        else if (playerHealth <= 0 ) {
            this.endGame();
        }

        // Update the cooldown sprite
        if (this.q_cooldownSprite) {

            this.q_cooldownSprite.update(time, delta);
        }

        if (this.w_cooldownSprite) {
            this.w_cooldownSprite.update(time, delta);
        }

        if (this.e_cooldownSprite) {
            this.e_cooldownSprite.update(time, delta);
        }

        if (this.r_cooldownSprite) {
            this.r_cooldownSprite.update(time, delta);
        }
    }

    private mapKeys() {
        if (this.input?.keyboard) {

            this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
            this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
            this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
            this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
            // Listen for the "down" event on the "Q" key
            this.qKey.on('down', () => {
                if (!this.q_cooldownSprite.isInCooldown)
                {
                    this.qExpiredEvent = this.time.addEvent({
                        delay: 10000, 
                        callback: () => {this.powerGlasses.hideGlasses()},
                        callbackScope: this,
                        loop: false
                    });
                    this.q_cooldownSprite.isInCooldown = true;
                    this.powerGlasses.showGlasses();
                    this.powerGlasses.showStats();
                }
            });

            this.wKey.on('down', () => {
                if (!this.w_cooldownSprite.isInCooldown)
                {
                    const percentageToHeal = this.playerHealthBar.getHealth() * .05;
                    this.playerHealthBar.setValue(this.playerHealthBar.getHealth() + percentageToHeal)
                    this.w_cooldownSprite.isInCooldown = true;
                }
            });

            this.eKey.on('down', () => {
                this.bodyblock.setVisible(true);
                this.eExpiredEvent = this.time.addEvent({
                    delay: 3000, 
                    callback: () => { 
                        this.bodyblock.setVisible(false);
                    },
                    callbackScope: this,
                    loop: false
                });
                this.e_cooldownSprite.isInCooldown = true;
            });

            this.rKey.on('down', () => {
                this.superActivated = true;
                this.rExpiredEvent = this.time.addEvent({
                    delay: 3000, 
                    callback: () => { 
                        this.superActivated = false; 
                        this.superParticlesEmiter.stop();
                    },
                    callbackScope: this,
                    loop: false
                });
                this.superParticlesEmiter.start();
                this.r_cooldownSprite.isInCooldown = true;
                console.log('R key pressed');
            });

            this.escKey.on('down', () => {
                
                
            });


        }
    }


    private createGame() {
        const emitter = this.add.particles(400, 250, 'punches', {
            frame: [0, 1, 2, 3, 4],
            lifespan: 250,
            speed: { min: 150, max: 250 },
            scale: { start: .2, end: .8 },
            gravityY: 150,
            blendMode: 'SCREEN',
            emitting: false,
        });


        this.bodyblock = this.add.image(500, 500, 'bodyblock');
        this.bodyblock.setTint(this.playerSettings.secondaryColor);
        this.bodyblock.alpha = .2;
        this.bodyblock.scale = 1.5;
        this.bodyblock.setVisible(false);

        emitter.setDepth(3);
        if (this.punchingVfxs.length <= 0) {
            this.superVfx = this.sound.add('punchSpecial', { loop:false });
            this.punchingVfxs.push(this.sound.add('punch1', { loop: false }));
            this.punchingVfxs.push(this.sound.add('punch2', { loop: false }));
            this.punchingVfxs.push(this.sound.add('punch3', { loop: false }));
        }


        this.damageDoneText = this.add.text(700, 400, '', { fontSize: '40px', color: '#03fc35', fontFamily: 'unicephalon' });
        this.damageReceivedText = this.add.text(700, 450, '', { fontSize: '40px', color: '#ff0000', fontFamily: 'unicephalon' });
        this.damageDoneText.setDepth(3);
        this.damageReceivedText.setDepth(3);
        const powerbar = new PowerbarHUD(this, 500, 700, 2, 1.3, ['powerbarBg', 'powerbarcontent']);
        this.add.existing(powerbar);

        emitter.on('complete', () => {
            this.damageDoneText.text = '';
            this.damageReceivedText.text = '';
            //console.log('Particle emission complete');
            // Your completion callback logic here
        });

        this.currentPowerText = this.add.text(710, 690, '', {
            fontSize: '40px',
            color: '#f7f5f7',
            fontFamily: 'unicephalon',
            stroke: '#69039c',
            strokeThickness: 10
        });
        this.currentPowerText.setDepth(3);

        const randomPowerTime = Phaser.Math.Between(400, 700);
        this.powerHud = new PowerIndicator(this, 306, 690, 198, 20, 200, 0xfffffff, this.currentPowerText);
        this.powerHud.setPower(this.playerSettings.power);
        this.powerHud.animatePower(randomPowerTime, 2);

        this.powerGlasses = new PowerGlasses(this, 510, 550, 'powerGlasses', 'powerGlassesBorder', this.playerSettings.accessoriesColor);
        this.powerGlasses.setPlayerSettings(this.playerSettings);
        
        this.powerGlasses.hideGlasses();
        this.playerHealthBar = new HealthBar(this, 305, 720, 390, 25, this.playerSettings.totalHealth, true, 0x35dc35, 0xc8000a);
        this.enemyHealthbar = new HealthBar(this, 390, 290, 200, 20, 2000, false, 0xc8000a);
        this.enemyHealthbar.Show(false);

        

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!this.enemyNpc) {
                return;
            }
            const cardboardBounds = this.enemyNpc.getBounds();
            if (cardboardBounds.contains(pointer.x, pointer.y)) {

                // Get the current power value
                let currentPower = this.powerHud.getCurrentPower();
                if (this.superActivated) {
                    const additionalDmgPercent = this.playerHealthBar.getHealth() * 100 / this.playerHealthBar.getTotalHealth();
                    const additionalDmg = additionalDmgPercent/100 * this.playerSettings.power;
                    console.log(additionalDmg);
                    currentPower = Math.floor(currentPower + additionalDmg);
                    console.log(currentPower);
                }
                const playerPower = Math.floor(currentPower);
                let enemyPower = Math.floor(this.powerGlasses.getTargetPower());
                
                const playerHealth = this.playerHealthBar.getHealth();
                let enemyHealth = this.enemyHealthbar.getHealth();
                if (playerHealth > 0 && enemyHealth > 0) {
                    if (playerPower < enemyPower) {
                        if (this.bodyblock.visible) {
                            const damageToBlock = enemyPower*.20;
                            console.log('damageToBlock:' + damageToBlock);
                            enemyPower -= Math.floor(damageToBlock);
                            if (enemyPower < 0) {
                                enemyPower = 0;
                            }
                        }
                        this.damageReceivedText.text = `-${enemyPower}`;
                        this.playerHealthBar.dealDamange(enemyPower);

                    } else if (playerPower > enemyPower) {
                        this.damageDoneText.text = `${playerPower}`;
                        this.enemyHealthbar.dealDamange(playerPower);
                        enemyHealth = this.enemyHealthbar.getHealth();
                        this.powerGlasses.updateHealthStats(enemyHealth);
                    }
                }
               

                emitter.setX(pointer.x);
                emitter.setY(pointer.y);
                emitter.explode(1);
            }


        });

        this.mapKeys();
    }

    handlePunch = () => {
       
        if(this.superActivated) {
            this.superVfx.play();
        }
        else {
            const soundIndex = Phaser.Math.Between(0, this.punchingVfxs.length-1);
            this.punchingVfxs[soundIndex].play();
        }
       
        // this.time.addEvent({
        //     delay: 100, 
        //     callback: this.startPendule1,
        //     callbackScope: this,
        //     repeat: 1 
        // });
    }

   

    endGame() {
        console.log('endGame');
        this.superActivated = false;
        this.children.removeAll();
        this.dataAccess.upsertLocal(this.playerSettings);
        this.scene.start("GameOver", this.playerSettings);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
