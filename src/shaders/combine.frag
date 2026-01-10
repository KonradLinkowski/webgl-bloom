precision mediump float;

uniform sampler2D u_sceneTexture;
uniform sampler2D u_bloomTexture;
uniform float u_bloomIntensity;

varying vec2 v_uv;

void main() {
    vec3 scene = texture2D(u_sceneTexture, v_uv).rgb;
    vec3 bloom = texture2D(u_bloomTexture, v_uv).rgb;
    
    vec3 result = scene + (bloom * u_bloomIntensity);
    
    gl_FragColor = vec4(result, 1.0);
}