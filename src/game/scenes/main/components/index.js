export * from './slot';
export * from './Conveyor';
export * from './Grid';
export * from './PayLine';
export * from './Text';
export * from './Bonus';
export * from './BigWin';
export * from './Count';

export function pauseAll(it) {
    Object
        .values(it.transition)
        .forEach((anim) => anim.pause());
}
