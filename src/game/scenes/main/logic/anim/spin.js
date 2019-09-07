import anime from 'animejs';
import {wait, nextFrame} from '@kayac/utils';

import {State} from '../../components';

import {
    getSpinDuration,
} from '../../data';

export async function spin({reels, symbols}) {
    if (!reels.length) reels = [reels];

    await start(reels);

    await duration();

    await stop(reels, symbols);
}

async function start(reels) {
    app.emit('SpinStart', reels);

    for (const reel of reels) {
        reel.state = State.Spin;

        reel.anim =
            anime
                .timeline({
                    targets: reel,
                    easing: 'linear',
                })
                .add({
                    pos: '+=' + 220,
                    duration: 34000,
                });

        await wait(360);
    }
}

async function duration() {
    app.emit('SpinDuration');

    let duration = getSpinDuration();
    app.once('QuickStop', () => duration = 0);

    while (duration > 0) {
        const t0 = performance.now();

        await nextFrame();

        const t1 = performance.now();

        duration -= (t1 - t0);
    }
}

async function stop(reels, symbols) {
    app.emit('SpinStop', reels);

    for (const reel of reels) {
        reel.anim.pause();

        const [offSet, ...display] =
            reel.symbols
                .concat()
                .sort(byPos);

        reel.push(...symbols[reel.index]);

        reel.state = State.Stop;

        await anime
            .timeline({
                targets: reel,

                complete() {
                    app.emit('ReelStop', reel);
                },
            })
            .add({
                easing: 'linear',
                pos: '+=' + display.length,
                duration: 1000,
            })
            .add({
                pos: '-=' + offSet.pos,
                duration: 500,
            })
            .finished;

        reel.anim = undefined;
    }

    app.emit('SpinEnd');

    function byPos(a, b) {
        return a.pos - b.pos;
    }
}
