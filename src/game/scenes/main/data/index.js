import {sprites} from './sprites';
import {symbols, symbolConfig} from './symbols';
import {sounds} from './sound';

import NUMBER from '../assets/fonts/number.xml';
import '../assets/fonts/number.png';

export function reserve() {
    return [
        ...(sprites),
        ...(symbols),
        ...(sounds),

        {name: 'number.png', url: NUMBER},
    ];
}

const MAYBE_BONUS_DURATION = 1000;

const getSpinDuration = () => [1800, 1200, 600][app.user.speed];
const getSpinStopInterval = () => [1200, 750, 300][app.user.speed];


export {
    symbolConfig,

    getSpinDuration,
    getSpinStopInterval,

    MAYBE_BONUS_DURATION,
};

