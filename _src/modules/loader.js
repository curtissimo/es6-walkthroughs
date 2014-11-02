export default function (inId, outId, test, cb) {
  let interval = setInterval(() => {
    if (test()) {
      clearInterval(interval);
      setTimeout(() => {
        document
          .getElementById(inId)
          .style.opacity = 1;

        document
          .getElementById(outId)
          .style.opacity = 0;

        interval = setInterval(() => {
          let opacity = parseInt(window.getComputedStyle(document.getElementById(outId), null).getPropertyValue('opacity'), 10);
          if (opacity === 0) {
            clearInterval(interval);
            let loader = document.getElementById(outId);
            loader.parentNode.removeChild(loader);
          }
        }, 500);

        cb();
      }, 500);
    }
  }, 500);
}
