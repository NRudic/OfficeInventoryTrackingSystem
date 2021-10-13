'use strict';

const express = require('express');
const groupController = require('../controllers/groupController');
const router = express.Router();

// .../api/group
router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroupById);
router.post('/', groupController.addGroup);
router.put('/:id', groupController.editGroup);

module.exports = router
