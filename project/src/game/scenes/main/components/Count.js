import {Text} from './Text';
import {fadeIn, fadeOut} from '../../../effect';

const {assign} = Object;

export function Count(it) {
    const text = Text(
        it.getChildByName('pos'), {
            font: '32px Number',
        });

    it.addChild(text);

    return assign(it, {show, hide});

    function show() {
        fadeIn({targets: it});
    }

    function hide() {
        fadeOut({targets: it});
    }
}
