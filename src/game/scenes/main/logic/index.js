import {log, table} from '@kayac/utils';

// import {NormalGame, ReSpinGame} from './flow';

// const BET_TO_BIGWIN = 10;
//
// function isBigWin(scores) {
//     return divide(scores, app.user.currentBet) > BET_TO_BIGWIN;
// }

export function logic({slot}) {
    app.on('GameResult', onGameResult);

    async function onGameResult(result) {
        log('onGameResult =============');
        table(result);

        // const {
        //     normalGame,
        // } = result;

        log('Round Complete...');
        app.emit('Idle');
    }
}

