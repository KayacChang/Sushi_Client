
export function Grid(it) {
    return (
        it.children
            .reduce((grid, child) => {
                const [, pos] = child.name.split('@');

                const [row, col] = pos.split('_').map(Number);

                if (!grid[row]) grid[row] = [];

                grid[row][col] = child;

                child.children
                    .forEach((it) => it.transition['anim'].pause());

                return grid;
            }, [])
    );
}
