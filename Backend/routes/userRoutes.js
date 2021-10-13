'use strict';

const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// .../api/user
router.post('/login', userController.loginUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.addUser);
router.put('/:id', userController.editUser);
router.put('/disable/:id', userController.disableUser);
router.put('/changepw/:id', userController.changeUserPassword);



module.exports = router