import {waitByFrameTime} from '@kayac/utils';
import {Text} from './Text';

import {fadeIn, fadeOut} from '../../../effect';

export function BigWin(it) {
    const scores = Text(
        it.getChildByName('scores'),
        {font: '68px Number'}
    );

    it.addChild(scores);

    return {show};

    async function show(score) {
        it.visible = true;

        it.interactive = true;

        let anim = undefined;

        let sound = undefined;

        const bgm = app.resource.get('Normal_BGM').data;
        bgm.fade(1, 0, 1000);

        await transIn();

        await transOut();

        bgm.fade(0, 1, 1000);

        it.interactive = false;

        async function transIn() {
            let skip = false;

            it.once('pointerup', immediate);

            init();

            await waitByFrameTime(1000, isSkip);
            if (!skip) sound = app.sound.play('BigWin_1');

            await waitByFrameTime(250, isSkip);

            showScores();

            await waitByFrameTime(2000, isSkip);

            it.off('pointerup', immediate);

            function init() {
                if (skip) return;

                fadeIn({targets: it});

                it.transition['show'].restart();

                anim = it.transition['show'];
            }

            function showScores() {
                if (skip) return;

                fadeIn({targets: scores});

                anim = scores.incrementTo({score, duration: 2000});
            }

            function immediate() {
                skip = true;

                it.alpha = 1;

                if (anim) anim.pause();

                if (sound) sound.pause();

                it.transition['idle'].restart();

                anim = it.transition['idle'];

                scores.alpha = 1;

                scores.incrementTo({score, duration: 1});

                it.off('pointerup', immediate);
            }

            function isSkip() {
                return skip === true;
            }
        }

        async function transOut() {
            let skip = false;

            it.once('pointerup', immediate);

            await waitByFrameTime(2750, isSkip);

            close();

            await waitByFrameTime(1000, isSkip);

            sound = app.sound.play('BigWin_Sushi');

            reset();

            function close() {
                if (skip) return;

                fadeOut({targets: it});

                it.transition['close'].restart();

                anim = it.transition['close'];
            }

            function reset() {
                it.visible = false;

                scores.text = '';

                it.off('pointerup', immediate);
            }

            function immediate() {
                skip = true;

                if (anim) anim.pause();

                if (sound) sound.pause();

                reset();
            }

            function isSkip() {
                return skip === true;
            }
        }
    }
}
