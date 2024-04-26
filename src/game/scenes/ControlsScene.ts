import { EventBus } from "../EventBus";
import { MenuFunction } from "../MenuFunction";
import { BaseScene } from "./BaseScene";

export default class ControlsScene extends BaseScene {

    constructor() {
        super("ControlsScene")
    }

    preload() {
        this.load.image("controlsBg", "assets/UI/Controls.png");
        this.load.image('buttonLeft', 'assets/left.png');
    }

    create() {
        const background = this.add.image(512, 384,  'background');
        this.buttonContainer = this.add.container(0, 0);
        const controlsImg = this.add.image(512, 384, 'controlsBg');
        background.setDepth(0);
        
        controlsImg.setDepth(0);
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
        this.scene.start('CreditsScene');
    }
}