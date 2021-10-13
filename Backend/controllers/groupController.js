'use strict';

const groupQueries = require('../data/itemGroup');

const getGroups = async (req, res, next) => {
    try {
        const groups = await groupQueries.getGroups();
        res.send(groups)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getGroupById = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const group = await groupQueries.getGroupById(groupId);
        res.send(group)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addGroup = async (req, res, next) => {
    try {
        const data = req.body;
        const group = await groupQueries.addGroup(data);
        res.send(group)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const editGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const data = req.body;
        const updated = await groupQueries.editGroup(groupId, data);
        res.send(updated)
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    getGroups,
    getGroupById,
    addGroup,
    editGroup
}