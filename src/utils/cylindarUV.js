import * as THREE from 'three';

export function applyCylindricalUVs(
  geometry,
  activeArc = Math.PI * 2,
  axis = 'Y',
  seam = '-Z',
  fixSeam = false
) {
  const TWO_PI = Math.PI * 2;
  // Clamp activeArc between a tiny positive sliver and a full 2*PI circle
  const clampedArc = Math.min(Math.max(activeArc, 0.001), TWO_PI);
  const gapAngle = TWO_PI - clampedArc;

  // Only split triangles if the wrap is closed (no gap)
  const shouldFixSeam = fixSeam && gapAngle < 1e-5;
  const geo = (shouldFixSeam && geometry.index) ? geometry.toNonIndexed() : geometry;

  geo.computeBoundingBox();
  const { min, max } = geo.boundingBox;
  const center = new THREE.Vector3().addVectors(min, max).multiplyScalar(0.5);
  const size = new THREE.Vector3().subVectors(max, min);

  const normAxis = axis.toUpperCase();
  const normSeam = seam.toUpperCase();

  // 1. Right-handed local basis (radA, radB, axial)
  let getBasis, axialMin, axialSize;
  switch (normAxis) {
    case 'X':
      getBasis = (x, y, z) => [y - center.y, z - center.z, x];
      axialMin = min.x;
      axialSize = size.x || 1;
      break;
    case 'Z':
      getBasis = (x, y, z) => [x - center.x, y - center.y, z];
      axialMin = min.z;
      axialSize = size.z || 1;
      break;
    case 'Y':
    default:
      getBasis = (x, y, z) => [z - center.z, x - center.x, y];
      axialMin = min.y;
      axialSize = size.y || 1;
      break;
  }

  // 2. Map seam direction onto local (radA, radB)
  const seamMap = {
    X: { '-Z': [ 0,  1 ], 'Z': [ 0, -1 ], '-Y': [ 1,  0 ], 'Y': [ -1,  0 ] },
    Y: { '-X': [ 0,  1 ], 'X': [ 0, -1 ], '-Z': [ 1,  0 ], 'Z': [ -1,  0 ] },
    Z: { '-Y': [ 0,  1 ], 'Y': [ 0, -1 ], '-X': [ 1,  0 ], 'X': [ -1,  0 ] },
  };

  const axisSeams = seamMap[normAxis] || seamMap.Y;
  const [dirA, dirB] = axisSeams[normSeam] || Object.values(axisSeams)[0];

  // 3. Derive the starting angle from the remaining gap centered on the seam
  const startAngle = -Math.PI + gapAngle * 0.5;

  const posAttr = geo.attributes.position;
  const count = posAttr.count;
  const uvs = new Float32Array(count * 2);

  for (let i = 0; i < count; i++) {
    const [a, b, axial] = getBasis(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));

    const rotA = a * dirA + b * dirB;
    const rotB = -a * dirB + b * dirA;

    const angle = Math.atan2(rotB, rotA);
    uvs[i * 2] = (angle - startAngle) / clampedArc;
    uvs[i * 2 + 1] = (axial - axialMin) / axialSize;
  }

  // 4. Fix seam-straddling triangles only when the wrap is closed (360°)
  if (shouldFixSeam) {
    for (let i = 0; i < count; i += 3) {
      const u0 = uvs[i * 2];
      const u1 = uvs[(i + 1) * 2];
      const u2 = uvs[(i + 2) * 2];

      if (Math.abs(u0 - u1) > 0.5 || Math.abs(u1 - u2) > 0.5 || Math.abs(u0 - u2) > 0.5) {
        if (u0 < 0.5) uvs[i * 2] += 1.0;
        if (u1 < 0.5) uvs[(i + 1) * 2] += 1.0;
        if (u2 < 0.5) uvs[(i + 2) * 2] += 1.0;
      }
    }
  }

  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  return geo;
}
