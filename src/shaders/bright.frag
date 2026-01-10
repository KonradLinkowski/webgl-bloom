precision mediump float;

uniform sampler2D u_texture;
uniform float u_threshold;

varying vec2 v_uv;

void main() {
  vec4 color = texture2D(u_texture, v_uv);

  float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));

  float mask = smoothstep(u_threshold, u_threshold + 0.2, brightness);

  gl_FragColor = vec4(color.rgb * mask, 1.0);
}
