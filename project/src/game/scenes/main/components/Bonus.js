import {Text} from './Text';
import {waitByFrameTime} from '@kayac/utils';
import {fadeIn, fadeOut} from '../../../effect';

export function Bonus(it) {
    const field = Text(
        it.getChildByName('scores'),
        {font: '64px Number'}
    );

    it.addChild(field);

    const scores =
        it.getChildByName('content')
            .children
            .filter(({name}) => name.includes('score'))
            .reduce((map, child) => {
                const level = String(child.name.split('@')[1]);

                map[level] = child;

                return map;
            }, {});

    return {show};

    async function show(score) {
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

            await waitByFrameTime(960, isSkip);

            if (!skip) sound = app.sound.play('Bonus_1');

            await waitByFrameTime(240, isSkip);

            if (!skip) sound = app.sound.play('Bonus_2');

            await waitByFrameTime(630, isSkip);

            if (!skip) sound = app.sound.play('Bonus_3');

            await waitByFrameTime(710, isSkip);

            if (!skip) sound = app.sound.play('Bonus_4');
            anim = showScores();

            await waitByFrameTime(2000, isSkip);

            it.off('pointerup', immediate);

            async function init() {
                if (skip) return;

                it.alpha = 1;

                it.transition['show'].restart();

                anim = it.transition['show'];

                it.children
                    .filter(({name}) => name && name.includes('light'))
                    .forEach((it) => it.alpha = 0);
            }

            function showScores() {
                if (skip) return;

                fadeIn({targets: scores[score]});

                anim = field.incrementTo({score, duration: 2000});
            }

            function immediate() {
                skip = true;

                if (anim) anim.pause();
                if (sound) sound.pause();

                it.alpha = 1;

                it.transition['idle'].restart();

                anim = it.transition['idle'];

                field.incrementTo({score, duration: 1});
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

            await waitByFrameTime(2000, isSkip);

            reset();

            it.off('pointerup', immediate);

            function close() {
                if (skip) return;

                fadeOut({targets: it});
            }

            function reset() {
                it.alpha = 0;

                field.text = '';
            }

            function immediate() {
                skip = true;
            }

            function isSkip() {
                return skip === true;
            }
        }
    }
}
