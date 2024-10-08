let hbEnv = null;

export const registerHandlebarsRender = (handlebars) => {
  hbEnv = handlebars;
};

export const render = (template, data) => {
  if (!hbEnv) {
    throw new Error('Need to register Handlebars');
  }
  const compiledTemplate = hbEnv.compile(template);
  return compiledTemplate(data);
};
