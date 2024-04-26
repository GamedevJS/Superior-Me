import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg2.png');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create ()
    {
        this.scene.start('Preloader');
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         (window as any).WebFont.load({
            custom: {
                families: ['personal', 'unicephalon', 'karisma', 'steel-city'],
                urls: ['assets/fonts/PERSONAL.TTF', 'assets/fonts/unicephalon.ttf', 'assets/fonts/KARISMA_.ttf', 'assets/fonts/scb.ttf']
            },
            active: () => {
                
            }
        });
    }
}
