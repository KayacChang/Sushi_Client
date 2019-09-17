import {Button} from '../components';

import {scaleUp} from '../../effect';
import {throttleBy} from '@kayac/utils';

const {defineProperties} = Object;

import Text from 'pixi.js/lib/core/text/Text';

export function SpinButton(it) {
    it = Button(it);

    overwrite(it);

    const auto = Auto(it);

    it.on('pointerup', throttleBy(play));

    let state = undefined;

    app.on('Idle', reset);

    app.on('QuickStop', () => app.user.auto = 0);

    function reset() {
        state = State(it);

        state.next();

        if (!auto.done) {
            auto.count -= 1;

            return play();
            //
        } else {
            app.user.auto = 0;
        }
    }

    async function play() {
        app.sound.play('spin');

        await state.next();
    }
}

function Auto(parent) {
    const {x, y} = parent.getChildByName('center');

    const style = {
        fontFamily: 'monospace',
        fontSize: 48,
        align: 'center',
        fontWeight: 'bold',
    };

    const it = new Text('1234', style);

    it.position.set(x, y);

    it.anchor.set(.5, .5);

    parent.addChild(it);

    let count = 0;

    app.on('UserAutoChange', () => {
        it.count = getAuto();
    });

    return defineProperties(it, {

        done: {
            get() {
                return count === 0;
            },
        },

        count: {
            get() {
                return count;
            },
            set(newCount) {
                count = newCount;

                update();
            },
        },

    });

    function getAuto() {
        return app.user.autoOptions[app.user.auto];
    }

    function update() {
        if (count === 0) return it.text = '';

        it.text = count;
    }
}

function overwrite(it) {
    //
    return defineProperties(it, {

        enable: {
            get() {
                return it.interactive;
            },
            set(flag) {
                it.interactive = flag;

                setAllChildren(flag ? normal : gray);
            },
        },

    });

    function gray(it) {
        it.tint = 0x9E9E9E;
    }

    function normal(it) {
        it.tint = 0xFFFFFF;
    }

    function setAllChildren(func) {
        it.children.map(func);

        return it.children;
    }
}

async function* State(it) {
    const view = it.getChildByName('play');

    yield onNormal();

    yield await onSpin();

    yield onStop();

    function onNormal() {
        view.visible = true;

        it.enable = !insufficientBalance();
    }

    async function onSpin() {
        view.visible = false;

        await Promise.all([
            send(),
            animation(it),
        ]);
    }

    function onStop() {
        it.enable = false;

        app.emit('QuickStop');
    }
}

async function animation(it) {
    //
    await scaleUp({
        targets: it,

        y: {value: [0.8, 1]},
        x: {value: [0.8, 1], delay: 120},

        duration: 300,
    })
        .finished;
}

async function send() {
    app.user.cash -= app.user.currentBet;
    app.user.lastWin = 0;

    const result = await app.service.sendOneRound({
        key: process.env.KEY,
        bet: app.user.bet,
    });

    return app.emit('GameResult', result);
}

function insufficientBalance() {
    return app.user.cash < app.user.currentBet;
}
