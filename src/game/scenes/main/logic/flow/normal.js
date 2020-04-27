import {spin, show} from '../anim';
import {preprocess} from '../index';

export async function NormalGame({result, reels, grid, payLine}) {
    const {hasLink, scores} = result;

    const symbols = preprocess(result.symbols);

    await spin({reels, symbols});

    if (hasLink) {
        await show({result, reels, grid, payLine});
    }

    return scores;
}
