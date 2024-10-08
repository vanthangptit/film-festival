function mergeJson() {
  let result = {};
  for (let i = 0; i < arguments.length - 1; i++) {
    result = { ...result, ...arguments[i] };
  }

  return result;
}

export default mergeJson;
