import {nextFrame, timer} from '@kayac/utils';

/**
 * pressHold
 *      Execute function once at first time.
 *      And after 1 second will execute the function on every frames.
 *
 *      ** the parameter function must return a Boolean to telling the operation is done. **
 *
 *      Example:
 *          it = Button();
 *          it.on('pointerdown', pressHold(onClick, it));
 *          function onClick() { *** }
 *
 * @param  {Function} func - The function want to execute when long press, must return a Boolean.
 * @param  {EventEmitter} it - The element which be pressed.
 * @return {call}
 */
export function pressHold(func, it) {
    //
    return function call() {
        let holding = true;

        it.once('pointerup', () => holding = false);

        let done = func();

        (
            async function execute(getDuration) {
                const duration = getDuration();

                if (duration > 1000) done = func();

                if (done || !holding) return;

                await nextFrame();

                return execute(getDuration);
            }
        )(timer());
    };
}
