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

export function logic(args) {
    const {
        slot, grid, payLine, count,
        showBonus, showBigWin, showFreeGame, hideFreeGame,
    } = args;

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
            });

        if (isBigWin(scores)) {
            await waitByFrameTime(360);

            await showBigWin(scores);
        }

        await clear(scores);

        const {bonus} = normalGame;

        if (bonus) {
            await waitByFrameTime(360);

            await showBonus(bonus);

            await clear(bonus);
        }

        if (freeGame) {
            await waitByFrameTime(1200);

            app.user.lastWin = 0;

            await showFreeGame();

            count.show();

            let totalScores = 0;

            let lastCount = freeGame.length;

            for (const round of freeGame) {
                count.text = lastCount;

                const scores =
                    await NormalGame({
                        result: round,
                        reels: slot.reels,
                        grid,
                        payLine,
                    });

                lastCount -= 1;

                totalScores += scores;

                app.user.lastWin = totalScores;

                const {bonus} = round;

                if (bonus) {
                    await waitByFrameTime(360);

                    await showBonus(bonus);

                    totalScores += bonus;

                    app.user.lastWin = totalScores;
                }
            }

            if (isBigWin(totalScores)) {
                await waitByFrameTime(360);

                await showBigWin(totalScores);
            }

            await clear(totalScores);

            count.hide();

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

    async function clear(scores) {
        app.user.lastWin = scores;
        app.user.cash += scores;

        if (scores) await waitByFrameTime(720);
    }
}
