const md = require('markdown-it')();
const sharp = require('sharp');

// Converts fragment's data to the supported type specified by extension
async function convertData(metadata, data, conversionType) {
  const currentType = metadata.type;
  let convertedData;

  // Check the validity of conversion
  if (metadata.formats.includes(conversionType)) {

    // If type to be converted to is equivalent to the current type = no conversion needed
    if (currentType === conversionType) {
      convertedData = data;

      // Image conversions
    } else if (currentType.startsWith('image')) { 
      if (conversionType === 'image/png') {
        convertedData = await sharp(data).png().toBuffer();
      } else if (conversionType === 'image/jpeg') {
        convertedData = await sharp(data).jpeg().toBuffer();
      } else if (conversionType === 'image/webp') {
        convertedData = await sharp(data).webp().toBuffer();
      } else if (conversionType === 'image/avif') {
        convertedData = await sharp(data).avif().toBuffer();
      } else if (conversionType === 'image/gif') {
        convertedData = await sharp(data).gif().toBuffer();
      } 

      // Conversion to plain text 
    } else if  (conversionType == 'text/plain') {
      convertedData = data.toString();

      // Conversion from Markdown to HTML
    } else if (currentType === 'text/markdown' && conversionType === 'text/html') {
      convertedData = md.render(data.toString());

    } 

    return convertedData 
  } else {
    throw new Error(`conversion to unsupported type!: ${currentType} -> ${conversionType}`);
  }
}

module.exports = convertData;