import fullscreenVS from '../shaders/fullscreen.vert?raw';
import blurFS from '../shaders/blur.frag?raw';
import { createProgram } from '../gl/utils';
import { drawFullscreenQuad } from '../render/fullscreen-quad';

export class BlurPass {
  constructor(gl) {
    this.gl = gl;

    this.program = createProgram(gl, fullscreenVS, blurFS);

    this.a_position = gl.getAttribLocation(this.program, 'a_position');
    this.u_texture = gl.getUniformLocation(this.program, 'u_texture');
    this.u_direction = gl.getUniformLocation(this.program, 'u_direction');
    this.u_texelSize = gl.getUniformLocation(this.program, 'u_texelSize');
    this.u_matrix = gl.getUniformLocation(this.program, 'u_matrix');
  }

  /**
   * @param {import('../gl/framebuf').RenderTarget} renderTarget
   * @param {import('../gl/framebuf').RenderTarget} inputTarget
   * @param {number[]} direction
   * 
   * @returns {import('../gl/framebuf').RenderTarget}
   */
  render(renderTarget, inputTarget, direction) {
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
    gl.uniformMatrix3fv(this.u_matrix, false, identityMat);
    gl.uniform2f(this.u_texelSize, 1.0 / inputTarget.width, 1.0 / inputTarget.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, inputTarget.texture);
    gl.uniform1i(this.u_texture, 0);
    gl.uniform2f(this.u_direction, direction[0], direction[1]);

    drawFullscreenQuad(gl, this.a_position);

    return renderTarget
  }
}