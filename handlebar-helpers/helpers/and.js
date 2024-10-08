function and() {
  const context = arguments[arguments.length - 1];

  let result = true;
  for (let i = 0; i < arguments.length - 1; i++) {
    result = result && arguments[i];
  }
  
  return result ? context.fn(this) : context.inverse(this);
}
export default and;
