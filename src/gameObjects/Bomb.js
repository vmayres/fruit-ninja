import ASSETS from '../assets.js';

export default class Bomb extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, targetCircle) {
        const sceneWidth = scene.scale.width;
        const sceneHeight = scene.scale.height;
        const targetPoint = targetCircle.getRandomPoint();
        const randomVelocity = Phaser.Math.Between(1000, 1200);
        const range = 200;
        const x = Phaser.Math.Between(-range, range) + (sceneWidth * 0.5);
        const bombFrame = 105; // frame do tiles.png para bomba
        super(scene, x, sceneHeight + 100, ASSETS.spritesheet.tiles.key, bombFrame);

        this.radius = this.width * 0.5;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.moveToObject(this, targetPoint, randomVelocity);
        this.setCircle(this.radius);
        this.setAngularVelocity(Phaser.Math.Between(-300, 300));
        this.scene = scene;
        this.setDepth(90);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        if (this.y > this.scene.scale.height + this.height && this.body.velocity.y > 0)
        {
            this.scene.removeFood(this);
        }
    }

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

    hit() {
        this.scene.updateLives(-3); // Perde 2 vidas ao cortar
        this.scene.removeItem(this);
    }

}