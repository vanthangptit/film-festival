export default (array, input, context) => {
  if (!Array.isArray(array)) {
    return context.inverse(this);
  }

  return array.indexOf(input) > -1 ? context.fn(this) : context.inverse(this);
};
