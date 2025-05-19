import ASSETS from '../assets.js';

export default class SuperBanana extends Phaser.Physics.Arcade.Sprite 
{
    constructor(scene, targetCircle) 
    {
        // Define posição inicial e velocidade aleatória
        const sceneWidth = scene.scale.width;
        const sceneHeight = scene.scale.height;
        const targetPoint = targetCircle.getRandomPoint();
        const randomVelocity = Phaser.Math.Between(1000, 1200);
        const range = 200;
        const x = Phaser.Math.Between(- range, range) + (sceneWidth * 0.5);

        // Frame 159 do spritesheet representa a SuperBanana
        super(scene, x, sceneHeight + 100, ASSETS.spritesheet.fruitPlus.key, 159);
        this.setScale(72/16); // Ajuste de escala do sprite
        this.radius = (this.width * 0.5) * (72/16);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.moveToObject(this, targetPoint, randomVelocity);
        this.body.setCircle(this.radius);
        this.setAngularVelocity(Phaser.Math.Between(-300, 300));
        this.scene = scene;
        this.setDepth(90); // Garante que fique acima dos splashes
        this._originalVelocity = null;
    }

    // Atualiza a SuperBanana a cada frame
    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        // Salva a velocidade original se ainda não foi salva
        if (!this._originalVelocity && this.body && (this.body.velocity.x !== 0 || this.body.velocity.y !== 0)) {
            this._originalVelocity = { x: this.body.velocity.x, y: this.body.velocity.y };
        }
        // Remove a SuperBanana se sair da tela
        if (this.y > this.scene.scale.height + this.height && this.body.velocity.y > 0)
        {
            this.scene.updateLives(-1);
            this.scene.removeFood(this);
        }
    }

    // Verifica colisão com o rastro do mouse
    checkCollision (points)
    {
        for (let i = 0; i < points.length; i++)
        {
            const x = points[ i ].x;
            const y = points[ i ].y;
            if (this.radius > 0 && x >= this.body.left && x <= this.body.right && y >= this.body.top && y <= this.body.bottom)
            {
                var dx = (this.x - x) * (this.x - x);
                var dy = (this.y - y) * (this.y - y);
                if ((dx + dy) <= (this.body.radius * this.body.radius))
                {
                    this.hit();
                    return;
                }
            }
        }
    }

    // Processa o corte da SuperBanana
    hit() {
        // Toca o som de corte
        this.scene.playRandomHitSound();

        // Garante pontuação fixa ao cortar a SuperBanana
        this.scene.updateScore(50);
        this.scene.fruitCutProgress();
        this.scene.updateComboText();
        
        // Ativa o efeito especial GOLD TIME
        this.scene.onSuperBananaCut(this);
    }
}
