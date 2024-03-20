const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get metadata for user's fragment with specified id
 */
module.exports = async (req, res) => {
  const {
    user,
    params: { id },
  } = req;
  logger.info(`GET /fragments/:id - getting the metadata for the fragment with given id`);
  logger.debug(`user details: ${JSON.stringify(user)}`);
  logger.debug(`requested fragment's ID: ${id}`);

  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    res.status(200).send(createSuccessResponse({ fragment }));
    logger.info(`User's fragment's metadata has been retrieved successfully`, { fragment });
  } catch (err) {
    logger.error(`Fragment ${id} not found.`);
    res.status(404).send(createErrorResponse(404, 'Not found'));
  }
};
