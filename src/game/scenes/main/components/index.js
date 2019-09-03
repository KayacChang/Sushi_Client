export * from './slot';
export * from './Conveyor';
export * from './Grid';
export * from './PayLine';

export function pauseAll(it) {
    Object
        .values(it.transition)
        .forEach((anim) => anim.pause());
}
