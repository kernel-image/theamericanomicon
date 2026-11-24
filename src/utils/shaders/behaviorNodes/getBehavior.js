import { Fn, float, fract, time, vec2 } from 'three/tsl';

const getBehavior = (tipe, offsetFn) => {

    switch (tipe) {
        case 'layout':
            return Fn(({ idx, maxShapes }) => {
                const [x, y] = offsetFn();
                return float(idx).div(maxShapes).add(vec2(x, y));
            }, { idx: 'int', maxShapes: 'int', return: 'vec2' });
        case 'size':
        case 'direction':
            return Fn(({ idx, lifePct }) => {
                const [x, y] = offsetFn({ idx, lifePct });
                return vec2(x, y);
            });
        case 'movement':
            return Fn(({ posOffsetFn, idx, maxShapes, st, speed, directionFn, lifePct }) => {
                return fract(st.sub((posOffsetFn(idx, maxShapes)).add(time.mul(speed).mul(directionFn({ idx, lifePct })))));
            });
    }
}

export {getBehavior}