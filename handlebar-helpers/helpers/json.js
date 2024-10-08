function json(context) {
  try {
    if (context) {
      return JSON.stringify(context);
    }

    return '{}';
  } catch (e) {
    return '{}';
  }
}

export default json;
