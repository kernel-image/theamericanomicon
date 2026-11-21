import {Fn, Loop, vec3, uv, time} from 'three/tsl';

export const particleShader = Fn(([spawnTimesNode, posFn, sizeFn, drawFn, maxShapes = 6, lifespan = 2.0]) => {
  const st = uv().mod(1);
  const out = vec3(0).toVar();

  Loop(maxShapes, ({ i }) => {
    const spawnTime = spawnTimesNode.element(i); //uniformArray
    const age = time.sub(spawnTime);

    If(age.greaterThanEqual(0.0).and(age.lessThan(lifespan)), () => {
      const lifePct = age.div(lifespan);
      // const lifeRemaining = float(lifespan).sub(age);
      const pos = posFn(i, lifePct, maxShapes, st);
      const size = sizeFn(i, lifePct);
      out.addAssign(drawFn(pos, size));
    });
  });

  return out;
});