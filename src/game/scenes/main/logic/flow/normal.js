import {spin, show} from '../anim';
import {preprocess} from '../index';

export async function NormalGame({result, reels, grid, payLine, showBonus}) {
    const {hasLink, scores, bonus} = result;

    const symbols = preprocess(result.symbols);

    await spin({reels, symbols});

    if (hasLink) {
        await show({result, reels, grid, payLine});
    }

    if (bonus) {
        await showBonus(bonus);
    }

    return scores;
}
