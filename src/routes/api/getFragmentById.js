const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const mime = require('mime-types');
const path = require('path');
const md = require('markdown-it')();

/**
 * Get binary data for user's fragment with specified id
 */
module.exports = async (req, res) => {
  const query = path.parse(req.params.id);

  const id = query.name;
  const extension = query.ext;
  logger.info(`GET /fragments/:id - getting the binary data for the fragment with given id`);
  logger.debug(`user details: ${JSON.stringify(req.user)}`);
  logger.debug(`requested fragment's ID: ${id}`);

  try {
    const fragmentMetadata = await Fragment.byId(req.user, id);
    const fragmentData = await fragmentMetadata.getData();

    // Only Markdown to HTML conversion is supported for now
    // TO-DO: add more datatypes and conversion
    if (extension) {
      // Find the MIME conversion type based on the extension
      const conversionType = mime.lookup(extension);

      // Check the validity of conversion
      if (fragmentMetadata.formats.includes(conversionType)) {
        // Convert Markdown to HTML
        const convertedData = md.render(fragmentData.toString());
        res.setHeader('Content-Type', conversionType);
        res.status(200).send(convertedData);
        logger.info(`Fragment ${id} converted to ${conversionType} and retrieved successfully.`);
      } else {
        logger.error(`Couldn't perform conversion to unsupported type!`);
        res.status(415).send(createErrorResponse(415, 'Conversion to unsupported type'));
      }
    } else {
      res.setHeader('Content-Type', fragmentMetadata.type);
      res.status(200).send(fragmentData);
      logger.info(`Fragment ${id} retrieved successfully.`);
    }
  } catch (err) {
    logger.error(`Fragment ${id} not found.`);
    res.status(404).send(createErrorResponse(404, 'Not found'));
  }
};
