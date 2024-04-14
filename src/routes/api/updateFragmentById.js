const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const apiUrl = process.env.API_URL || 'http://localhost:8080';

module.exports = async (req, res) => {
  const {
    user,
    params: { id },
  } = req;

  try {
    const fragment = await Fragment.byId(user, id);
    if (req.get('Content-Type') != fragment.type) {
      res
        .status(400)
        .send(createErrorResponse(400, 'Fragment type can not be changed after it is created'));
    } else {
      await fragment.setData(req.body);
      res.location(`${apiUrl}/v1/fragments/${fragment.id}`);
      res.status(200).send(createSuccessResponse({ fragment }));
      logger.info({ fragment: fragment }, `Fragment data updated successfully`);
    }
  } catch (err) {
    logger.error(`Fragment ${id} not found.`);
    res.status(404).send(createErrorResponse(404, 'Unknown fragment'));
  }
};