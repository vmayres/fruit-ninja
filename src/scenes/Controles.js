export class Controles extends Phaser.Scene {
    constructor() {
        super('Controles');
    }

    create() {
        this.add.image(this.scale.width/2, this.scale.height/2, 'bg_space')
            .setOrigin(0.5)
            .setDepth(-100)
            .setScale(1.5);

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        this.add.text(centerX, centerY - 100, 'Controles', {
            fontFamily: 'Monocraft', fontSize: 54, color: '#fff',
            stroke: '#000', strokeThickness: 8,
        }).setOrigin(0.5);

        this.add.text(centerX, centerY, '1: Vermelho\n2: Verde\n3: Azul\nCorte as frutas com a cor certa!\nSuperBanana: qualquer cor', {
            fontFamily: 'Monocraft', fontSize: 32, color: '#ffe066',
            stroke: '#000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Botão VOLTAR
        const backBtn = this.add.text(centerX, centerY + 150, 'VOLTAR', {
            fontFamily: 'Monocraft', fontSize: 40, color: '#e74c3c',
            stroke: '#000', strokeThickness: 6,
            backgroundColor: '#222f3e',
            padding: { left: 30, right: 30, top: 10, bottom: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => {
            this.scene.start('Menu');
        });
    }
}
