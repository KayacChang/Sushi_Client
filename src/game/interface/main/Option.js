import {Button} from '../components';
import {fadeIn, fadeOut, scaleDown, scaleUp} from '../../effect';
import {Inner} from './Inner';

const {assign} = Object;

const TRANS = {
    IN: {easing: 'easeOutCirc', duration: 260},
    OUT: {easing: 'easeInCirc', duration: 260},
};

export function Option(it) {
    it.interactive = true;

    const backButton = Button(it.getChildByName('back'));
    backButton.on('pointerup', close);

    const inner = Inner(it.getChildByName('inner'));

    const frame = it.getChildByName(`state@frame`);

    const state = {};

    ['speed', 'auto', 'bet'].forEach((name) => {
        const button = Button(it.getChildByName(name));

        button.on('pointerup', onOptionClick);

        state[name] = it.getChildByName(`state@${name}`);
    });

    const audio = Audio();

    let current = undefined;

    return assign(it, {
        isOpen: false,
        open,
        close,
    });

    async function open() {
        audio.update();

        const config = {targets: it, ...TRANS.IN};

        await Promise.all([scaleUp(config).finished, fadeIn(config).finished]);

        if (current) await openInner();

        backButton.interactive = true;

        it.isOpen = true;
    }

    async function close() {
        backButton.interactive = false;

        it.isOpen = false;

        const config = {targets: it, ...TRANS.OUT};

        if (current) await closeInner();

        await Promise.all([
            scaleDown(config).finished,
            fadeOut(config).finished,
        ]);

        it.emit('Closed');
    }

    async function openInner() {
        const targets = [frame, state[current]];

        scaleUp({targets, ...TRANS.IN});

        inner.update(current);

        if (current === 'bet') {
            app.user.betOptionsHotKey.forEach((option, index) => {
                if (option > app.user.cash) {
                    inner.selects[index].visible = false;
                }
            });
        }

        await inner.open();
    }

    async function closeInner() {
        const targets = [frame, state[current]];

        scaleDown({targets, ...TRANS.OUT});

        await inner.close();
    }

    async function onOptionClick() {
        backButton.off('pointerup', close);

        const reset = await hide();

        current = this.name;

        await openInner();

        backButton.once('pointerup', prev);

        async function prev() {
            await closeInner();

            await reset();

            current = undefined;

            backButton.on('pointerup', close);
        }
    }

    async function hide() {
        const targets = it.children.filter(({name}) => match(name));

        await scaleDown({targets, ...TRANS.OUT}).finished;

        return async function reset() {
            await scaleUp({targets, ...TRANS.IN}).finished;
        };

        function match(name) {
            const KEYS = ['speed', 'auto', 'bet', 'audio', 'exchange'];

            return KEYS.includes(name) || name.split('@')[0] === 'img';
        }
    }

    function Audio() {
        const open = it.getChildByName('img@audio_open');
        const close = it.getChildByName('img@audio_close');

        update();

        const audioButton = Button(it.getChildByName('audio'));

        audioButton.on('pointerup', onAudioClick);

        return {update};

        function update() {
            const state = app.sound.mute();

            open.visible = !state;
            close.visible = state;
        }

        function onAudioClick() {
            const state = app.sound.mute();

            app.sound.mute(!state);

            update();
        }
    }
}
