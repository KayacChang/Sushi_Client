export * from './data';

import {addPackage} from 'pixi_fairygui';

import {Main} from './main';
import {Menu} from './menu';

const {assign} = Object;

export function create() {
    const create = addPackage(app, 'assets');
    const it = create('UserInterface');

    const main = Main(it.getChildByName('main'));
    const menu = Menu(it.getChildByName('menu'));

    main.menuButton.on('pointerup', () => openMenu());

    app.control = it;

    it.visible = false;

    return assign(it, {main, menu});

    async function openMenu(page) {
        main.menuButton.interactive = false;

        await menu.open(page);

        const off = main.whenClickOutsideClose(menu);

        menu.once('Closed', onMenuClose);

        function onMenuClose() {
            off();

            main.menuButton.interactive = true;
        }
    }
}
