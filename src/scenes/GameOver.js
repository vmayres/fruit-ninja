export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        const { width, height } = this.scale;
        this.add.text(width / 2, height / 2, 'Game Over', {
            fontFamily: 'Monocraft', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Botão MENU
        const menuBtn = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'MENU', {
            fontFamily: 'Monocraft', fontSize: 40, color: '#ffe066',
            stroke: '#000', strokeThickness: 6,
            backgroundColor: '#222f3e',
            padding: { left: 30, right: 30, top: 10, bottom: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        menuBtn.on('pointerdown', () => {
            this.scene.start('Menu');
        });
        // Botão REINICIAR
        const restartBtn = this.add.text(this.scale.width / 2, this.scale.height / 2 + 180, 'REINICIAR', {
            fontFamily: 'Monocraft', fontSize: 40, color: '#2ecc40',
            stroke: '#000', strokeThickness: 6,
            backgroundColor: '#222f3e',
            padding: { left: 30, right: 30, top: 10, bottom: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        restartBtn.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
