/**
 * @param {import('../gl/framebuf').RenderTarget} initial
 * @param {Array<(input: import('../gl/framebuf').RenderTarget) => any>} passes
 */
export function compose(initial, passes) {
  return passes.reduce((prevPass, currPass) => {
    return (input) => {
      const result = prevPass(input);
      return currPass(result);
    };
  }, () => initial);
}