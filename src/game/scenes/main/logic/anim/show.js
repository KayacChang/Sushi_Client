import {waitByFrameTime} from '@kayac/utils';

export async function show({result, reels, grid, payLine}) {
    app.emit('ShowResult', result);

    const {results} = result;

    const lines = [];

    const effects = [];

    const hideSymbols = [];

    const normal = results.filter(({line}) => line !== -1);

    if (normal.length > 0) {
        app.sound.play('Normal_Connect');

        await execute(normal);
    }

    const scatters = results.filter(({line}) => line === -1);

    if (scatters.length > 0) {
        app.sound.play('Special_Connect');

        await execute(scatters);
    }

    app.once('Idle', onIdle);

    app.once('SpinStart', close);

    async function execute(data) {
        let skip = false;

        data.forEach(showOne);

        grid.interactive = true;

        grid.once('click', immediate);

        await waitByFrameTime(2000, isSkip);

        grid.off('click', immediate);

        close();

        function immediate() {
            return skip = true;
        }

        function isSkip() {
            return skip === true;
        }
    }

    function* getResultGen() {
        while (true) {
            for (const result of results) {
                yield result;
            }
        }
    }

    async function onIdle() {
        const results = getResultGen();

        let skip = false;
        (
            async function loop() {
                close();

                showOne(results.next().value);

                await waitByFrameTime(1750);

                if (!skip) loop();
            }
        )();

        app.once('SpinStart', () => skip = true);
    }

    function showOne({line, positions, symbols}) {
        positions.forEach((col, row) => {
            //
            if (col === undefined) return;

            const effect =
                grid[row][col]
                    .getChildByName(String(symbols[row]));

            effect.alpha = 1;

            effect.transition['anim'].pause();
            effect.transition['anim'].restart();

            effects.push(effect);

            const symbol = reels[col].displaySymbols[row];

            symbol.visible = false;

            hideSymbols.push(symbol);
            //
        });

        if (line !== -1) lines.push(payLine.show(line));
    }

    function close() {
        app.off('Idle', onIdle);

        lines.forEach((close) => close());

        hideSymbols.forEach((symbol) => symbol.visible = true);

        effects.forEach((effect) => {
            effect.alpha = 0;

            effect.transition['anim'].pause();
        });
    }
}
