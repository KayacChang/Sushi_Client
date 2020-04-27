import {BitmapText} from 'pixi.js';
import {fadeIn} from '../../../effect';
import anime from 'animejs';

const {assign} = Object;

export function Text({x, y}, config) {
    let {text, ...options} = config;

    text = text || '';

    const it = new BitmapText(text, options);

    it.position.set(x, y);

    it.anchor.set(0.5);

    return assign(it, {incrementTo});

    function incrementTo({score, duration}) {
        let value = 0;

        const proxy = {
            get value() {
                return value;
            },
            set value(newValue) {
                value = newValue;
                it.text = newValue;
            },
        };

        fadeIn({targets: it});

        return anime({
            targets: proxy,
            value: score,
            easing: 'linear',
            round: 1,

            duration,
        });
    }
}
