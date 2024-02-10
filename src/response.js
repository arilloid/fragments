// src/response.js

// Function for creating successful responses
module.exports.createSuccessResponse = function (data) {
    return {
      status: 'ok',
      // TODO ...
      ...data,
    };
  };
  
  /**
   * An error response looks like:
   *
   * {
   *   "status": "error",
   *   "error": {
   *     "code": 400,
   *     "message": "invalid request, missing ...",
   *   }
   * }
   */
  module.exports.createErrorResponse = function (code, message) {
    // TODO ...
    return {
        status: "error",
        "error": {
            "code": code,
            "message": message,
        }
    }
  };