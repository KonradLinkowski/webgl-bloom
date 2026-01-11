export class Slider {
  /**
 * @param {HTMLElement} parent - The parent element to attach the slider to.
 * @param {string} label - The label for the slider.
 * @param {number} min - The minimum value of the slider.
 * @param {number} max - The maximum value of the slider.
 * @param {number} value - The initial value of the slider.
 * @param {number} step - The step value for the slider.
 */
  constructor(parent, label, min, max, value, step = 0.01) {
    this.$container = document.createElement('div');
    this.$container.className = 'slider';
    this.$label = document.createElement('label');
    this.$label.textContent = label;
    this.$input = document.createElement('input');
    this.$input.type = 'range';
    this.$input.min = min;
    this.$input.max = max;
    this.$input.step = step;
    this.$input.value = value;
    this.$value = document.createElement('span');
    this.$value.textContent = value;

    this.$input.addEventListener('input', () => {
      this.$value.textContent = this.$input.value;
      if (this.onChange) {
        this.onChange(parseFloat(this.$input.value));
      }
    });

    this.$container.appendChild(this.$label);
    this.$container.appendChild(this.$input);
    this.$container.appendChild(this.$value);
    parent.appendChild(this.$container);
  }

  get value() {
    return parseFloat(this.$input.value);
  }

  set value(v) {
    this.$input.value = v;
    this.$value.textContent = v;
  }
}
