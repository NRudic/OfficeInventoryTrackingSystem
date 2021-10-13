'use strict';

const writeoffRequestQueries = require('../data/writeoffRequest');
const getWriteoff = async (req, res, next) => {
    try {
        const requests = await writeoffRequestQueries.getWriteoff();
        res.send(requests)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getWriteoffById = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const requests = await writeoffRequestQueries.getWriteoffById(requestId);
        res.send(requests)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getWriteoffByUserId = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const requests = await writeoffRequestQueries.getWriteoffByUserId(userId);
        res.send(requests)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addWriteoff = async (req, res, next) => {
    try {
        const data = req.body;
        const requests = await writeoffRequestQueries.addWriteoff(data);
        res.send(requests)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const editWriteoff = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const data = req.body;
        const updated = await writeoffRequestQueries.editWriteoff(requestId, data);
        res.send(updated)
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    getWriteoff,
    getWriteoffById,
    getWriteoffByUserId,
    addWriteoff,
    editWriteoff
}