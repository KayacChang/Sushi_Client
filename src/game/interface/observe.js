const {defineProperty} = Object;

export function observe({key, value, onChange}, it) {
    const descriptor = {
        get() {
            return value;
        },
        set(newValue) {
            value = newValue;

            onChange.call(it, value);
        },
    };

    descriptor.set(value);

    return defineProperty(it, key, descriptor);
}
