import {fadeIn, fadeOut} from '../../../effect';

import {Button} from '../../components';

export function NavButton(it) {
    it = Button(it);

    const config = {
        targets: it,
        duration: 320,
        easing: 'easeOutQuad',
    };

    const alpha = it.alpha;

    async function open() {
        await fadeIn({
            ...(config),

            alpha,
        }).finished;

        it.interactive = true;
    }

    async function close() {
        it.interactive = false;

        await fadeOut(config).finished;
    }

    return Object.assign(it, {open, close});
}
