/**
 * @typedef {Object} RenderTarget
 * @property {WebGLFramebuffer} framebuffer
 * @property {WebGLTexture} texture
 * @property {number} width
 * @property {number} height
 */

/**
 * @returns {RenderTarget}
 */
export function createRenderTarget(gl, {
  screen = false,
  scale = 1
} = {}) {
  let width = null;
  let height = null;
  let texture = null;
  let framebuffer = null;

  function allocate() {
    if (texture) gl.deleteTexture(texture);
    if (framebuffer) gl.deleteFramebuffer(framebuffer);

    width = gl.canvas.width * scale;
    height = gl.canvas.height * scale;
    texture = createTexture(gl, width, height);
    framebuffer = createFramebuffer(gl, texture);
  }

  allocate();

  window.addEventListener('resize', () => {
    allocate();
  });

  if (screen) {
    return {
      get texture() { return null; },
      get framebuffer() { return null; },
      get width() { return width; },
      get height() { return height; }
    };
  }

  return {
    get texture() { return texture; },
    get framebuffer() { return framebuffer; },
    get width() { return width; },
    get height() { return height; }
  };
}

export function createTexture(gl, w, h) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

export function createFramebuffer(gl, tex) {
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  return fb;
}
