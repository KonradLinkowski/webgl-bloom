attribute vec2 a_position;
uniform mat3 u_matrix;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  vec3 pos = u_matrix * vec3(a_position, 1.0);
  gl_Position = vec4(pos.xy, 0.0, 1.0);
}
