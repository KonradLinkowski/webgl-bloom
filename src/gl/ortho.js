export function ortho(left, right, bottom, top) {
  return new Float32Array([
    2 / (right - left), 0, 0,
    0, 2 / (top - bottom), 0,
    -(right + left) / (right - left),
    -(top + bottom) / (top - bottom),
    1
  ]);
}