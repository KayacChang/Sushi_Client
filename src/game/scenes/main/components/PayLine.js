import {pauseAll} from './index';

export function PayLine(it) {
    pauseAll(it);

    it.children
        .forEach((child) => child.alpha = 0);

    it.alpha = 0;

    return Object.assign(it, {show});

    function show(lineId) {
        it.alpha = 1;

        lineId = String(lineId).padStart(2, '0');

        const anim = it.transition[lineId];

        anim.restart();

        anim.loop = true;

        return function close() {
            it.alpha = 0;

            anim.loop = false;

            anim.pause();

            it.getChildByName(lineId).alpha = 0;
        };
    }
}
