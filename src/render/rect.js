import colorFS from '../shaders/color.frag?raw';
import fullscreenVS from '../shaders/fullscreen.vert?raw';
import { createProgram } from '../gl/utils';
import { ortho } from '../gl/ortho';

export class RectBatch {
  constructor(gl) {
    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.rectColors = [];
    this.vertexCount = 0;

    const MAX_RECTS = 1000;
    const VERTICES_PER_RECT = 6;
    const FLOATS_PER_VERTEX = 2;

    this.vertexData = new Float32Array(
      MAX_RECTS * VERTICES_PER_RECT * FLOATS_PER_VERTEX
    );
    this.program = createProgram(gl, fullscreenVS, colorFS);
    this.a_position = gl.getAttribLocation(this.program, 'a_position');
    this.u_color = gl.getUniformLocation(this.program, 'u_color');
    this.u_matrix = gl.getUniformLocation(this.program, 'u_matrix');
  }


  /**
   * @param {import('../gl/framebuf').RenderTarget} renderTarget
   */
  begin(renderTarget) {
    this.vertexCount = 0;
    this.rectColors = [];
    this.gl.useProgram(this.program);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, renderTarget.framebuffer);
    this.gl.viewport(0, 0, renderTarget.width, renderTarget.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  drawRect(x, y, w, h, color) {
    const x1 = x;
    const y1 = y;
    const x2 = x + w;
    const y2 = y + h;

    let i = this.vertexCount * 2;

    this.vertexData[i++] = x1; this.vertexData[i++] = y1;
    this.vertexData[i++] = x2; this.vertexData[i++] = y1;
    this.vertexData[i++] = x1; this.vertexData[i++] = y2;

    this.vertexData[i++] = x1; this.vertexData[i++] = y2;
    this.vertexData[i++] = x2; this.vertexData[i++] = y1;
    this.vertexData[i++] = x2; this.vertexData[i++] = y2;

    this.vertexCount += 6;

    if (color) {
      this.rectColors.push(color);
    } else {
      this.rectColors.push([1, 0, 0, 1]);
    }
  }

  end(renderTarget) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.vertexData.subarray(0, this.vertexCount * 2),
      this.gl.DYNAMIC_DRAW
    );

    this.gl.useProgram(this.program);
    this.gl.enableVertexAttribArray(this.a_position);
    this.gl.vertexAttribPointer(this.a_position, 2, this.gl.FLOAT, false, 0, 0);

    const mat = ortho(0, renderTarget.width, renderTarget.height, 0);
    if (this.u_matrix) this.gl.uniformMatrix3fv(this.u_matrix, false, mat);

    let offset = 0;
    for (let i = 0; i < this.rectColors.length; ++i) {
      const color = this.rectColors[i];
      this.gl.uniform4fv(this.u_color, color);
      this.gl.drawArrays(this.gl.TRIANGLES, offset, 6);
      offset += 6;
    }
  }
}