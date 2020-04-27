import {Text} from './Text';
import {fadeIn, fadeOut} from '../../../effect';

const {assign, defineProperties} = Object;

export function Count(it) {
    const counter = Text(
        it.getChildByName('pos'), {
            font: '32px Number',
        });

    it.addChild(counter);

    defineProperties(it, {
        text: {
            get() {
                return counter.text;
            },
            set(value) {
                counter.text = value;
            },
        },
    });

    return assign(it, {show, hide});

    function show() {
        fadeIn({targets: it});
    }

    function hide() {
        fadeOut({targets: it});
    }
}
