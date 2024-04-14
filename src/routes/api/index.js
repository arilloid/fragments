// src/routes/api/index.js
const { Fragment } = require('../../model/fragment');
/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Importing content-type module for extracting and parsing types
const contentType = require('content-type');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

// GET /v1/fragments
router.get('/fragments', require('./get'));

// GET /v1/fragments/:id
router.get('/fragments/:id', require('./getFragmentById'));

// GET /v1/fragments/:id/info
router.get('/fragments/:id/info', require('./getInfoById'));

// POST /v1/fragments
router.post('/fragments', rawBody(), require('./post'));

// PUT /v1/fragments/:id
router.put('/fragments/:id', rawBody(), require('./updateFragmentById'));

// DELETE /v1/fragments/:id
router.delete('/fragments/:id', require('./deleteFragmentById'));

module.exports = router;
