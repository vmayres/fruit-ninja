export class Controles extends Phaser.Scene {
    constructor() {
        super('Controles');
    }

    create() 
    {
        // Parallax backgrounds
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        this.bg_nebula = this.add.image(centerX, centerY, 'bg_nebula')
            .setOrigin(0.5)
            .setDepth(-100)
            .setScale(1.5);

        this.bg_parallax = [
            this.add.image(centerX, centerY, 'bg_stars1').setOrigin(0.5).setDepth(-99).setScale(1.5),
            this.add.image(centerX, centerY, 'bg_stars2').setOrigin(0.5).setDepth(-98).setScale(1.5),
            this.add.image(centerX, centerY, 'bg_big1').setOrigin(0.5).setDepth(-97).setScale(1.5),
            this.add.image(centerX, centerY, 'bg_big2').setOrigin(0.5).setDepth(-96).setScale(1.5),
        ];

        this.parallaxFactors = [0.08, 0.13, 0.18, 0.23];
        this.bg_nebula_key = 'bg_nebula';

        // Adiciona a gema por cima do parallax
        this.gem = this.add.image(centerX, centerY, 'controles')
            .setOrigin(0.5)
            .setDepth(10)
            .setScale(1);

        // Botão VOLTAR no canto superior esquerdo, metade do tamanho
        const backBtn = this.add.text(30, 30, 'VOLTAR', {
            fontFamily: 'Monocraft', fontSize: 24, color: '#e74c3c',
            stroke: '#000', strokeThickness: 4,
            backgroundColor: '#222f3e',
            padding: { left: 16, right: 16, top: 6, bottom: 6 }
        }).setOrigin(0, 0).setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => {
            this.scene.start('Menu');
        });
    }

    update() {

        // Parallax effect: move layers based on mouse position
        const pointer = this.input.activePointer;
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        let dx = (pointer.x - centerX) / (this.scale.width / 2);
        let dy = (pointer.y - centerY) / (this.scale.height / 2);
        dx = Phaser.Math.Clamp(dx, -1, 1);
        dy = Phaser.Math.Clamp(dy, -1, 1);
        for (let i = 0; i < this.bg_parallax.length; i++) {
            const factor = this.parallaxFactors[i];
            this.bg_parallax[i].x = centerX + dx * 60 * factor * this.scale.width/1280;
            this.bg_parallax[i].y = centerY + dy * 40 * factor * this.scale.height/720;
        }
    }
}
