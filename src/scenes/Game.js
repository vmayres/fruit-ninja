/*
* Asset from: https://kenney.nl/assets/pixel-platformer
*
*/
import ASSETS from '../assets.js';
import ANIMATION from '../animation.js';
import TrailPoint from '../gameObjects/TrailPoint.js';
import Bomb from '../gameObjects/Bomb.js';
import RedFruit from '../gameObjects/RedFruit.js';
import GreenFruit from '../gameObjects/GreenFruit.js';
import BlueFruit from '../gameObjects/BlueFruit.js';
import SuperBanana from '../gameObjects/SuperBanana.js'; // Importa a nova classe SuperBanana


export class Game extends Phaser.Scene
{
    constructor()
    {
        super('Game');
    }

    create ()
    {
        this.initVariables();
        this.initGameUi();
        // this.initAnimations();
        // this.initPlayer();
        this.initInput();
        this.initPhysics();
        // Input para resetar barra e mostrar texto
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.fruitCutCount >= this.barFruitsGoal) {
                this.fruitCutCount = 0;
                this.updateProgressBar();
                this.showFreezeText();
            }
        });
    }

    update ()
    {
        if (!this.gameStarted) return;
        this.drawSlash();
        this.checkCollisions();
        // Aplica efeito freeze frame a frame
        if (this.isFreezeActive) {
            this.foodGroup.getChildren().forEach(obj => {
                if (obj.body && obj.body.velocity) {
                    if (!obj._isFrozen) {
                        // Salva velocidade original só uma vez
                        obj._originalVelocity = { x: obj.body.velocity.x, y: obj.body.velocity.y };
                        obj._isFrozen = true;
                    }
                    // Aplica multiplicador de freeze sem alterar direção
                    obj.body.velocity.x = obj._originalVelocity.x * 0.3;
                    obj.body.velocity.y = obj._originalVelocity.y * 0.3;
                }
            });
        } else {
            // Se não está em freeze, restaura velocidade se necessário
            this.foodGroup.getChildren().forEach(obj => {
                if (obj._isFrozen && obj._originalVelocity) {
                    obj.body.velocity.x = obj._originalVelocity.x;
                    obj.body.velocity.y = obj._originalVelocity.y;
                    obj._isFrozen = false;
                }
            });
        }
    }

    initVariables ()
    {
        this.score = 0;
        this.lives = 3; // Adiciona vidas
        this.centreX = this.scale.width * 0.5;
        this.centreY = this.scale.height * 0.5;
        this.trailPoints = [];
        this.trailCurve = new Phaser.Curves.Spline();
        this.trailGraphics = this.add.graphics().setDepth(100);
        this.trailLines = [];
        this.trailDuration = 0.1;
        this.trailThickness = 4;
        this.trailPointCount = 20;
        this.targetRadius = 100;
        this.targetCircle = new Phaser.Geom.Circle(this.centreX, 300, this.targetRadius);
        
        // Remove cursorType, deixa só cursorColor
        this.cursorColors = [0xe74c3c, 0x2ecc40, 0x3498db]; // azul, vermelho, verde
        this.cursorColorIndex = 0;
        this.cursorColor = this.cursorColors[this.cursorColorIndex];

        // Combo meter
        this.comboMeter = 1.0;
        this.comboSequenceColor = null;
        this.comboSequenceCount = 0;
        // Texto do combo
        this.comboText = null;

        // Barra de progresso
        this.fruitCutCount = 0;
        this.barMaxWidth = 500;
        this.barHeight = 24;
        this.barCurrentWidth = 0;
        this.barFruitsGoal = 15;
        this.barGraphics = null;

        this.isFreezeActive = false;
        this.freezeTimer = null;
    }

    initGameUi ()
    {
        // Calcula espaçamento igual para três textos na parte superior
        const spacing = this.scale.width / 3;
        const y = 20;

        // Vidas (esquerda)
        this.livesText = this.add.text(spacing * 0 + spacing / 2, y, 'Vidas: 3', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ff5555',
            stroke: '#000000', strokeThickness: 8,
        })
            .setOrigin(0.5, 0)
            .setDepth(100);

        // Pontuação (centro)
        this.scoreText = this.add.text(spacing * 1 + spacing / 2, y, 'Pontuação: 0', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
        })
            .setOrigin(0.5, 0)
            .setDepth(100);

        // Combo (direita)
        this.comboText = this.add.text(spacing * 2 + spacing / 2, y, 'ComboMeter = 1.0x', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffe066',
            stroke: '#000000', strokeThickness: 8,
        }).setOrigin(0.5, 0).setDepth(100);

        // Texto tutorial central
        this.tutorialText = this.add.text(this.centreX, this.centreY, 'Tap to start!', {
            fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100);

        // Texto Game Over
        this.gameOverText = this.add.text(this.scale.width * 0.5, this.scale.height * 0.5, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100)
            .setVisible(false);

        // Barra azul central inferior
        const barX = (this.scale.width - this.barMaxWidth) / 2;
        const barY = this.scale.height - 60;
        this.barGraphics = this.add.graphics();
        this.barGraphics.setDepth(200);
        this.barGraphics.x = barX;
        this.barGraphics.y = barY;
        this.drawProgressBar();
    }

    initAnimations ()
    {
        // this.anims.create({
        //     key: ANIMATION.explosion.key,
        //     frames: this.anims.generateFrameNumbers(ANIMATION.explosion.texture, ANIMATION.explosion.config),
        //     frameRate: ANIMATION.explosion.frameRate,
        //     repeat: ANIMATION.explosion.repeat
        // });
    }

    initPhysics ()
    {
        this.foodGroup = this.add.group();
        this.enemyBulletGroup = this.add.group();
        this.playerBulletGroup = this.add.group();
    }

    initPlayer ()
    {
        this.player = new Player(this, this.centreX, this.scale.height - 100, 8);
    }

    initInput ()
    {
        this.input.on('pointermove', (pointer) =>
        {
            // if (this.trailPoints.length > 4)
            // {
            //     const trailPoint = this.trailPoints[ this.trailPoints.length - 1 ];
            //     this.trailLines.push(new Phaser.Geom.Line(trailPoint.x, trailPoint.y, pointer.x, pointer.y));
            // }
            // create a new TrailPoint class and add it to the trailPoints array
            this.trailPoints.push(new TrailPoint(pointer.x, pointer.y, this.trailDuration * 60));
            this.trailCurve.addPoint(pointer.x, pointer.y);
        });

        // Troca de cor do cursor com as teclas 1, 2, 3 (R G B), mas bloqueia durante GOLD TIME
        this.input.keyboard.on('keydown-ONE', () => {
            if (this.isYellowActive) return;
            this.cursorColorIndex = 0; // Red
            this.cursorColor = this.cursorColors[this.cursorColorIndex];
        });
        this.input.keyboard.on('keydown-TWO', () => {
            if (this.isYellowActive) return;
            this.cursorColorIndex = 1; // Green
            this.cursorColor = this.cursorColors[this.cursorColorIndex];
        });
        this.input.keyboard.on('keydown-THREE', () => {
            if (this.isYellowActive) return;
            this.cursorColorIndex = 2; // Blue
            this.cursorColor = this.cursorColors[this.cursorColorIndex];
        });

        // pointerdown once event
        this.input.once('pointerdown', () =>
        {
            if (!this.gameStarted)
            {
                this.startGame();
            }
        });

        // phaser time loop
        // this.time.addEvent({
        //     delay: 1000,
        //     callback: this.addFood,
        //     callbackScope: this,
        //     loop: true
        // });
    }

    drawSlash ()
    {
        this.trailGraphics.clear();
        // Iterate through the trailPoints array and draw a line between each point
        for (let i = 0; i < this.trailPoints.length; i++)
        {
            const trailPoint = this.trailPoints[ i ];
            trailPoint.updateTime(1);
            // If the time left for the trail point is less than 0, remove it
            if (trailPoint.getTimeLeft() < 0)
            {
                this.trailPoints.splice(i, 1);
                this.trailCurve.points.splice(i, 1);
                continue;
            }

            // If there is more than one point in the array
            if (i > 4)
            {
                // Usa a cor do cursor
                this.trailGraphics.lineStyle(this.trailThickness, this.cursorColor, 1);
                this.trailCurve.draw(this.trailGraphics, 64);
            }
        }
    }

    checkCollisions ()
    {
        if (this.trailPoints.length < 4) return;

        const points = this.trailCurve.getDistancePoints(this.trailPointCount);
        // check between sprites and the curve
        this.foodGroup.getChildren().forEach((food) =>
        {
            food.checkCollision(points);
        });
    }

    startGame ()
    {
        this.gameStarted = true;
        this.tutorialText.setVisible(false);
        this.addFoodWave();
    }

    addFoodWave ()
    {
        const randomCount = Phaser.Math.Between(1, 5);
        const randomInterval = Phaser.Math.Between(100, 500);

        this.time.addEvent(
            {
                delay: randomInterval,
                callback: this.addFood,
                callbackScope: this,
                repeat: randomCount
            }
        );
    }

    addFood ()
    {
        // 10% chance de ser bomba
        if (Phaser.Math.FloatBetween(0, 1) < 0.10) {
            this.foodGroup.add(new Bomb(this, this.targetCircle));
        } else if (Phaser.Math.FloatBetween(0, 1) < 0.05) {
            this.foodGroup.add(new SuperBanana(this, this.targetCircle));
        } else {
            // 30% chance para cada fruta
            const r = Phaser.Math.FloatBetween(0, 1);
            if (r < 1/3) {
                this.foodGroup.add(new RedFruit(this, this.targetCircle));
            } else if (r < 2/3) {
                this.foodGroup.add(new GreenFruit(this, this.targetCircle));
            } else {
                this.foodGroup.add(new BlueFruit(this, this.targetCircle));
            }
        }
    }

    removeFood (food)
    {
        this.foodGroup.remove(food, true, true);

        if (this.foodGroup.getChildren().length === 0)
        {
            this.time.delayedCall(1000, () =>
            {
                this.addFoodWave();
            });
        }
    }

    removeItem(item) {
        this.foodGroup.remove(item, true, true);
    }

    addExplosion (x, y)
    {
        new Explosion(this, x, y);
    }

    sliceFruit ()
    {

    }

    updateScore (points)
    {
        this.score += points;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    fruitCutProgress() {
        this.fruitCutCount++;
        this.updateProgressBar();
        if (this.fruitCutCount >= this.barFruitsGoal) {
            this.barCurrentWidth = this.barMaxWidth;
            this.drawProgressBar();
        }
    }

    updateLives (change = 0) {
        this.lives += change;
        if (this.lives < 0) this.lives = 0;
        this.livesText.setText(`Vidas: ${this.lives}`);
        if (this.lives === 0) {
            this.GameOver();
        }
    }

    updateComboText () 
    {
        this.comboText.setText(`ComboMeter = ${this.comboMeter.toFixed(1)}x`);
    }

    drawProgressBar() 
    {
        this.barGraphics.clear();
        // Fundo da barra (cinza)
        this.barGraphics.fillStyle(0x222f3e, 0.5);
        this.barGraphics.fillRect(0, 0, this.barMaxWidth, this.barHeight);
        // Barra azul
        this.barGraphics.fillStyle(0x3498db, 1);
        this.barGraphics.fillRect(0, 0, this.barCurrentWidth, this.barHeight);
        // Borda
        this.barGraphics.lineStyle(3, 0xffffff, 1);
        this.barGraphics.strokeRect(0, 0, this.barMaxWidth, this.barHeight);
    }

    updateProgressBar() 
    {
        this.barCurrentWidth = Math.min(this.barMaxWidth * (this.fruitCutCount / this.barFruitsGoal), this.barMaxWidth);
        this.drawProgressBar();
    }

    showFreezeText() 
    {
        if (this.freezeText && this.freezeText.active) {
            this.freezeText.destroy();
        }
        this.freezeText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            'FREEZE',
            {
                fontFamily: 'Arial Black',
                fontSize: 96,
                color: '#3498db',
                stroke: '#000',
                strokeThickness: 10,
                align: 'center'
            }
        ).setOrigin(0.5).setDepth(999);
        this.time.delayedCall(1000, () => {
            if (this.freezeText) this.freezeText.destroy();
        });
        this.applyFreezeEffect();
    }

    applyFreezeEffect() 
    {
        // Ativa flag global e timer
        this.isFreezeActive = true;
        if (this.freezeTimer) this.freezeTimer.remove(false);
        this.freezeTimer = this.time.delayedCall(10000, () => {
            this.isFreezeActive = false;
        });
    }

    onSuperBananaCut(superBanana) 
    {
        this.removeFood(superBanana);
        // Aplica o tint amarelo em todas as frutas e no cursor
        this.isYellowActive = true;
        this.foodGroup.getChildren().forEach(obj => {
            if (obj.setTint) obj.setTint(0xfff200);
            obj._isYellow = true;
        });
        this.cursorColor = 0xfff200;
        // Exibe texto GOLD TIME
        if (this.goldText && this.goldText.active) {
            this.goldText.destroy();
        }
        this.goldText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            'GOLD TIME',
            {
                fontFamily: 'Arial Black',
                fontSize: 96,
                color: '#fff200',
                stroke: '#000',
                strokeThickness: 10,
                align: 'center'
            }
        ).setOrigin(0.5).setDepth(999);
        this.time.delayedCall(1000, () => {
            if (this.goldText) this.goldText.destroy();
        });
        if (this.yellowTimer) this.yellowTimer.remove(false);
        this.yellowTimer = this.time.delayedCall(10000, () => {
            this.isYellowActive = false;
            this.foodGroup.getChildren().forEach(obj => {
                if (obj.clearTint) obj.clearTint();
                obj._isYellow = false;
            });
            // Restaura cor do cursor
            this.cursorColor = this.cursorColors[this.cursorColorIndex];
        });
    }

    // Garante que novas frutas recebam o tint amarelo durante GOLD TIME
    addFood() {
        // 10% chance de ser bomba
        if (Phaser.Math.FloatBetween(0, 1) < 0.10) {
            const bomb = new Bomb(this, this.targetCircle);
            this.foodGroup.add(bomb);
            return;
        } else if (Phaser.Math.FloatBetween(0, 1) < 0.05) {
            const banana = new SuperBanana(this, this.targetCircle);
            this.foodGroup.add(banana);
            return;
        }
        // 30% chance para cada fruta
        const r = Phaser.Math.FloatBetween(0, 1);
        let fruit;
        if (r < 1/3) {
            fruit = new RedFruit(this, this.targetCircle);
        } else if (r < 2/3) {
            fruit = new GreenFruit(this, this.targetCircle);
        } else {
            fruit = new BlueFruit(this, this.targetCircle);
        }
        if (this.isYellowActive && fruit.setTint) {
            fruit.setTint(0xfff200);
            fruit._isYellow = true;
        }
        this.foodGroup.add(fruit);
    }

    GameOver ()
    {
        this.scene.start('GameOver');
    }
}
