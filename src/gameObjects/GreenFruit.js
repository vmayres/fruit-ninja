import ASSETS from '../assets.js';

export default class GreenFruit extends Phaser.Physics.Arcade.Sprite 
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

        // IDs dos frames da fruta verde no spritesheet
        const greenFruitId = [
            1, 77, 4, 194, 6, 158, 10, 124, 17, 93, 22, 37, 75, 227
        ];

        // Inicializa o sprite
        super(scene, x, sceneHeight + 100, ASSETS.spritesheet.fruitPlus.key, Phaser.Math.RND.pick(greenFruitId));
        this.setScale(72/16); // Ajuste de escala do sprite
        this.radius = (this.width * 0.5) * (72/16);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.moveToObject(this, targetPoint, randomVelocity);
        this.setCircle(this.radius);
        this.setAngularVelocity(Phaser.Math.Between(-300, 300));
        this.scene = scene;
        this.fruitColor = 0x2ecc40;
        this._originalVelocity = null;
    }

    // Atualiza a fruta a cada frame
    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        // Salva a velocidade original se ainda não foi salva
        if (!this._originalVelocity && this.body && (this.body.velocity.x !== 0 || this.body.velocity.y !== 0)) {
            this._originalVelocity = { x: this.body.velocity.x, y: this.body.velocity.y };
        }

        // Remove a fruta se sair da tela
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

    // Processa o corte da fruta
    hit() 
    {
        // Toca o som de corte
        this.scene.playRandomHitSound();

        // Cria o splash de tinta verde no fundo
        if (this.scene.addSplash) {
            this.scene.addSplash(this.x, this.y, 1);
        }

        // Lógica de pontuação
        let pontos = 10;
        let isCombo = false;

        // Caso o efeito de Superbana esteja ativo
        if (this.scene.isYellowActive) 
        {
            pontos = 30;
            isCombo = true;
        } 
        else {
            pontos = (this.scene.cursorColor === this.fruitColor) ? 20 : 10;
            isCombo = (this.scene.cursorColor === this.fruitColor);
        }

        // Lógica de combo
        if (isCombo) 
        {
            if (this.scene.comboSequenceColor === null || this.scene.comboSequenceColor === this.fruitColor || this.scene.isYellowActive) 
            {
                // amentar o valor do com em 0.1 para cada seuqncia de corte
                this.scene.comboSequenceColor = this.fruitColor;
                this.scene.comboMeter = parseFloat((this.scene.comboMeter + 0.1).toFixed(1));
            } 
            else {
                // Aplica o multiplicador ao score total
                this.scene.score = Math.round(this.scene.score * this.scene.comboMeter);
                pontos = Math.round(pontos * this.scene.comboMeter);
                this.scene.comboMeter = 1.0;
                this.scene.comboSequenceColor = null;
            }
        } 
        else {
            // Caso o combe seja quebrado multiplica o resultado no SCORE
            this.scene.score = Math.round(this.scene.score * this.scene.comboMeter);
            pontos = Math.round(pontos * this.scene.comboMeter);
            this.scene.comboMeter = 1.0;
            this.scene.comboSequenceColor = null;
        }
        this.scene.fruitCutProgress();  // aumenta o progresso na barra de freeze
        this.scene.updateScore(pontos); // atualiza o score
        this.scene.updateComboText();   // atualiza o combometer
        this.scene.removeFood(this);    // remove a fruta da cena
    }
}
