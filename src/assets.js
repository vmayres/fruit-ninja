export default {
    // 'audio': {
    //     score: {
    //         key: 'sound',
    //         args: ['assets/sound.mp3', 'assets/sound.m4a', 'assets/sound.ogg']
    //     },
    // },
    'image': {
        bomb: {
            key: 'bomb',
            args: ['assets/bomb.png']
        },
    },
    'spritesheet': {
        tiles: {
            key: 'tiles',
            args: ['assets/tiles.png', {
                frameWidth: 72,
                frameHeight: 72
            }]
        },
        fruitPlus: {
            key: 'fruitPlus',
            args: ['assets/Fruit+.png', {
                frameWidth: 16,
                frameHeight: 16,
                endFrame: (38 * 6) - 1 // 227
            }]
        },
    },
};