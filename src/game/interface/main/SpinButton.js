import {Button} from '../components';

import {scaleUp} from '../../effect';

export function SpinButton(it) {
    it = Button(it);

    const normal = it.getChildByName('play');

    it.on('click', play);

    async function play() {
        animation(it);

        normal.visible = !normal.visible;

        app.user.cash -= app.user.currentBet;
        app.user.lastWin = 0;

        const result = await app.service.sendOneRound({
            key: process.env.KEY,
            bet: app.user.bet,
        });

        return app.emit('GameResult', result);
    }
}

function animation(it) {
    scaleUp({
        targets: it,

        y: {value: [0.8, 1]},
        x: {value: [0.8, 1], delay: 120},

        duration: 300,
    });
}
