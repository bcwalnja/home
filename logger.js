const logVerbose = false;

function log(msg) {
  console.log(msg);
}

function verbose(msg) {
  if (this.logVerbose) {
    console.log(msg);
  }
}