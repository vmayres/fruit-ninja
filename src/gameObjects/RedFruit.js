import ASSETS from '../assets.js';

export default class RedFruit extends Phaser.Physics.Arcade.Sprite 
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

        // IDs dos frames da fruta vermelha no spritesheet
        const redFruitId = [
            76, 5, 157, 50, 126, 51, 88, 90, 20, 99, 27, 30, 33, 140
        ];

        // Inicializa o sprite
        super(scene, x, sceneHeight + 100, ASSETS.spritesheet.fruitPlus.key, Phaser.Math.RND.pick(redFruitId));
        this.setScale(72/16); // Ajuste de escala do spirte
        this.radius = (this.width * 0.5) * (72/16);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.moveToObject(this, targetPoint, randomVelocity);
        this.setCircle(this.radius);
        this.setAngularVelocity(Phaser.Math.Between(-300, 300));
        this.scene = scene;
        this.fruitColor = 0xe74c3c;
        this._originalVelocity = null;
    }

    // Atualiza a fruta a cada frame
    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        // Salva a velocidade original se ainda não foi salva
        if (!this._originalVelocity && this.body && (this.body.velocity.x !== 0 || this.body.velocity.y !== 0)) 
        {
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

        // Cria o obejro de splah de cor da fruta envolta dela
        if (this.scene.addSplash) {
            this.scene.addSplash(this.x, this.y, 0);
        }

        // Lógica de pontuação
        let pontos = 10;
        let isCombo = false;

        // Caso o efeito de Superbana esteja ativo
        if (this.scene.isYellowActive) 
        {
            pontos = 30;
            isCombo = true; // Sempre mantém combo ativo
        } 
        else  {
            //caso contario a pontuacao funcaia como sempre
            pontos = (this.scene.cursorColor === this.fruitColor) ? 20 : 10;
            isCombo = (this.scene.cursorColor === this.fruitColor);
        }

        // logica de combo 
        if (isCombo) 
        {
            if (this.scene.comboSequenceColor === null || this.scene.comboSequenceColor === this.fruitColor || this.scene.isYellowActive) 
            {
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

        this.scene.fruitCutProgress();  // aumneta o o progrecesso na barra de frezze
        this.scene.updateComboText();   // atuliza o combometer
        this.scene.updateScore(pontos); // atuliza o score
        this.scene.removeFood(this);    // destroi o obejto da cena
    }
}
