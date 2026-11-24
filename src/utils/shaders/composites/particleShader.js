import {Fn, Loop, vec3, uv, time, If, float} from 'three/tsl';
import { getBehavior } from '../behaviorNodes/getBehavior.js';
import { getPartiSystem } from '../../../sceneLoader';
import { drawBox, drawCircle } from '../index.js';

const particleShader = Fn(({spawnDataUniform, posFn, posOffsetFn, sizeFn, directionFn, drawFn, maxShapes = 6, lifespan = 2.0}) => {
  // Fn (() => {
  const st = uv().mod(1);
  const out = vec3(0).toVar();
  const maxSpeed = 1;

  Loop(maxShapes, ({ i }) => {
    const particleData = spawnDataUniform.element(i);
    const spawnTime = particleData.x;
    const spawnEnergy = particleData.y;
    const age = time.sub(spawnTime);
    const speed = spawnEnergy.mul(maxSpeed) ;

    If((age.greaterThanEqual(0.0).and(age.lessThan(lifespan))).or(float(lifespan).equal(-1)), () => {
      const lifePct = age.div(lifespan);
      const pos = posFn({posOffsetFn, idx: i, lifePct, maxShapes, st, speed, directionFn});
      const size = sizeFn({ idx: i, lifePct});
      out.addAssign(drawFn(pos, size));
    });
  });

  return out;
  });


const getPartiShaders = (bands) => {
    return bands.map((band)=>{
        // console.log(band);
        return particleShader({
            spawnDataUniform: band.spawnDataUniform,
            posFn: getBehavior("movement"),
            posOffsetFn: getBehavior("layout", band.posOffsetFn),
            sizeFn: getBehavior("size", band.sizeFn),
            directionFn: getBehavior("direction", band.directionFn),
            drawFn: getDrawFn(band.shape),
            maxShapes: band.particleData.length || 10,
            lifespan: band.lifespan || 2,
        })
    });
};

const getDrawFn = (key) => {
    switch(key){
        case "box":
            return drawBox;
        case "circle":
            return drawCircle;
        default:
            return drawCircle;
    }
}

const addPartiShaders = () => {
  const system = getPartiSystem();
  const shaders = getPartiShaders(system);
  return shaders.reduce((acc, cur) => acc.add(cur), vec3(0));
};

const multPartiShaders = () => {
  const shaders = getPartiShaders(getPartiSystem());
  return shaders.reduce((acc, cur) => acc.mul(cur), vec3(1));
}

export {addPartiShaders, multPartiShaders}