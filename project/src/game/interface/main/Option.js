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

    const inner = Inner(it.getChildByName('inner'));

    ['speed', 'auto', 'bet']
        .forEach((name) => {
            const button = Button(it.getChildByName(name));

            button.on('pointerup', onOptionClick);
        });

    const audio = Audio();

    const exchangeButton = Button(it.getChildByName('exchange'));

    exchangeButton.on('pointerup', openExchange);

    let current = undefined;

    return assign(it, {
        isOpen: false,
        open, close,
    });

    async function open() {
        audio.update();

        if (current) inner.update(current);

        const config = {targets: it, ...TRANS.IN};

        await Promise.all([
            scaleUp(config).finished,
            fadeIn(config).finished,
        ]);

        backButton.interactive = true;
        backButton.once('pointerup', close);

        it.isOpen = true;
    }

    async function close() {
        backButton.interactive = false;

        it.isOpen = false;

        const config = {targets: it, ...TRANS.OUT};

        await Promise.all([
            scaleDown(config).finished,
            fadeOut(config).finished,
        ]);
    }

    async function onOptionClick() {
        backButton.off('pointerup', close);

        const reset = await hide();

        current = this.name;

        inner.update(current);

        await inner.open();

        backButton.once('pointerup', prev);

        async function prev() {
            await inner.close();

            await reset();

            backButton.once('pointerup', close);
        }
    }

    async function hide() {
        const targets =
            it.children
                .filter(({name}) => match(name));

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

    function openExchange() {
        it.emit('OpenExchange');
    }
}
