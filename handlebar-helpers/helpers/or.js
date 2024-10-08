function or() {
  const context = arguments[arguments.length - 1];

  let result = false;
  for ( let i = 0; i < arguments.length - 1; i++ ) {
    result = !!arguments[i];
    if (result) {
      break;
    }
  }

  return result ? context.fn(this) : context.inverse(this);
}
export default or;
