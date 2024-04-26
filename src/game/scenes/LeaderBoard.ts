import { EventBus } from "../EventBus";
import { MenuFunction } from "../MenuFunction";
import { BaseScene } from "./BaseScene";

export default class LeaderBoard extends BaseScene {

    constructor() {
        super("LeaderBoard")
    }

    preload() {
        this.load.image("leaderboardbg", "assets/UI/Leaderboard.png");
        this.load.image("construction", "assets/UI/Under_Construction.png");
        this.load.image('buttonLeft', 'assets/left.png');
    }

    create() {
        const background = this.add.image(512, 384,  'background');
        this.buttonContainer = this.add.container(0, 0);
        const leaderboardbg = this.add.image(512, 384, 'leaderboardbg');
        const construction = this.add.image(512, 384, 'construction');
        leaderboardbg.setDepth(-2);
        construction.setDepth(-1);
        background.setDepth(-3);
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
        this.scene.start('ControlsScene');
    }
}