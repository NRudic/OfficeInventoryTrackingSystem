'use strict';

const userQueries = require('../data/user');
const { SECRET_KEY } = require('../config');
var jwt = require('jsonwebtoken');

const getUsers = async (req, res, next) => {
    try {
        const users = await userQueries.getUsers();
        res.send(users)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await userQueries.getUserById(userId);
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const loginUser = async (req, res, next) => {
    try {
        const data = req.body;
        const user = await userQueries.loginUser(data);
        if (!(user instanceof Error)) {
            const token = jwt.sign({ id: user.user_id }, SECRET_KEY);
            res.cookie('sessionToken', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
        }
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addUser = async (req, res, next) => {
    try {
        const data = req.body;
        const user = await userQueries.addUser(data);
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const editUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        const updated = await userQueries.editUser(userId, data);
        res.send(updated)
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const disableUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const response = await userQueries.disableUser(userId);
        res.send(response)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const changeUserPassword = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        const updated = await userQueries.changeUserPassword(userId, data);
        res.send(updated)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    getUsers,
    getUserById,
    addUser,
    editUser,
    disableUser,
    changeUserPassword,
    loginUser

}