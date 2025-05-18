import ASSETS from '../assets.js';

export default class BlueFruit extends Phaser.Physics.Arcade.Sprite 
{
    constructor(scene, targetCircle) 
    {
        const sceneWidth = scene.scale.width;
        const sceneHeight = scene.scale.height;
        const targetPoint = targetCircle.getRandomPoint();
        const randomVelocity = Phaser.Math.Between(1000, 1200);
        const range = 200;
        const x = Phaser.Math.Between(- range, range) + (sceneWidth * 0.5);

        const blueFruitId = [
            16, 168, 36, 112, 150, 3, 79, 117
        ];
        
        super(scene, x, sceneHeight + 100, ASSETS.spritesheet.fruitPlus.key, Phaser.Math.RND.pick(blueFruitId));
        
        this.setScale(72/16); // Escala o sprite para 72x72
        this.radius = (this.width * 0.5) * (72/16); // Ajusta o raio para o novo tamanho
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.moveToObject(this, targetPoint, randomVelocity);
        this.setCircle(this.radius);
        this.setAngularVelocity(Phaser.Math.Between(-300, 300));
        this.scene = scene;

        this.fruitColor = 0x3498db;
        this._originalVelocity = null;
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        // Salva a velocidade original se ainda não foi salva
        if (!this._originalVelocity && this.body && (this.body.velocity.x !== 0 || this.body.velocity.y !== 0)) {
            this._originalVelocity = { x: this.body.velocity.x, y: this.body.velocity.y };
        }
        if (this.y > this.scene.scale.height + this.height && this.body.velocity.y > 0)
        {
            this.scene.updateLives(-1);
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
        this.scene.playRandomHitSound();
        let pontos = 10;
        let isCombo = false;
        if (this.scene.isYellowActive) {
            pontos = 30;
            isCombo = true;
        } else {
            pontos = (this.scene.cursorColor === this.fruitColor) ? 20 : 10;
            isCombo = (this.scene.cursorColor === this.fruitColor);
        }
        if (isCombo) {
            if (this.scene.comboSequenceColor === null || this.scene.comboSequenceColor === this.fruitColor || this.scene.isYellowActive) {
                this.scene.comboSequenceColor = this.fruitColor;
                this.scene.comboMeter = parseFloat((this.scene.comboMeter + 0.1).toFixed(1));
                this.scene.comboSequenceCount++;
            } else {
                pontos = Math.round(pontos * this.scene.comboMeter);
                this.scene.comboMeter = 1.0;
                this.scene.comboSequenceColor = null;
                this.scene.comboSequenceCount = 0;
            }
        } else {
            pontos = Math.round(pontos * this.scene.comboMeter);
            this.scene.comboMeter = 1.0;
            this.scene.comboSequenceColor = null;
            this.scene.comboSequenceCount = 0;
        }
        this.scene.fruitCutProgress();
        this.scene.updateScore(pontos);
        this.scene.updateComboText();
        this.scene.removeFood(this);
    }
}
