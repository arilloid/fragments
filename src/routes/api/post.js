const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const apiUrl = process.env.API_URL || 'http://localhost:8080';

module.exports = async (req, res) => {
  logger.info(`POST /fragments/:id - creating a new fragment`);

  const contentType = req.get('Content-Type');
  logger.debug(`content type received: ${contentType}`);

  if (!Fragment.isSupportedType(req.get('Content-Type'))) {
    return res.status(415).json(response.createErrorResponse(415, 'Content-Type is not supported'));
  }
  try {
    const fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type'),
      size: req.body.length,
    });
    // Saving the fragment
    await fragment.save();
    // Saving the fragment's binary data
    await fragment.setData(req.body);
  
    res
      .set('Location', `${apiUrl}/v1/fragments/${fragment.id}`)
      .status(201)
      .json(response.createSuccessResponse({ fragment }));
  } catch (error) {
    logger.error('Error saving fragment:', error);
    res.status(400).json(response.createErrorResponse(400, error));
  }
};
