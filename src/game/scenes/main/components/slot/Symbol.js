import {property} from './Slot';

export function Symbol(view, index, symbols) {
    let offset = Number(symbols[0].x);

    const stepSize = Math.abs(offset / property.stepPerSymbol);

    let pos = index;

    return {
        get initPos() {
            return index;
        },

        get pos() {
            return pos;
        },
        set pos(newPos) {
            this.update(newPos);

            pos = newPos;
        },

        get stepSize() {
            return Math.abs(offset / property.stepPerSymbol);
        },

        get offset() {
            return offset;
        },
        set offset(value) {
            offset = value;
        },

        get x() {
            return view.x;
        },
        set x(newX) {
            view.x = newX;
        },

        get y() {
            return view.y;
        },
        set y(newY) {
            view.y = newY;
        },

        get texture() {
            return view.texture;
        },
        set texture(newTexture) {
            view.texture = newTexture;
        },

        get icon() {
            return property.textures.find(view.texture);
        },
        set icon(newIcon) {
            view.texture = property.textures.get(newIcon);
        },

        get visible() {
            return view.visible;
        },
        set visible(flag) {
            view.visible = flag;
        },

        update(newPos) {
            view.x = offset + (newPos * stepSize);
        },
    };
}
