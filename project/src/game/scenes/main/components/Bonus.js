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

        await transIn();

        await transOut();

        it.interactive = false;

        async function transIn() {
            let skip = false;

            it.once('click', immediate);

            init();

            await waitByFrameTime(2500, isSkip);

            anim = showScores();

            await waitByFrameTime(2000, isSkip);

            it.off('click', immediate);

            function init() {
                if (skip) return;

                it.alpha = 1;

                it.transition['show'].restart();

                anim = it.transition['show'];
            }

            function showScores() {
                if (skip) return;

                fadeIn({targets: scores[score]});

                anim = field.incrementTo({score, duration: 2000});
            }

            function immediate() {
                skip = true;

                anim.pause();

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

            it.once('click', immediate);

            await waitByFrameTime(2750, isSkip);

            close();

            await waitByFrameTime(2000, isSkip);

            reset();

            it.off('click', immediate);

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
