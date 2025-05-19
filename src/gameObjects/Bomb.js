import ASSETS from '../assets.js';

export default class Bomb extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, targetCircle) 
    {
        // Define posição inicial e velocidade aleatória
        const sceneWidth = scene.scale.width;
        const sceneHeight = scene.scale.height;
        const targetPoint = targetCircle.getRandomPoint();
        const randomVelocity = Phaser.Math.Between(1000, 1200);
        const range = 200;
        const x = Phaser.Math.Between(-range, range) + (sceneWidth * 0.5);

        // Inicializa o sprite da bomba (frame 136 do spritesheet)
        super(scene, x, sceneHeight + 100, ASSETS.spritesheet.fruitPlus.key, 136);
        this.setScale(72/16); // Ajuste de escala do sprite
        this.radius = (this.width * 0.5) * (72/16);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.moveToObject(this, targetPoint, randomVelocity);
        this.setCircle(this.radius);
        this.setAngularVelocity(Phaser.Math.Between(-300, 300));
        this.scene = scene;
        this.setDepth(90); // Garante que a bomba fique acima dos splashes
    }

    // Atualiza a bomba a cada frame
    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        // Remove a bomba se sair da tela
        if (this.y > this.scene.scale.height + this.height && this.body.velocity.y > 0)
        {
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

    // Processa o corte da bomba
    hit() {
        this.scene.playRandomHitSound(); // Toca o som de corte
        this.scene.updateLives(-3);      // Perde 3 vidas ao cortar a bomba
        this.scene.removeItem(this);     // Remove a bomba da cena
    }

}