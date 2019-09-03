import {addPackage} from 'pixi_fairygui';

import {Slot, Conveyor, Grid, PayLine} from './components';

import {symbolConfig} from './data';
import {logic, preprocess} from './logic';
import {wait} from "@kayac/utils";
import {fadeOut} from "../../effect";

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

    const bonus = scene.getChildByName('bonus');
    window.bigWin = scene.getChildByName('bigWin');

    const grid = Grid(scene.getChildByName('grid'));

    const payLine = PayLine(scene.getChildByName('line'));

    logic({
        slot,
        grid,
        payLine,

        showBonus,
    });

    return scene;

    async function showBonus() {
        bonus.visible = true;

        bonus.alpha = 1;

        bonus.transition['anim'].restart();

        await wait(4000);

        await fadeOut({targets: bonus});

        bonus.visible = false;
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
}

