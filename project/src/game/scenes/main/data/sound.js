import NORMAL_BGM_MP3 from '../assets/sound/mp3/Normal_BGM.mp3';
import NORMAL_BGM_OGG from '../assets/sound/ogg/Normal_BGM.ogg';
import NORMAL_BGM_WEBM from '../assets/sound/webm/Normal_BGM.webm';

import STOP_MP3 from '../assets/sound/mp3/Stop_Spin.mp3';
import STOP_OGG from '../assets/sound/ogg/Stop_Spin.ogg';
import STOP_WEBM from '../assets/sound/webm/Stop_Spin.webm';

import NORMAL_CONNECTION_MP3 from '../assets/sound/mp3/Normal_Symbol_Connect.mp3';
import NORMAL_CONNECTION_OGG from '../assets/sound/ogg/Normal_Symbol_Connect.ogg';
import NORMAL_CONNECTION_WEBM from '../assets/sound/webm/Normal_Symbol_Connect.webm';

import SPECIAL_CONNECTION_MP3 from '../assets/sound/mp3/Special_Symbol_Connect.mp3';
import SPECIAL_CONNECTION_OGG from '../assets/sound/ogg/Special_Symbol_Connect.ogg';
import SPECIAL_CONNECTION_WEBM from '../assets/sound/webm/Special_Symbol_Connect.webm';

import BONUS_1_MP3 from '../assets/sound/mp3/Bonus1.mp3';
import BONUS_1_OGG from '../assets/sound/ogg/Bonus1.ogg';
import BONUS_1_WEBM from '../assets/sound/webm/Bonus1.webm';

import BONUS_2_MP3 from '../assets/sound/mp3/Bonus2.mp3';
import BONUS_2_OGG from '../assets/sound/ogg/Bonus2.ogg';
import BONUS_2_WEBM from '../assets/sound/webm/Bonus2.webm';

import BONUS_3_MP3 from '../assets/sound/mp3/Bonus3.mp3';
import BONUS_3_OGG from '../assets/sound/ogg/Bonus3.ogg';
import BONUS_3_WEBM from '../assets/sound/webm/Bonus3.webm';

import BONUS_4_MP3 from '../assets/sound/mp3/Bonus4.mp3';
import BONUS_4_OGG from '../assets/sound/ogg/Bonus4.ogg';
import BONUS_4_WEBM from '../assets/sound/webm/Bonus4.webm';

import BIGWIN_1_MP3 from '../assets/sound/mp3/BigWin_1.mp3';
import BIGWIN_1_OGG from '../assets/sound/ogg/BigWin_1.ogg';
import BIGWIN_1_WEBM from '../assets/sound/webm/BigWin_1.webm';

import BIGWIN_SUSHI_MP3 from '../assets/sound/mp3/BigWin_Sushi.mp3';
import BIGWIN_SUSHI_OGG from '../assets/sound/ogg/BigWin_Sushi.ogg';
import BIGWIN_SUSHI_WEBM from '../assets/sound/webm/BigWin_Sushi.webm';

import FREE_GAME_OPEN_MP3 from '../assets/sound/mp3/FreeGame_open.mp3';
import FREE_GAME_OPEN_OGG from '../assets/sound/ogg/FreeGame_open.ogg';
import FREE_GAME_OPEN_WEBM from '../assets/sound/webm/FreeGame_open.webm';

import FREE_GAME_CLOSE_MP3 from '../assets/sound/mp3/FreeGame_close.mp3';
import FREE_GAME_CLOSE_OGG from '../assets/sound/ogg/FreeGame_close.ogg';
import FREE_GAME_CLOSE_WEBM from '../assets/sound/webm/FreeGame_close.webm';

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
        name: 'Normal_Connect',
        src: [
            NORMAL_CONNECTION_WEBM,
            NORMAL_CONNECTION_OGG,
            NORMAL_CONNECTION_MP3,
        ],
    },

    {
        type: 'sound',
        subType: 'effects',
        name: 'Special_Connect',
        src: [
            SPECIAL_CONNECTION_WEBM,
            SPECIAL_CONNECTION_OGG,
            SPECIAL_CONNECTION_MP3,
        ],
    },

    {
        type: 'sound',
        subType: 'effects',
        name: 'Bonus_1',
        src: [
            BONUS_1_WEBM,
            BONUS_1_OGG,
            BONUS_1_MP3,
        ],
    },

    {
        type: 'sound',
        subType: 'effects',
        name: 'Bonus_2',
        src: [
            BONUS_2_WEBM,
            BONUS_2_OGG,
            BONUS_2_MP3,
        ],
    },

    {
        type: 'sound',
        subType: 'effects',
        name: 'Bonus_3',
        src: [
            BONUS_3_WEBM,
            BONUS_3_OGG,
            BONUS_3_MP3,
        ],
    },

    {
        type: 'sound',
        subType: 'effects',
        name: 'Bonus_4',
        src: [
            BONUS_4_WEBM,
            BONUS_4_OGG,
            BONUS_4_MP3,
        ],
    },

    {
        type: 'sound',
        subType: 'effects',
        name: 'BigWin_1',
        src: [
            BIGWIN_1_MP3,
            BIGWIN_1_OGG,
            BIGWIN_1_WEBM,
        ],
    },

    {
        type: 'sound',
        subType: 'effects',
        name: 'BigWin_Sushi',
        src: [
            BIGWIN_SUSHI_MP3,
            BIGWIN_SUSHI_OGG,
            BIGWIN_SUSHI_WEBM,
        ],
    },

    {
        type: 'sound',
        subType: 'effects',
        name: 'FreeGame_Open',
        src: [
            FREE_GAME_OPEN_MP3,
            FREE_GAME_OPEN_OGG,
            FREE_GAME_OPEN_WEBM,
        ],
    },

    {
        type: 'sound',
        subType: 'effects',
        name: 'FreeGame_Close',
        src: [
            FREE_GAME_CLOSE_MP3,
            FREE_GAME_CLOSE_OGG,
            FREE_GAME_CLOSE_WEBM,
        ],
    },
];
