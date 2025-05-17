import ASSETS from '../assets.js';

export default class Food extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, targetCircle)
    {
        const sceneWidth = scene.scale.width;
        const sceneHeight = scene.scale.height;
        const targetPoint = targetCircle.getRandomPoint();
        const randomVelocity = Phaser.Math.Between(1000, 1200);
        const range = 200;
        const x = Phaser.Math.Between(- range, range) + (sceneWidth * 0.5);
        const tileIds = [ 13, 14, 15, 25, 42, 43, 58, 87, 88, 92 ];
        super(scene, x, sceneHeight + 100, ASSETS.spritesheet.tiles.key, Phaser.Math.RND.pick(tileIds));

        this.radius = this.width * 0.5;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.moveToObject(this, targetPoint, randomVelocity);
        this.setCircle(this.radius);
        this.setAngularVelocity(Phaser.Math.Between(-300, 300));
        this.scene = scene;

        // Definir cor aleatória para a fruta
        this.fruitColors = [0x3498db, 0xe74c3c, 0x2ecc40]; // azul, vermelho, verde
        this.fruitColorIndex = Phaser.Math.Between(0, 2);
        this.fruitColor = this.fruitColors[this.fruitColorIndex];
        this.setTint(this.fruitColor);

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

    hit ()
    {
        // Se a cor do cursor for igual à da fruta, dobra a pontuação
        const cursorColor = this.scene.cursorColor;
        const isCombo = (cursorColor === this.fruitColor);
        let pontos = isCombo ? 20 : 10;

        // Combo meter logic
        if (isCombo) {
            // Se a sequência está começando ou continua
            if (this.scene.comboSequenceColor === null || this.scene.comboSequenceColor === cursorColor) {
                this.scene.comboSequenceColor = cursorColor;
                this.scene.comboMeter = parseFloat((this.scene.comboMeter + 0.1).toFixed(1));
                this.scene.comboSequenceCount++;
            } else {
                // Sequência foi quebrada, aplica combo e reseta
                pontos = Math.round(pontos * this.scene.comboMeter);
                this.scene.comboMeter = 1.0;
                this.scene.comboSequenceColor = null;
                this.scene.comboSequenceCount = 0;
            }
        } else {
            // Se errou a cor, aplica combo e reseta
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