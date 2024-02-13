// src/response.js

// Create successful responses
module.exports.createSuccessResponse = function (data) {
  return {
    status: 'ok',
    ...data,
  };
};

// Create erroneous responses 
module.exports.createErrorResponse = function (code, message) {
  return {
    status: 'error',
    error: {
      code: code,
      message: message,
    },
  };
};
