import "intersection-observer";
import scrollama from "scrollama";

import animations from "./animations";

export default function setupScrollama({countries, path}) {
  const scroller = scrollama();

  // response = { element, direction, index }
  function handleStepEnter(response) {
    console.warn("handleStepEnter, response", { response });

    switch (response.index) {
      case 0:
        animations.firstAnimation();
        break;
      case 1:
        animations.secondAnimation({countries, path});
        break;
      default:
        break;
    }
  }

  function handleContainerEnter(response) {
    console.warn("Scrollama :: handleContainerEnter");
  }

  function handleContainerExit(response) {
    console.warn("Scrollama :: handleContainerExit");
  }

  scroller
    .setup({
      container: ".scroll",
      graphic: ".scroll__graphic",
      text: ".scroll__text",
      step: ".scroll__text .step",
      debug: false,
      offset: 0.9
    })
    .onStepEnter(handleStepEnter)
    .onContainerEnter(handleContainerEnter)
    .onContainerExit(handleContainerExit);
}

// setup resize event -> this is causing issues in mobile when the mobile headers resize
// window.addEventListener("resize", handleResize);