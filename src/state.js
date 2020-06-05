const fs = require('fs');
const contentFilePath = './src/contents/content.json';

exports.save = (content) => {
  const contentString = JSON.stringify(content);
  return fs.writeFileSync(contentFilePath, contentString);
}

exports.readContent = () => {
  const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
  const contentJson = JSON.parse(fileBuffer)

  return contentJson;
}
