import {Button} from '../components';

export function MenuButton({normal, onClick}) {
    const menuButton = Button(normal);

    menuButton
        .on('pointerdown', onPointerDown)
        .on('pointerup', onPointerUp);

    return menuButton;

    async function onPointerUp() {
        menuButton.interactive = false;

        await onClick();

        menuButton.interactive = true;
    }

    function onPointerDown() {
    }
}
