import {scaleDown, scaleUp} from '../../effect';

import {Nav} from './Nav';
import {Setting} from './Setting';
import {Information} from './Information';

const {values, assign} = Object;

export function Menu(it) {
    const background = Background(it.getChildByName('background'));

    const setting = Setting(it.getChildByName('setting'));
    const information = Information(it.getChildByName('information'));

    const pages = {
        setting,
        information,
    };

    values(pages).forEach((page) => {
        page.visible = false;
        page.alpha = 0;

        page.on('close', close);
    });

    let currentPage = undefined;

    const nav = Nav(it.getChildByName('nav'));
    nav.on('close', close);
    nav.on('open', open);

    return assign(it, {
        isOpen: false,

        open,
        close,

        ...pages,
    });

    function Background(it) {
        const config = {
            targets: it,
            duration: 500,
            easing: 'easeInOutExpo',
        };

        it.scale.set(0);

        async function open() {
            if (it.interactive) return;

            it.interactive = true;

            it.isOpen = true;

            await scaleUp({...config, x: [0, 1], y: [0, 1]}).finished;
        }

        async function close() {
            await scaleDown({...config, x: [1, 0], y: [1, 0]}).finished;

            it.interactive = false;

            it.isOpen = false;
        }

        return assign(it, {
            open,
            close,
            isOpen: false,
        });
    }

    async function open(page) {
        it.visible = true;

        it.isOpen = true;

        if (!nav.isOpen) await nav.open();

        if (!page) return;

        if (!background.isOpen) await background.open();

        if (currentPage && currentPage.name !== page) await currentPage.close();

        await it[page].open();

        currentPage = it[page];
    }

    async function close() {
        if (currentPage) {
            await currentPage.close();

            currentPage = undefined;
        }

        if (background.isOpen) await background.close();

        await nav.close();

        it.isOpen = false;

        it.visible = false;

        it.emit('Closed');
    }
}
