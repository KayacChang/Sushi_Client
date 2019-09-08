import {wait} from '@kayac/utils';
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
        fadeIn({targets: it});

        it.transition['anim'].restart();

        await wait(1250);

        fadeIn({targets: scores});

        await scores.incrementTo({score, duration: 2000});

        await wait(2750);

        it.transition['close'].restart();

        await fadeOut({targets: it}).finished;

        scores.text = '';
    }
}
