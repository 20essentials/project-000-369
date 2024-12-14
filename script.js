const $containerStage = document.querySelector(
  '.container-stage'
);

class Letter {
  constructor(stage) {
    this.element = document.createElement('div');
    stage.appendChild(this.element);
  }

  setMisure(x, y) {
    this.element.width = `${x}px`;
    this.element.height = `${y}px`;
    this.width = x;
    this.height = y;
  }

  setPosition(x, y) {
    this.offsefLeft = this.width / 2;
    this.offsetTop = this.height / 2;
    this.element.style.left = `${x - this.offsefLeft}px`;
    this.element.style.top = `${y - this.offsetTop}px`;
    this.x = x;
    this.y = y;
  }

  setRotate(degree) {
    this.element.style.transform = `rotate(${degree})`;
  }

  setContent(text) {
    this.element.textContent = text;
  }
}

class CircleLetters extends HTMLElement {
  constructor(width, height, color) {
    super();
    this.width = width;
    this.height = height;
    this.color = color;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .container-letters {
          display: block;
          width: ${this.width}px;
          height: ${this.height}px;
          background-color: ${this.color};
          border-radius: 50%;
          position: absolute;
          top: calc(50% - ${this.height / 2}px);
          left: calc(50% - ${this.width / 2}px);

          div {
            font-size: 8px;
            position: absolute;
          }
        }
      </style>
      <aside class="container-letters"></aside>
    `;
  }

  connectedCallback() {
    this.initMove();
  }

  initMove() {
    let stage = this.shadowRoot.querySelector(
      '.container-letters'
    );
    let message = 'SYNTAX IS TEMPORARY LEGACY IS FOREVER ';
    let n_circles = message.length;
    let increase = (Math.PI * 2) / n_circles;
    let angle = -Math.PI;
    let arrayLetters = [];

    for (let i = 0; i < n_circles; i++) {
      let currentLetter = new Letter(stage);
      currentLetter.setMisure(10, 10);
      currentLetter.setContent(message.charAt(i));
      arrayLetters.push(currentLetter);
    }

    const rotarText = () => {
      const centerCircle = +this.width / 2;
      const radio = centerCircle - 10;
      for (let i = 0; i < n_circles; i++) {
        const x =
          radio * Math.cos(angle) + centerCircle + 2;
        const y = radio * Math.sin(angle) + centerCircle;
        const rotate =
          Math.atan2(y - centerCircle, x - centerCircle) *
            (180 / Math.PI) +
          90 +
          'deg';
        arrayLetters[i].setPosition(x, y);
        arrayLetters[i].setRotate(rotate);
        angle += increase;
      }
      angle += 0.02;

      requestAnimationFrame(rotarText);
    };

    requestAnimationFrame(rotarText);
  }
}

customElements.define('circle-letters', CircleLetters);

const colores = [
  '#FF5733', // Rojo anaranjado
  '#33FF57', // Verde lima
  '#3357FF', // Azul vibrante
  '#F1C40F', // Amarillo dorado
  '#9B59B6', // Púrpura
  '#1ABC9C', // Verde agua
  '#E74C3C' // Rojo coral
];

let numberOfCircles = 8;
for (
  let i = numberOfCircles, a = 0;
  i > 0 && a < numberOfCircles;
  i--, a++
) {
  const maximum = numberOfCircles * 40 - a * 30;
  const circle = new CircleLetters(
    maximum,
    maximum,
    colores[a]
  );

  $containerStage.appendChild(circle);
}
