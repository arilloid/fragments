const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Delete user's fragment with specified id
 */
module.exports = async (req, res) => {
  const {
    user,
    params: { id },
  } = req;
  logger.info(`DELETE /fragments/:id - deleting the fragment with given id`);
  logger.debug(`user details: ${JSON.stringify(user)}`);
  logger.debug(`requested fragment's ID: ${id}`);

  try {
    await Fragment.delete(user, id);
    res.status(200).send(createSuccessResponse());
    logger.info(`DELETE request completed successfully`);
  } catch (err) {
    logger.error(`Fragment ${id} not found.`);
    res.status(404).send(createErrorResponse(404, 'Not found'));
  }
};
