import { createProgram } from '../gl/utils.js';
import { drawFullscreenQuad } from '../render/fullscreen-quad.js';
import fullscreenVS from '../shaders/fullscreen.vert?raw';
import combineFS from '../shaders/combine.frag?raw';

export class CombinePass {
  constructor(gl) {
    this.gl = gl;
    this.program = createProgram(gl, fullscreenVS, combineFS);

    this.a_position = gl.getAttribLocation(this.program, 'a_position');
    this.u_matrix = gl.getUniformLocation(this.program, 'u_matrix');
    this.u_sceneTexture = gl.getUniformLocation(this.program, 'u_sceneTexture');
    this.u_bloomTexture = gl.getUniformLocation(this.program, 'u_bloomTexture');
    this.u_bloomIntensity = gl.getUniformLocation(this.program, 'u_bloomIntensity');
  }

  /**
   * @param {import('../gl/framebuf').RenderTarget | null} target
   * @param {WebGLTexture} sceneTex
   * @param {WebGLTexture} bloomTex
   * @param {number} intensity
   * 
   * @returns {import('../gl/framebuf').RenderTarget}
   */
  render(target, sceneTex, bloomTex, intensity = 1.0) {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.framebuffer : null);
    const width = target ? target.width : gl.drawingBufferWidth;
    const height = target ? target.height : gl.drawingBufferHeight;
    gl.viewport(0, 0, width, height);

    gl.useProgram(this.program);

    const identityMat = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    gl.uniformMatrix3fv(this.u_matrix, false, identityMat);
    gl.uniform1f(this.u_bloomIntensity, intensity);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTex);
    gl.uniform1i(this.u_sceneTexture, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, bloomTex);
    gl.uniform1i(this.u_bloomTexture, 1);

    drawFullscreenQuad(gl, this.a_position);

    return target
  }
}