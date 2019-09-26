import {log, err, table, divide, waitByFrameTime} from '@kayac/utils';

import {NormalGame} from './flow';

const BET_TO_BIGWIN = 10;

function isBigWin(scores) {
    return divide(scores, app.user.currentBet) > BET_TO_BIGWIN;
}

export function preprocess(data) {
    const result = [
        [],
        [],
        [],
    ];

    data.forEach((reel) => {
        reel.forEach((symbol, symbolIndex) => {
            const displayIndex = symbolIndex % result.length;

            result[displayIndex].push(symbol);
        });
    });

    result[1].reverse();

    return result;
}

export function logic({slot, grid, payLine, showBonus, showBigWin, showFreeGame, hideFreeGame}) {
    app.on('GameResult', onGameResult);

    async function onGameResult(result) {
        log('onGameResult =============');
        table(result);

        const {
            cash,
            normalGame,
            freeGame,
        } = result;

        if (normalGame.hasLink) {
            log('onNormalGame =============');
            table(normalGame);
        }

        const scores =
            await NormalGame({
                result: normalGame,
                reels: slot.reels,

                grid,
                payLine,
                showBonus,
            });

        if (isBigWin(scores)) await showBigWin(scores);

        clear(scores);

        if (scores > 0) await waitByFrameTime(60);

        if (freeGame) {
            app.user.lastWin = 0;

            await showFreeGame();

            let totalScores = 0;

            for (const round of freeGame) {
                const scores =
                    await NormalGame({
                        result: round,
                        reels: slot.reels,
                        grid,
                        payLine,
                        showBonus,
                    });

                totalScores += scores;

                app.user.lastWin = totalScores;
            }

            if (isBigWin(totalScores)) {
                await waitByFrameTime(600);

                await showBigWin(totalScores);
            }

            clear(totalScores);

            await hideFreeGame();
        }

        if (app.user.cash !== cash) {
            err(`
            Inconsistent data between Client App and Server:
            Cash
                Client: ${app.user.cash},
                Server: ${cash},
            `);
        }

        log('Round Complete...');
        app.emit('Idle');
    }

    function clear(scores) {
        app.user.lastWin = scores;
        app.user.cash += scores;
    }
}
