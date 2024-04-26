import { EventBus } from "../EventBus";
import { MenuFunction } from "../MenuFunction";
import { BaseScene } from "./BaseScene";

export default class CreditsScene extends BaseScene {

    constructor() {
        super("CreditsScene")
    }

    preload() {
        this.load.image("creditsImg", "assets/UI/Credits.png");
        this.load.image('buttonLeft', 'assets/left.png');
    }

    create() {
        this.buttonContainer = this.add.container(0, 0);
        const background = this.add.image(512, 384, 'background');
        const creditsImg = this.add.image(512, 384, 'creditsImg');
        
        creditsImg.setDepth(0);
        background.setDepth(-1);
        
        this.addButton(100, 30, 1, 80,'BACK', 'buttonLeft', () => this.handleButtonClick('MainMenu', null), 0xff5900);
        
        EventBus.emit('current-scene-ready', this);
    }

    handleButtonClick = (sceneKey: string | null, callback: MenuFunction | null) => {
        if (sceneKey) {
            this.scene.start(sceneKey);
        } else if (callback) {
            callback();
        }
    }


    changeScene ()
    {
        this.scene.start('GameOver');
    }
}