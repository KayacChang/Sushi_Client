import {addPackage} from 'pixi_fairygui';

import {Slot, Conveyor} from './components';
import {spin} from './logic/anim';

import {symbolConfig} from './data';
import {logic} from "./logic";

const normalTable = [
    // eslint-disable-next-line max-len
    [6, 11, 2, 7, 11, 9, 3, 11, 9, 0, 7, 10, 4, 12, 9, 0, 7, 8, 4, 13, 9, 3, 8, 4, 12, 14, 10, 1, 8, 9, 6, 8, 11, 3, 7, 8, 5, 14, 10, 11, 7, 9, 5, 12, 11, 2, 7, 9, 5, 1, 11, 13, 1, 3, 9, 2, 4, 1, 5, 8, 7, 5, 12, 2, 8, 6, 12, 8, 11, 10],

    // eslint-disable-next-line max-len
    [12, 10, 7, 6, 10, 4, 14, 10, 6, 0, 9, 4, 12, 10, 7, 0, 10, 4, 12, 13, 2, 7, 9, 5, 12, 14, 3, 7, 12, 10, 0, 12, 2, 7, 5, 12, 11, 14, 7, 8, 6, 10, 2, 8, 10, 5, 6, 3, 9, 5, 12, 13, 11, 8, 1, 11, 6, 1],

    // eslint-disable-next-line max-len
    [5, 10, 6, 1, 7, 9, 3, 12, 10, 0, 7, 10, 5, 12, 10, 0, 6, 10, 3, 13, 10, 1, 9, 4, 11, 14, 7, 9, 4, 11, 0, 7, 9, 4, 11, 2, 6, 14, 4, 11, 2, 10, 6, 9, 4, 8, 1, 11, 5, 9, 5, 13, 3, 6, 8, 3, 11, 2, 5, 10, 3, 12, 8],

    // eslint-disable-next-line max-len
    [8, 11, 9, 2, 6, 7, 13, 12, 9, 0, 6, 1, 4, 11, 10, 0, 5, 6, 2, 13, 10, 5, 11, 7, 3, 14, 10, 1, 6, 8, 0, 12, 10, 7, 5, 11, 3, 14, 10, 3, 6, 7, 3, 1, 9, 0, 5, 7, 2, 12, 1, 13, 5, 7, 4, 2, 9, 12, 4, 8, 11, 4, 9, 1, 4, 8, 4, 12, 10, 1],

    // eslint-disable-next-line max-len
    [4, 10, 9, 1, 4, 7, 3, 12, 6, 0, 4, 6, 3, 12, 8, 0, 4, 11, 2, 13, 8, 5, 1, 6, 2, 14, 8, 4, 1, 7, 3, 12, 1, 2, 5, 6, 9, 14, 8, 1, 5, 7, 3, 11, 9, 0, 4, 6, 2, 10, 8, 13, 5, 7, 2, 11, 8, 1, 5, 7, 3, 12, 10],
];

function preprocess(table) {
    const result = [
        [],
        [],
        [],
    ];

    table.forEach((reel) => {
        reel.forEach((symbol, symbolIndex) => {
            const displayIndex = symbolIndex % result.length;

            result[displayIndex].push(symbol);
        });
    });

    return result;
}

function isConveyor({name}) {
    return name.includes('conveyor');
}

export function create() {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    const reelStrips = preprocess(normalTable);

    const slot = Slot({
        view: scene,
        reelStrips: reelStrips,
        textures: symbolConfig,
    });

    window.spin = (symbols) => spin({
        reels: slot.reels,
        symbols,
    });

    const conveyors =
        scene.children
            .filter(isConveyor)
            .map(Conveyor);

    app.on('SpinStart', whenSlotStateChange);
    app.on('SpinStop', whenSlotStateChange);

    window.bonus = scene.getChildByName('bonus');
    window.bigWin = scene.getChildByName('bigWin');

    logic({
        slot,
    });

    return scene;

    function whenSlotStateChange(reels) {
        for (const reel of reels) {
            reel.once('StateChange', onReelStateChange);

            function onReelStateChange(state) {
                const conveyor = conveyors[reel.index];

                return (
                    (state === 'spin') ? conveyor.start() :
                        (state === 'stop') ? conveyor.stop() :
                            undefined
                );
            }
        }
    }
}

