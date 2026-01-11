import './style.css';

import { createContext } from './gl/context';
import { createRenderTarget } from './gl/framebuf';
import { RectBatch } from './render/rect';
import { BrightPass } from './post/bright-pass';
import { BlurPass } from './post/blur-pass';
import { DisplayPass } from './post/display-pass';
import { CombinePass } from './post/combine-pass';
import { compose } from './utils/combine';
import { Slider } from './ui/slider';

const $app = document.querySelector('#app')
const $ui = document.querySelector('#ui');
const { gl, canvas } = createContext($app);

const settings = {
  bloomIntensity: 1,
  threshold: 0
}

const bloomSlider = new Slider($ui, 'Bloom Intensity', 0, 5, settings.bloomIntensity);
const thresholdSlider = new Slider($ui, 'Threshold', 0, 1, settings.threshold);

thresholdSlider.onChange = (value) => {
  settings.threshold = value;
};

bloomSlider.onChange = (value) => {
  settings.bloomIntensity = value;
};

const batch = new RectBatch(gl);
const bright = new BrightPass(gl);
const blur = new BlurPass(gl);
const display = new DisplayPass(gl);
const combine = new CombinePass(gl);

const dvdRects = [
  {
    x: 10, y: 10, w: 100, h: 50,
    dx: 2, dy: 2,
    color: [1, 0, 0, 1]
  },
  {
    x: 200, y: 80, w: 60, h: 60,
    dx: 3, dy: 2.5,
    color: [0, 1, 0, 1]
  },
  {
    x: 300, y: 120, w: 150, h: 40,
    dx: 2.2, dy: 1.7,
    color: [0, 0.7, 1, 1]
  },
  {
    x: 100, y: 300, w: 80, h: 80,
    dx: 1.5, dy: 2.2,
    color: [0.3, 0.3, 0.3, 1]
  },
  {
    x: 400, y: 200, w: 120, h: 60,
    dx: 2.7, dy: 1.3,
    color: [0.6, 0.6, 0.6, 1]
  }
];

const screenTarget = createRenderTarget(gl, { screen: true });
const renderTarget = createRenderTarget(gl);
const brightTarget = createRenderTarget(gl, { scale: 0.25 });
const blurVTarget = createRenderTarget(gl, { scale: 0.25 });
const blurHTarget = createRenderTarget(gl, { scale: 0.25 });
const combineTarget = createRenderTarget(gl);

let lastTime = 0;

requestAnimationFrame(loop);

function loop(time) {
  const deltaTime = time - lastTime;
  lastTime = time;

  batch.begin(renderTarget);
  for (const rect of dvdRects) {
    rect.x += rect.dx * deltaTime * 0.1;
    rect.y += rect.dy * deltaTime * 0.1;

    if (rect.x < 0 || rect.x + rect.w > canvas.width) {
      rect.dx *= -1;
      rect.x = Math.max(0, Math.min(rect.x, canvas.width - rect.w));
    }
    if (rect.y < 0 || rect.y + rect.h > canvas.height) {
      rect.dy *= -1;
      rect.y = Math.max(0, Math.min(rect.y, canvas.height - rect.h));
    }
    batch.drawRect(rect.x, rect.y, rect.w, rect.h, rect.color);
  }

  batch.end(renderTarget);

  compose(renderTarget, [
    (input) => bright.render(brightTarget, input.texture, settings.threshold),
    (input) => blur.render(blurVTarget, input, [0, 1]),
    (input) => blur.render(blurHTarget, input, [1, 0]),
    (input) => blur.render(blurVTarget, input, [0, 1]),
    (input) => blur.render(blurHTarget, input, [1, 0]),
    (input) => combine.render(combineTarget, renderTarget.texture, input.texture, settings.bloomIntensity),
    (input) => display.render(input.texture)
  ])();

  requestAnimationFrame(loop);
}
