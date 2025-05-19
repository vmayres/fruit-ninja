import { Boot } from './scenes/Boot.js';
import { Preloader } from './scenes/Preloader.js';
import { Menu } from './scenes/Menu.js';
import { Controles } from './scenes/Controles.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#fffff',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 1000 }
        }
    },
    scene: [
        Boot,
        Preloader,
        Menu,
        Controles,
        Game,
        GameOver
    ]
};

new Phaser.Game(config);
