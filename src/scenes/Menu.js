export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
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

        // Textos e botões
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
        // Troca o fundo estático conforme estado
        let desiredKey = 'bg_nebula';
        if (this.isFreezeActive) desiredKey = 'bg_nebula_blue';
        if (this.isYellowActive) desiredKey = 'bg_nebula_red';
        if (this.bg_nebula_key !== desiredKey) {
            this.bg_nebula.setTexture(desiredKey);
            this.bg_nebula_key = desiredKey;
        }
    }
}
