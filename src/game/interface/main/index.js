import {SpinButton} from './SpinButton';
import {Status} from './Status';
import {Option} from './Option';
import {Button} from '../components';
import {fadeIn, fadeOut} from '../../effect';

const {assign} = Object;

export function Main(it) {
    const menuButton = Button(it.getChildByName('menu'));

    const optionButton = Button(it.getChildByName('option'));

    optionButton.once('pointerup', openOption);

    const option = Option(it.getChildByName('optionMenu'));

    SpinButton(it.getChildByName('spin'));

    Status(it.getChildByName('status'));

    app.on('SpinStart', () => {
        fadeOut({targets: it, alpha: 0.5});

        optionButton.interactive = false;
        menuButton.interactive = false;
    });

    app.on('Idle', () => {
        fadeIn({targets: it});

        optionButton.interactive = true;
        menuButton.interactive = true;
    });

    return assign(it, {
        menuButton,
        whenClickOutsideClose,
    });

    function whenClickOutsideClose(target) {
        const block = it.getChildByName('block');

        block.interactive = true;

        block.once('pointerup', close);

        return () => block.off(close);

        async function close() {
            block.interactive = false;

            if (target.isOpen) await target.close();
        }
    }

    async function openOption() {
        await option.open();

        const off = whenClickOutsideClose(option);

        option.once('Closed', () => {
            off();

            optionButton.once('pointerup', openOption);
        });
    }
}
