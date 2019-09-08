import {pauseAll} from './index';

export function PayLine(it) {
    pauseAll(it);

    clear();

    it.alpha = 0;

    app.on('SpinStart', clear);

    return Object.assign(it, {show});

    function clear() {
        it.alpha = 0;

        it.children
            .forEach((child) => child.alpha = 0);
    }

    function show(lineId) {
        it.alpha = 1;

        lineId = String(lineId).padStart(2, '0');

        const anim = it.transition[lineId];

        anim.restart();

        return function close() {
            anim.pause();

            clear();
        };
    }
}
