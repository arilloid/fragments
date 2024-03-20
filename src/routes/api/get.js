const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // Convert expand query parameter to boolean
  const expand = req.query.expand === '1';

  logger.info(`GET /fragments - retrieving a list of fragments for the current user`);
  logger.debug(`user details: ${JSON.stringify(req.user)}`);

  try {
    const fragments = await Fragment.byUser(req.user, expand);
    res.status(200).send(createSuccessResponse({ fragments }));
    logger.info(`User's fragment list has been retrieved successfully`, { fragments });
  } catch (err) {
    res.status(404).send(createErrorResponse(404, err));
  }
};
