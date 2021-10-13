'use strict';

const express = require('express');
const transferRequestController = require('../controllers/transferRequestController');
const router = express.Router();

// .../api/transfer/...
router.get('/', transferRequestController.getTransfer);
router.get('/:id', transferRequestController.getTransferById);
router.get('/user/:id', transferRequestController.getTransferByUserId);
router.post('/', transferRequestController.addTransfer);
router.put('/:id', transferRequestController.editTransfer);

module.exports = router