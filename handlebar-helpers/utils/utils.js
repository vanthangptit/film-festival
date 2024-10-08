export const getFileExtension = (filename) => {
  return filename.split('.').pop();
};

export const isJsonExtension = (extension) => {
  return extension && extension.toLowerCase() === 'json';
};

export const isDevelomentEnv = (context) => {
  if (!context || !context.data || !context.data.root || !context.data.root.buildEnv) {
    throw new Error('Cannot get Env!');
  }
  return context.data.root.buildEnv === 'development';
};
