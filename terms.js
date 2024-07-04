let terms = {
  term1: {
    min: 1,
    max: 12,
  },
  term2: {
    min: 1,
    max: 12
  }
};

// get the four inputs off the dom and set them
// add event listeners to the inputs to update the terms
document.getElementById('term1min').addEventListener('mousedown', function () {
  terms.term1.min = parseInt(this.value);
});

document.getElementById('term1max').addEventListener('change', function () {
  terms.term1.max = parseInt(this.value);
});

document.getElementById('term2min').addEventListener('input', function () {
  terms.term2.min = parseInt(this.value);
});

document.getElementById('term2max').addEventListener('input', function () {
  terms.term2.max = parseInt(this.value);
});
