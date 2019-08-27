import {addPackage} from 'pixi_fairygui';

import {Slot} from './components';
import {spin} from './logic/anim';

import {symbolConfig} from './data';


export function create({normalTable}) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    console.log(normalTable);

    global.slot = Slot({
        view: scene,
        reelStrips: normalTable,
        textures: symbolConfig,
    });

    return scene;
}

