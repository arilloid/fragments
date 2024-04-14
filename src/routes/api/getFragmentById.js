const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const convertData = require('./utils/convert');
const logger = require('../../logger');
const mime = require('mime-types');
const path = require('path');

/**
 * Get binary data for user's fragment with specified id
 */
module.exports = async (req, res) => {
  const query = path.parse(req.params.id);

  const id = query.name;
  const extension = query.ext;
  logger.info(`GET /fragments/:id - getting the binary data for the fragment with given id`);
  logger.debug(`user details: ${req.user}`);
  logger.debug(`requested fragment's ID: ${id}`);

  try {
    const fragmentMetadata = await Fragment.byId(req.user, id);
    const fragmentData = await fragmentMetadata.getData();

    if (extension) {
      const conversionType = mime.lookup(extension);

      try {
        // Convert the fragment data to the type specified by extension
        const convertedData = await convertData(fragmentMetadata, fragmentData, conversionType);
        res.setHeader('Content-Type', conversionType);
        res.status(200).send(convertedData);
        logger.info(`Fragment ${id} converted to ${conversionType} and retrieved successfully.`);
      } catch (err) {
        logger.error(`Conversion failed: `, err);
        res.status(500).send(createErrorResponse(500, `Conversion failed`));
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
