function gt(a, b, context) {
  return a > b ? context.fn(this) : context.inverse(this);
}

export default gt; 
