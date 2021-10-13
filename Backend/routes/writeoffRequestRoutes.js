'use strict';

const express = require('express');
const writeoffRequestController = require('../controllers/writeoffRequestController');
const router = express.Router();

// .../api/writeoff/...
router.get('/', writeoffRequestController.getWriteoff);
router.get('/:id', writeoffRequestController.getWriteoffById);
router.get('/user/:id', writeoffRequestController.getWriteoffByUserId);
router.post('/', writeoffRequestController.addWriteoff);
router.put('/:id', writeoffRequestController.editWriteoff);

module.exports = router