import {log, table, divide, waitByFrameTime} from '@kayac/utils';

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

        const diff = app.user.cash - cash;
        if (app.user.auto) app.user.totalWin += diff;

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

        clear(normalGame);

        if (scores > 0) await waitByFrameTime(60);

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

            if (isBigWin(totalScores)) await showBigWin(totalScores);

            freeGame.forEach(clear);

            await hideFreeGame();
        }

        app.user.cash = cash;

        log('Round Complete...');
        app.emit('Idle');
    }

    function clear(result) {
        const {scores} = result;

        app.user.lastWin = scores;
        app.user.cash += scores;

        if (check(result)) {
            app.user.auto = 0;

            app.user.totalWin = 0;
        }
    }

    function check(result) {
        const {scores, results} = result;

        const condition = app.user.autoStopCondition;

        return [
            onAnyWin,
            onSingleWinOfAtLeast,
            ifCashIncreasesBy,
            ifCashDecreasesBy,
        ].some(isTrue);

        function isTrue(func) {
            return func() === true;
        }

        function onAnyWin() {
            if (condition['on_any_win']) return scores > 0;
        }

        function onSingleWinOfAtLeast() {
            const threshold = condition['on_single_win_of_at_least'];

            if (threshold) return scores > threshold;
        }

        function ifCashIncreasesBy() {
            const threshold = condition['if_cash_increases_by'];

            if (threshold) return results.some(biggerThanThreshold);

            function biggerThanThreshold() {
                return app.user.totalWin >= threshold;
            }
        }

        function ifCashDecreasesBy() {
            const threshold = condition['if_cash_decreases_by'];

            if (threshold) return results.some(smallerThanThreshold);

            function smallerThanThreshold() {
                return app.user.totalWin <= threshold;
            }
        }
    }
}

