import NORMAL_BGM_MP3 from '../assets/sound/mp3/Normal_BGM.mp3';
import NORMAL_BGM_OGG from '../assets/sound/ogg/Normal_BGM.ogg';
import NORMAL_BGM_WEBM from '../assets/sound/webm/Normal_BGM.webm';

import STOP_MP3 from '../assets/sound/mp3/Stop.mp3';
import STOP_OGG from '../assets/sound/ogg/Stop.ogg';
import STOP_WEBM from '../assets/sound/webm/Stop.webm';

import CONNECTION_MP3 from '../assets/sound/mp3/Symbol_Connect.mp3';
import CONNECTION_OGG from '../assets/sound/ogg/Symbol_Connect.ogg';
import CONNECTION_WEBM from '../assets/sound/webm/Symbol_Connect.webm';

export const sounds = [
    {
        type: 'sound',
        subType: 'ambience',
        name: 'Normal_BGM',
        loop: true,
        src: [
            NORMAL_BGM_WEBM,
            NORMAL_BGM_OGG,
            NORMAL_BGM_MP3,
        ],
    },

    {
        type: 'sound',
        subType: 'effects',
        name: 'Stop',
        src: [
            STOP_WEBM,
            STOP_OGG,
            STOP_MP3,
        ],
    },

    {
        type: 'sound',
        subType: 'effects',
        name: 'Connect',
        src: [
            CONNECTION_WEBM,
            CONNECTION_OGG,
            CONNECTION_MP3,
        ],
    },
];
