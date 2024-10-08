import { render } from '../utils/compile';

export default (fn, props, container, context) => {
  const { jsonString, variableName, contextData } = context.hash;
  if (!jsonString || !variableName) {
    throw new Error('jsonString cannot be empty!');
  }
  let jsonData = null;
  if (contextData) {
    jsonData = render(jsonString, contextData);
  }
  
  jsonData = JSON.parse(jsonData);
  context.data.root[variableName] = jsonData;
};
