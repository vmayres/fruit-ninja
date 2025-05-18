export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
        this.add.image(this.scale.width/2, this.scale.height/2, 'bg_space')
            .setOrigin(0.5)
            .setDepth(-100)
            .setScale(1.5);

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        this.add.text(centerX, centerY - 100, 'Fruit Ninja', {
            fontFamily: 'Monocraft', fontSize: 64, color: '#fff',
            stroke: '#000', strokeThickness: 8,
        }).setOrigin(0.5);

        // Botão JOGAR
        const playBtn = this.add.text(centerX, centerY, 'JOGAR', {
            fontFamily: 'Monocraft', fontSize: 48, color: '#2ecc40',
            stroke: '#000', strokeThickness: 6,
            backgroundColor: '#222f3e',
            padding: { left: 30, right: 30, top: 10, bottom: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        playBtn.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Botão CONTROLES
        const controlsBtn = this.add.text(centerX, centerY + 100, 'CONTROLES', {
            fontFamily: 'Monocraft', fontSize: 48, color: '#3498db',
            stroke: '#000', strokeThickness: 6,
            backgroundColor: '#222f3e',
            padding: { left: 30, right: 30, top: 10, bottom: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        controlsBtn.on('pointerdown', () => {
            this.scene.start('Controles');
        });
    }
}
