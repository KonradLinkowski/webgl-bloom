import { createProgram } from '../gl/utils.js';
import { drawFullscreenQuad } from '../render/fullscreen-quad.js';
import fullscreenVS from '../shaders/fullscreen.vert?raw';
import displayFS from '../shaders/display.frag?raw';

export class DisplayPass {
  constructor(gl) {
    this.gl = gl;

    this.program = createProgram(gl, fullscreenVS, displayFS);

    this.a_position = gl.getAttribLocation(this.program, 'a_position');
    this.u_texture = gl.getUniformLocation(this.program, 'u_texture');
  }

  render(texture) {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
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
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(this.u_texture, 0);

    drawFullscreenQuad(gl, this.a_position);
  }
}