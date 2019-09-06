import {Page} from '../Page';
import {Button} from '../../components';
import {move, twink} from '../../../effect';

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

function isFunction(value) {
    return typeof value === 'function';
}

export function Information(it) {
    it = Page(it);

    const carousel = Carousel(select('carousel'));

    const prevButton = Button(select('arrow@prev'));
    prevButton.on('click', onClick(prevButton, () => carousel.prev()));

    const nextButton = Button(select('arrow@next'));
    nextButton.on('click', onClick(nextButton, () => carousel.next()));

    const tabs = select(({name}) => name.includes('tab'));

    onChange(carousel.page);

    carousel.on('Change', onChange);

    return it;

    function onChange(page) {
        tabs.forEach((it) => it.alpha = 0);

        tabs[page].alpha = 1;
    }

    function onClick(it, func) {
        let skip = false;

        return async function call() {
            if (skip) return;

            skip = true;

            await Promise.all([
                func(),
                twink({targets: it, duration: 360}),
            ]);

            skip = false;
        };
    }

    function select(arg) {
        if (isString(arg)) return it.getChildByName(arg);

        else if (isFunction(arg)) return it.children.filter(arg);
    }
}

function Carousel(it) {
    const pages =
        it.children
            .filter(({name}) => name.includes('page'));

    const distance = pages[0].width;

    Object.defineProperties(it, {
        page: {
            get: () => Math.abs(pages[0].x / distance),
        },
    });

    return Object.assign(it, {prev, next});

    async function movePage(vector) {
        await move({
            targets: pages,
            x: vector + distance,

            easing: 'easeOutCirc',

            duration: 360,
        }).finished;

        it.emit('Change', it.page);
    }

    async function prev() {
        if (it.page <= 0) return;

        await movePage('+=');
    }

    async function next() {
        if (it.page >= pages.length - 1) return;

        await movePage('-=');
    }
}
