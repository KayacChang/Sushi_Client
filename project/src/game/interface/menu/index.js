import {scaleDown, scaleUp} from '../../effect';

import {Nav} from './Nav';
import {Exchange} from './Exchange';
import {Setting} from './Setting';
import {Information} from './Information';

export function Menu(it) {
    const background = Background(it.getChildByName('background'));

    const exchange = Exchange(it.getChildByName('exchange'));
    const setting = Setting(it.getChildByName('setting'));
    const information = Information(it.getChildByName('information'));

    const pages = {
        exchange,
        setting,
        information,
    };

    Object.values(pages)
        .forEach((page) => {
            page.visible = false;
            page.alpha = 0;

            page.on('close', close);
        });

    let currentPage = undefined;

    const nav = Nav(it.getChildByName('nav'));
    nav.on('close', close);
    nav.on('open', open);

    return Object.assign(it, {
        open, close,

        ...(pages),
    });

    function Background(it) {
        const config = {
            targets: it,
            duration: 500,
            easing: 'easeInOutExpo',
        };

        it.scale.set(0);

        let isOpen = false;

        async function open() {
            if (it.interactive) return;

            it.interactive = true;

            await scaleUp(config).finished;

            isOpen = true;
        }

        async function close() {
            await scaleDown(config).finished;

            it.interactive = false;

            isOpen = false;
        }

        return Object.assign(it, {
            open, close, isOpen,
        });
    }

    async function open(page) {
        it.visible = true;

        if (!nav.isOpen) await nav.open();

        if (!page) return;

        if (!background.isOpen) await background.open();

        if (currentPage && currentPage.name !== page) await currentPage.close();

        await it[page].open();

        currentPage = it[page];
    }

    async function close() {
        if (currentPage) {
            await Promise.all([
                currentPage.close(),
                background.close(),
            ]);

            currentPage = undefined;
        }

        await nav.close();

        it.visible = false;

        it.emit('Closed');
    }
}
