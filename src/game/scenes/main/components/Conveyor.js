import anime from 'animejs';

export function Conveyor(view) {
    const cols =
        view.children
            .filter(isItem)
            .sort(byX)
            .map(Item);

    let pos = 0;

    let anim = undefined;

    const it = {
        get items() {
            return cols;
        },

        get length() {
            return cols.length;
        },

        get pos() {
            return pos;
        },
        set pos(newPos) {
            pos = newPos;

            update(it, newPos);
        },

        get anim() {
            return anim;
        },
        set anim(newAnim) {
            anim = newAnim;
        },

        start: () => start(it),
        stop: () => stop(it),
    };

    it.pos = 0;

    return it;
}

function Anim(it) {
    if (it.anim) it.anim.pause();

    return (
        anime
            .timeline({
                targets: it,

                begin() {
                    it.anim = this;
                },

                complete() {
                    it.anim = undefined;
                },
            })
    );
}

function start(it) {
    return (
        Anim(it)
            .add({
                easing: 'linear',
                pos: '+=' + 120,
                duration: 10000,
            })
    );
}

function stop(it) {
    return (
        Anim(it)
            .add({
                easing: 'linear',
                pos: '+=' + 10,
                duration: 1000,
            })
            .add({
                pos: '+=' + 1,
                duration: 500,
            })
    );
}

function isItem({name}) {
    return name.includes('col');
}

function byX(a, b) {
    return a.x - b.x;
}

function update(it) {
    it.items
        .forEach((item) => {
            const newPos = getPos(it, item);

            updatePos(item, newPos);
        });
}

function getPos(it, item) {
    return (it.pos + item.initPos) % it.length;
}

function updatePos(item, pos) {
    item.pos = pos;
}

function Item(view, index, items) {
    const offsetX = Number(items[0].x);

    const stepSize = Math.abs(offsetX);

    let pos = index;

    return {
        get initPos() {
            return index;
        },

        get pos() {
            return pos;
        },
        set pos(newPos) {
            pos = newPos;

            view.x = offsetX + (pos * stepSize);
        },
    };
}
