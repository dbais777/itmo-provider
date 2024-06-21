function timeOutCallback(from = 0, to = 3, cb, time = 15000) {
  let current = from;

  let timerId = setInterval(function () {
    cb(current);
    if (current == to) {
      clearInterval(timerId);
    }
    current++;
  }, time);
}

module.exports = { timeOutCallback };
