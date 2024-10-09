function getImagePath(imageUrl, context) {
  if (!imageUrl) {
    return '';
  }
  const toLowerCaseUrl = imageUrl.toLowerCase();
  const imagePath = context.data.root.imagePath;

  return toLowerCaseUrl.startsWith('http://') || toLowerCaseUrl.startsWith('https://') ? imageUrl :
    `${imagePath}${imageUrl}`;
}

export default getImagePath;
