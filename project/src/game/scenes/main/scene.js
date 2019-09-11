import {addPackage} from 'pixi_fairygui';

import {Slot, Conveyor, Grid, PayLine, Bonus, BigWin} from './components';

import {symbolConfig} from './data';
import {logic, preprocess} from './logic';
import {fadeIn, fadeOut} from '../../effect';
import {isFunction, isString, wait, waitByFrameTime} from '@kayac/utils';

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

    app.on('SpinStart', whenSlotStateChange);
    app.on('SpinStop', whenSlotStateChange);
    app.once('Idle', onIdle);

    return scene;

    async function onIdle() {
        scene.transition['anim'].pause();

        const loadScene =
            app.stage.getChildByName('LoadScene');

        await fadeOut({targets: loadScene, duration: 3000}).finished;

        app.stage.removeChild(loadScene);

        const feature = scene.getChildByName('feature');

        feature.interactive = true;

        feature.once('click', firstClick);

        async function firstClick() {
            app.sound.play('spin');

            feature.interactive = false;

            await fadeOut({targets: feature}).finished;

            scene.removeChild(feature);

            scene.transition['anim'].play();

            await waitByFrameTime(1000);

            app.control.visible = true;

            fadeIn({targets: app.control, alpha: [0, 1], duration: 2000});

            const bgm = app.sound.play('Normal_BGM');
            bgm.fade(0, 1, 1000);
        }
    }

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


