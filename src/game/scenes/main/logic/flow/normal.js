import {spin, show} from '../anim';

export async function NormalGame({result, reels, grid, payLine, showBonus}) {
    const {hasLink, symbols, scores, bonus} = result;

    await spin({reels, symbols});

    if (hasLink) {
        await show({result, reels, grid, payLine});
    }

    if (bonus) {
        await showBonus()
    }

    return scores;
}


