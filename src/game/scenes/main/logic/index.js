import {log, table, divide, wait} from '@kayac/utils';

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

        await clear(scores);

        if (freeGame) {
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

                app.user.lastWin = scores;
                totalScores += scores;
            }

            await clear(totalScores);

            await hideFreeGame();
        }

        app.user.cash = cash;

        log('Round Complete...');
        app.emit('Idle');
    }

    async function clear(scores) {
        if (isBigWin(scores)) await showBigWin(scores);

        app.user.lastWin = scores;
        app.user.cash += scores;

        if (scores > 0) await wait(360);
    }
}

