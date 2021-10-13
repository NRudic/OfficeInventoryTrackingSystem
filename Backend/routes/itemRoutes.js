'use strict';

const express = require('express');
const itemController = require('../controllers/itemController');
const router = express.Router();

// .../api/item/...
router.post('/ownership', itemController.addItemOwnershipToUser);
router.put('/transfer', itemController.transferItemsToAnotherUser);
router.put('/ownership', itemController.updateUserItemLastRecoredDate);
router.delete('/ownership', itemController.deleteUserItemOwnership);
router.put('/disable/:id', itemController.disableItem);
router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);
router.post('/', itemController.addItem);
router.put('/:id', itemController.editItem);
router.get('/user/:id', itemController.getItemsByUserId);

module.exports = router