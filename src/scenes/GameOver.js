export class GameOver extends Phaser.Scene 
{
    constructor() 
    {
        super('GameOver');
    }

    create(data) 
    {
        const { width, height } = this.scale;

        // Parallax backgrounds
        this.bg_nebula = this.add.image(width/2, height/2, 'bg_nebula')
            .setOrigin(0.5)
            .setDepth(-100)
            .setScale(1.5);
        this.bg_parallax = [
            this.add.image(width/2, height/2, 'bg_stars1').setOrigin(0.5).setDepth(-99).setScale(1.5),
            this.add.image(width/2, height/2, 'bg_stars2').setOrigin(0.5).setDepth(-98).setScale(1.5),
            this.add.image(width/2, height/2, 'bg_big1').setOrigin(0.5).setDepth(-97).setScale(1.5),
            this.add.image(width/2, height/2, 'bg_big2').setOrigin(0.5).setDepth(-96).setScale(1.5),
        ];
        this.parallaxFactors = [0.08, 0.13, 0.18, 0.23];
        this.bg_nebula_key = 'bg_nebula';

        this.add.text(width / 2, height / 2 - 80, 'Game Over', {
            fontFamily: 'Monocraft', fontSize: 96, color: '#e74c3c',
            stroke: '#000000', strokeThickness: 12,
            align: 'center'
        }).setOrigin(0.5);

        // Exibe a pontuação final
        this.add.text(width / 2, height / 2 + 10, `Pontuação: ${data && data.score !== undefined ? data.score : 0}`, {
            fontFamily: 'Monocraft', fontSize: 48, color: '#fff',
            stroke: '#000', strokeThickness: 8,
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

    update() 
    {
        // Efeito Paralax: usa o centro da tela como fonto de fulga em relao ao ponteiro do mouse
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
