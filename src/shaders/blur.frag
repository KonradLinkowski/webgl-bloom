precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_texelSize;
uniform vec2 u_direction;

varying vec2 v_uv;

void main() {
  vec3 result = vec3(0.0);

  float weights[5];
  weights[0] = 0.227027;
  weights[1] = 0.1945946;
  weights[2] = 0.1216216;
  weights[3] = 0.054054;
  weights[4] = 0.016216;

  result += texture2D(u_texture, v_uv).rgb * weights[0];

  for (int i = 1; i < 5; i++) {
    vec2 offset = u_direction * u_texelSize * float(i);

    result += texture2D(u_texture, v_uv + offset).rgb * weights[i];
    result += texture2D(u_texture, v_uv - offset).rgb * weights[i];
  }

  gl_FragColor = vec4(result, 1.0);
}
