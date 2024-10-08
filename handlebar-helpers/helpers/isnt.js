/* eslint-disable eqeqeq */
export default (left, right, context) => {
  return left != right ? context.fn(this) : context.inverse(this);
};
