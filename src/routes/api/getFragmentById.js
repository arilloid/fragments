const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const { user, params: { id } } = req;
  logger.info(`GET /fragments/:id - getting the binary data for the fragment with given id`);
  logger.debug(`user details: ${JSON.stringify(user)}`);
  logger.debug(`requested fragment's ID: ${id}`);

  try {
    const fragmentMetadata = await Fragment.byId(user, id);
    const fragment = await fragmentMetadata.getData();
    // Since only plain text is supported - sending the text data
    // TO-DO: add more datatypes and conversion
    res.setHeader('Content-Type', fragmentMetadata.type);
    res.status(200).send(fragment);
    logger.info(`Fragment ${req.params.id} retrieved successfully.`);
  } catch (err) {
    logger.error(`Fragment ${req.params.id} not found.`);
    res.status(404).json(createErrorResponse(404, 'not found'));
  }
};
