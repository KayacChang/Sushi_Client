import {addPackage} from 'pixi_fairygui';

import {Slot, Conveyor, Grid, PayLine, Bonus, BigWin} from './components';

import {symbolConfig} from './data';
import {logic, preprocess} from './logic';
import {fadeIn, fadeOut} from '../../effect';
import {isFunction, isString, wait} from '@kayac/utils';

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

    const bonus = Bonus(select('bonus'));
    const bigWin = BigWin(select('bigWin'));
    const freeGame = FreeGame(select('freeGame'));

    const grid = Grid(select('grid'));

    const payLine = PayLine(select('line'));

    logic({
        slot,
        grid,
        payLine,

        showBonus,
        showBigWin,
        showFreeGame,
        hideFreeGame,
    });

    return scene;

    async function showBonus(score) {
        await hideControlBar(call);

        async function call() {
            await bonus.show(score);
        }
    }

    async function showBigWin(score) {
        await hideControlBar(call);

        async function call() {
            await bigWin.show(score);
        }
    }

    async function showFreeGame() {
        await hideControlBar(call);

        async function call() {
            await freeGame.show(changeBG);
        }

        function changeBG() {
            select('bg@normal').alpha = 0;
        }
    }

    async function hideFreeGame() {
        await hideControlBar(call);

        async function call() {
            await freeGame.show(changeBG);
        }

        function changeBG() {
            select('bg@normal').alpha = 1;
        }
    }

    async function hideControlBar(func) {
        const targets = app.control;

        await fadeOut({targets}).finished;

        await func();

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

    function isConveyor({name}) {
        return name.includes('conveyor');
    }

    function select(arg) {
        if (isString(arg)) return scene.getChildByName(arg);

        else if (isFunction(arg)) return scene.children.filter(arg);
    }
}

function FreeGame(it) {
    //
    return {show};

    async function show(func) {
        it.alpha = 1;

        it.transition['anim'].restart();

        await wait(1000);

        func();

        await wait(1500);

        it.alpha = 0;
    }
}


