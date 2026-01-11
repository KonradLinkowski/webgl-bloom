export function createContext(parent = document.body) {
  const canvas = document.createElement('canvas');
  parent.appendChild(canvas);
  const gl = canvas.getContext('webgl');

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resize);
  resize();

  return { gl, canvas };
}
