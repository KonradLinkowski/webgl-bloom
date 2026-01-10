import fullscreenVS from '../shaders/fullscreen.vert?raw';
import brightFS from '../shaders/bright.frag?raw';
import { createProgram } from '../gl/utils';
import { drawFullscreenQuad } from '../render/fullscreen-quad';

export class BrightPass {
  constructor(gl) {
    this.gl = gl;

    this.program = createProgram(gl, fullscreenVS, brightFS);

    this.a_position = gl.getAttribLocation(this.program, 'a_position');
    this.u_texture = gl.getUniformLocation(this.program, 'u_texture');
    this.u_threshold = gl.getUniformLocation(this.program, 'u_threshold');
  }

  /**
   * @param {import('../gl/framebuf').RenderTarget} renderTarget 
   * @param {WebGLTexture} inputTexture 
   * @param {number} threshold 
   * 
   * @returns {import('../gl/framebuf').RenderTarget}
   */
  render(renderTarget, inputTexture, threshold = 1.0) {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget.framebuffer);
    gl.viewport(0, 0, renderTarget.width, renderTarget.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    const identityMat = new Float32Array([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]);
    const u_matrix = gl.getUniformLocation(this.program, 'u_matrix');
    gl.uniformMatrix3fv(u_matrix, false, identityMat);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, inputTexture);
    gl.uniform1i(this.u_texture, 0);
    gl.uniform1f(this.u_threshold, threshold);

    drawFullscreenQuad(gl, this.a_position);

    return renderTarget
  }
}