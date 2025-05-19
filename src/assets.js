export default {
    // Carrega os audios que seram usados no jogo
    'audio': {
        hit0: {
            key: 'hit0',
            args: ['assets/hit0.mp3']
        },
        hit1: {
            key: 'hit1',
            args: ['assets/hit1.mp3']
        },
        hit2: {
            key: 'hit2',
            args: ['assets/hit2.mp3']
        },
        hit3: {
            key: 'hit3',
            args: ['assets/hit3.mp3']
        },
    },
    //carrega as imagem do jogo
    'image': {
        bomb: {
            key: 'bomb',
            args: ['assets/bomb.png']
        },
    },
    //carrega os spritesheets
    'spritesheet': {
        fruitPlus: {
            key: 'fruitPlus',
            args: ['assets/Fruit+.png', {
                frameWidth: 16,
                frameHeight: 16,
                endFrame: (38 * 6) - 1 // 227
            }]
        },
        splashRGB: {
            key: 'splashRGB',
            args: ['assets/SplashesRGB.png', {
                frameWidth: 32,
                frameHeight: 32,
                endFrame: 2
            }]
        },
    },
};