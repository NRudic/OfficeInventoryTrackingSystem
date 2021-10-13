'use strict';

const transferRequestQueries = require('../data/transferRequest');
const getTransfer = async (req, res, next) => {
    try {
        const requests = await transferRequestQueries.getTransfer();
        res.send(requests)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getTransferById = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const requests = await transferRequestQueries.getTransferById(requestId);
        res.send(requests)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getTransferByUserId = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const requests = await transferRequestQueries.getTransferByUserId(userId);
        res.send(requests)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addTransfer = async (req, res, next) => {
    try {
        const data = req.body;
        const requests = await transferRequestQueries.addTransfer(data);
        res.send(requests)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const editTransfer = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const data = req.body;
        const updated = await transferRequestQueries.editTransfer(requestId, data);
        res.send(updated)
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    getTransfer,
    getTransferById,
    getTransferByUserId,
    addTransfer,
    editTransfer
}