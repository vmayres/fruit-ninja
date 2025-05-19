import ASSETS from '../assets.js';

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        const centreX = this.scale.width * 0.5;
        const centreY = this.scale.height * 0.5;

        const barWidth = 468;
        const barHeight = 32;
        const barMargin = 4;
        //  We loaded this image in our Boot Scene, so we can display it here

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(centreX, centreY, barWidth, barHeight).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(centreX - (barWidth * 0.5) + barMargin, centreY, barMargin, barHeight - barMargin, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = barMargin + ((barWidth - (barMargin * 2)) * progress);

        });
    }

    preload() {
        //  Load the assets for the game - see ./src/assets.js
        for (let type in ASSETS) {
            for (let key in ASSETS[type]) {
                let args = ASSETS[type][key].args.slice();
                args.unshift(ASSETS[type][key].key);
                this.load[type].apply(this.load, args);
            }
        }
        // Carrega a fonte Monocraft
        this.load.font('Monocraft', 'assets/Monocraft.ttf', 'truetype');
        this.load.image('bg_nebula', 'assets/Dynamic Space Background FREE/Nebula Aqua-Pink.png');
        this.load.image('bg_nebula_blue', 'assets/Dynamic Space Background FREE/Nebula Blue.png');
        this.load.image('bg_nebula_red', 'assets/Dynamic Space Background FREE/Nebula Red.png');
        this.load.image('bg_stars1', 'assets/Dynamic Space Background FREE/Stars Small_1.png');
        this.load.image('bg_stars2', 'assets/Dynamic Space Background FREE/Stars Small_2.png');
        this.load.image('bg_big1', 'assets/Dynamic Space Background FREE/Stars-Big_1_1_PC.png');
        this.load.image('bg_big2', 'assets/Dynamic Space Background FREE/Stars-Big_1_2_PC.png');
        this.load.image('gem_teste', 'assets/teste.png');
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the Game. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Menu');
    }
}
