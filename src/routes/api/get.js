// src/routes/api/get.js
const response = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
    res.status(200).json(response.createSuccessResponse({
      fragments: [],
    }));
  };