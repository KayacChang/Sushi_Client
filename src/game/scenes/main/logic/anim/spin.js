import anime from 'animejs';
import {waitByFrameTime, nextFrame} from '@kayac/utils';

import {State} from '../../components';

import {
    getSpinDuration,
    getSpinStopInterval,
} from '../../data';

export async function spin({reels, symbols}) {
    if (!reels.length) reels = [reels];

    let skip = false;

    app.once('QuickStop', immediate);

    await start(reels);

    await duration();

    await stop(reels, symbols);

    app.off('QuickStop', immediate);

    function immediate() {
        return skip = true;
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

            await waitByFrameTime(360);
        }
    }

    async function duration() {
        app.emit('SpinDuration');

        let duration = getSpinDuration();

        while (duration > 0) {
            if (skip) return;

            const t0 = performance.now();

            await nextFrame();

            const t1 = performance.now();

            duration -= (t1 - t0);
        }
    }

    async function stop(reels, symbols) {
        app.emit('SpinStop', reels);

        const tasks = [];

        for (const reel of reels) {
            reel.anim.pause();

            const [offSet, ...display] =
                reel.symbols
                    .concat()
                    .sort(byPos);

            reel.push(...symbols[reel.index]);

            reel.state = State.Stop;

            const task =
                anime
                    .timeline({
                        targets: reel,

                        complete() {
                            app.emit('ReelStop', reel);

                            reel.anim = undefined;
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

                        begin() {
                            app.sound.play('Stop');
                        },
                    })
                    .finished;

            tasks.push(task);

            await waitByFrameTime(getSpinStopInterval(), () => skip === true);
        }

        await Promise.all(tasks);

        app.emit('SpinEnd');

        function byPos(a, b) {
            return a.pos - b.pos;
        }
    }
}
