import {Page} from '../Page';
import {Button} from '../../components';
import anime from 'animejs';

export function Setting(it) {
    it = Page(it);

    Volume({
        label: child('label@volume'),
        output: child('level@volume'),
        prev: child('prev@volume'),
        next: child('next@volume'),
    });

    Speed({
        label: child('label@speed'),
        output: child('level@speed'),
        prev: child('prev@speed'),
        next: child('next@speed'),
    });

    Bet({
        label: child('label@bet'),
        output: child('level@bet'),
        prev: child('prev@bet'),
        next: child('next@bet'),
    });

    Auto({
        label: child('label@auto'),
        output: child('level@auto'),
        prev: child('prev@auto'),
        next: child('next@auto'),
    });

    Cond({
        key: 'on_single_win_of_at_least',

        label: child('label@cond1'),
        output: child('level@cond1'),
        prev: child('prev@cond1'),
        next: child('next@cond1'),
    });

    Cond({
        key: 'if_cash_increases_by',

        label: child('label@cond2'),
        output: child('level@cond2'),
        prev: child('prev@cond2'),
        next: child('next@cond2'),
    });

    Cond({
        key: 'if_cash_decreases_by',

        label: child('label@cond3'),
        output: child('level@cond3'),
        prev: child('prev@cond3'),
        next: child('next@cond3'),
    });

    Toggle({
        label: child('label@effects'),
        output: child('ball@effects'),
        btn: child('frame@effects'),

        value: app.sound.effects,

        onChange(value) {
            app.sound.effects = value;
        },
    });

    Toggle({
        label: child('label@ambience'),
        output: child('ball@ambience'),
        btn: child('frame@ambience'),

        value: app.sound.ambience,

        onChange(value) {
            app.sound.ambience = value;
        },
    });

    Toggle({
        label: child('label@cond0'),
        output: child('ball@cond0'),
        btn: child('frame@cond0'),

        value: app.user.autoStopCondition['on_any_win'],

        onChange(value) {
            app.user.autoStopCondition['on_any_win'] = value;
        },
    });

    return it;

    function child(name) {
        return it.getChildByName(name);
    }
}

function Volume({label, output, prev, next}) {
    //
    return Control({
        prev, next,

        value: app.sound.volume() * 10,

        onChange,
    });

    function onChange(value) {
        output.text = value;

        app.sound.volume(value / 10);

        next.enable = (value < 10);
        prev.enable = (value > 0);

        return (value < 10) && (value > 0);
    }
}

function Speed({label, output, prev, next}) {
    const options = app.user.speedOptions;

    return Control({
        prev, next,

        value: app.user.speed,

        onChange,
    });

    function onChange(value) {
        output.text = options[value];

        app.user.speed = value;

        next.enable = (value < options.length - 1);
        prev.enable = (value > 0);

        return (value > 0) && (value < options.length - 1);
    }
}

function Bet({label, output, prev, next}) {
    const options = app.user.betOptions;

    return Control({
        prev, next,

        value: app.user.bet,

        onChange,
    });

    function onChange(value) {
        output.text = options[value];

        app.user.bet = value;

        prev.enable = (value > 0);
        next.enable = (value < options.length - 1);

        return (value > 0) && (value < options.length - 1);
    }
}

function Auto({label, output, prev, next}) {
    const options = app.user.autoOptions;

    return Control({
        prev, next,

        value: app.user.bet,

        onChange,
    });

    function onChange(value) {
        output.text = options[value];

        app.user.auto = value;

        prev.enable = (value > 0);
        next.enable = (value < options.length - 1);

        return (value > 0) && (value < options.length - 1);
    }
}

function Cond({label, output, prev, next, key}) {
    const condition = app.user.autoStopCondition;

    return Control({
        prev, next,

        value: condition[key],

        onChange,
    });

    function onChange(value) {
        output.text = value;

        condition[key] = value;

        prev.enable = (value > 0);

        return (value > 0);
    }
}

function Control({prev, next, value, onChange}) {
    //
    prev = Button(prev);
    prev.on('pointerdown', () => onHold(prev, onPrev));


    next = Button(next);
    next.on('pointerdown', () => onHold(next, onNext));

    onChange(value);

    function onHold(it, func) {
        let hold = true;

        let notDone = true;

        it.once('pointerup', () => hold = false);

        update();

        const start = performance.now();

        (function call() {
            const duration = performance.now() - start;

            if (duration > 1000) update();

            if (!hold || !notDone) return;

            requestAnimationFrame(call);
        })();

        function update() {
            func();

            notDone = onChange(value);
        }
    }

    function onPrev() {
        value -= 1;
    }

    function onNext() {
        value += 1;
    }
}

function Toggle({label, output, btn, value, onChange}) {
    //
    btn = Button(btn);
    btn.on('click', trigger);

    const distance = output.width;

    let skip = false;

    if (!value) {
        output.x -= distance;

        output.alpha -= 0.7;
    }

    async function update() {
        skip = true;

        onChange(value);

        const vector = value ? '+=' : '-=';

        await anime({
            targets: output,
            x: vector + distance,

            alpha: vector + 0.7,

            easing: 'easeOutCirc',

            duration: 260,
        }).finished;

        skip = false;
    }

    async function trigger() {
        if (skip) return;

        value = !value;

        await update();
    }
}
