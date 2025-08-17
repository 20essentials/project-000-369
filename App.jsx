import React, { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { createStitches } from "@stitches/react";

const { globalCss, styled } = createStitches();

const globalStyles = globalCss({
  "*": { boxSizing: "border-box", margin: 0, padding: 0 },
  "*::after": { boxSizing: "border-box" },
  "*::before": { boxSizing: "border-box" },
  body: {
    fontFamily:
      "sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans','Helvetica Neue'",
    height: "100vh",
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    placeContent: "center",
    backgroundImage: `repeating-radial-gradient(circle at 0% 0%, #d1d7dd 1px 5px, transparent 6px 10px),
                      repeating-radial-gradient(circle at 100% 100%, transparent 1px 5px, #d1d7dd 6px 10px)`,
  },
  html: {
    scrollBehavior: "smooth",
    scrollbarWidth: "thin",
    scrollbarColor: "white transparent",
  },
  a: { WebkitTapHighlightColor: "transparent" },
});

const ContainerStage = styled("main", {
  position: "relative",
});

class Letter {
  constructor(stage) {
    this.element = document.createElement("div");
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
    this.element.style.position = "absolute";
    this.element.style.fontSize = "8px";
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
    this.attachShadow({ mode: "open" });
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
        }
      </style>
      <aside class="container-letters"></aside>
    `;
  }

  connectedCallback() {
    this.initMove();
  }

  initMove() {
    let stage = this.shadowRoot.querySelector(".container-letters");
    let message = "SYNTAX IS TEMPORARY LEGACY IS FOREVER ";
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
      let tempAngle = angle;
      for (let i = 0; i < n_circles; i++) {
        const x = radio * Math.cos(tempAngle) + centerCircle + 2;
        const y = radio * Math.sin(tempAngle) + centerCircle;
        const rotate =
          Math.atan2(y - centerCircle, x - centerCircle) * (180 / Math.PI) +
          90 +
          "deg";
        arrayLetters[i].setPosition(x, y);
        arrayLetters[i].setRotate(rotate);
        tempAngle += increase;
      }
      angle += 0.02;
      requestAnimationFrame(rotarText);
    };

    requestAnimationFrame(rotarText);
  }
}

customElements.define("circle-letters", CircleLetters);

function App() {
  const stageRef = useRef(null);

  useEffect(() => {
    globalStyles();
    const colores = [
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#F1C40F",
      "#9B59B6",
      "#1ABC9C",
      "#E74C3C",
    ];

    let numberOfCircles = 8;
    for (let i = numberOfCircles, a = 0; i > 0 && a < numberOfCircles; i--, a++) {
      const maximum = numberOfCircles * 40 - a * 30;
      const circle = new CircleLetters(maximum, maximum, colores[a]);
      stageRef.current.appendChild(circle);
    }
  }, []);

  return <ContainerStage ref={stageRef} />;
}

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
