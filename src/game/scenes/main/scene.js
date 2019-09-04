import {addPackage} from 'pixi_fairygui';

import {Slot, Conveyor, Grid, PayLine, Bonus, BigWin} from './components';

import {symbolConfig} from './data';
import {logic, preprocess} from './logic';
import {fadeIn, fadeOut} from '../../effect';

function isConveyor({name}) {
    return name.includes('conveyor');
}

export function create({normalTable}) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    const reelStrips = preprocess(normalTable);

    const slot = Slot({
        view: scene,
        reelStrips: reelStrips,
        textures: symbolConfig,
    });

    const conveyors =
        scene.children
            .filter(isConveyor)
            .map(Conveyor);

    app.on('SpinStart', whenSlotStateChange);
    app.on('SpinStop', whenSlotStateChange);

    const bonus = Bonus(scene.getChildByName('bonus'));
    const bigWin = BigWin(scene.getChildByName('bigWin'));

    const grid = Grid(scene.getChildByName('grid'));

    const payLine = PayLine(scene.getChildByName('line'));

    logic({
        slot,
        grid,
        payLine,

        showBonus,
        showBigWin,
    });

    return scene;

    async function showBonus(score) {
        const targets = app.control;

        await fadeOut({targets}).finished;

        await bonus.show(score);

        await fadeIn({targets}).finished;
    }

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

    async function showBigWin(score) {
        const targets = app.control;

        await fadeOut({targets}).finished;

        await bigWin.show(score);

        await fadeIn({targets}).finished;
    }
}


