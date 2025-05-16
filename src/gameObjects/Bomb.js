import ASSETS from '../assets.js';

export default class Bomb extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'bomb'); // Usa a key 'bomb' para o sprite

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(90);
        this.scene = scene;
    }

    // Função para ser chamada quando cortada
    hit()
    {
        this.scene.updateLives(-3);
        this.scene.removeItem(this);
    }

    collect ()
    {
        this.scene.destroyEnemies();
        this.scene.removeItem(this);
    }

    checkCollision(points) {
        for (let i = 0; i < points.length; i++) {
            const x = points[i].x;
            const y = points[i].y;
            if (this.body && x >= this.body.left && x <= this.body.right && y >= this.body.top && y <= this.body.bottom) {
                var dx = (this.x - x) * (this.x - x);
                var dy = (this.y - y) * (this.y - y);
                if ((dx + dy) <= (this.body.radius * this.body.radius)) {
                    this.hit();
                    return;
                }
            }
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y > this.scene.scale.height + this.height && this.body.velocity.y > 0) {
            // Não faz nada se sair da tela, igual à fruta
            this.scene.removeItem(this);
        }
    }
}