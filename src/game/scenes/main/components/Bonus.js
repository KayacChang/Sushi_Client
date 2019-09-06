import {Text} from './Text';
import {wait} from '@kayac/utils';
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
        it.visible = true;

        it.alpha = 1;

        it.transition['anim'].restart();

        await wait(2500);

        await Promise.all([
            fadeIn({targets: scores[score]}).finished,
            field.incrementTo({score, duration: 2000}),
        ]);

        await wait(2000);

        await fadeOut({targets: it}).finished;

        it.visible = false;

        field.text = '';
    }
}
