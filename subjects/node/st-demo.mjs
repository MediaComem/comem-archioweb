function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }

  return a + b;
}

function compute(a, b, op) {
  return op(a, b);
}

function demo() {
  const value = compute(2, 'foo', add);
  console.log(value);
}

demo();
