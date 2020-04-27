import LOAD_URL from './assets/sprite_sheets/load.fui';
import LOAD_ATLAS0_URL from './assets/sprite_sheets/load@atlas0.png';

import {addPackage} from 'pixi_fairygui';

import {log} from '@kayac/utils';

import {LoadingBar} from './components/LoadingBar';

export function reserve() {
    return [
        {name: 'load.fui', url: LOAD_URL, xhrType: 'arraybuffer'},
        {name: 'load@atlas0.png', url: LOAD_ATLAS0_URL},
    ];
}

export function create() {
    const create = addPackage(app, 'load');

    const scene = create('LoadScene');

    const loadingBar = LoadingBar(scene.getChildByName('loading'));
    const lead = scene.getChildByName('lead');

    app.on('loading', ({progress}, {name}) => {
        log(`Progress: ${progress} %`);
        log(`Resource: ${name}`);

        loadingBar.update(progress);

        lead.x = loadingBar.width;
    });

    return scene;
}
