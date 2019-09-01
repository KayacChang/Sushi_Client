import {spin} from '../anim/spin';
import {show} from '../anim/show';

export async function NormalGame({result, reels}) {
    const {hasLink, symbols, scores} = result;

    await spin({reels, symbols});

    if (hasLink) {
    }

    return scores;
}


