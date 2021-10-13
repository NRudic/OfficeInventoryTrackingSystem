'use strict';

const itemQueries = require('../data/item');
const getItems = async (req, res, next) => {
    try {
        const items = await itemQueries.getItems();
        res.send(items)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getItemById = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const items = await itemQueries.getItemById(itemId);
        res.send(items)
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const addItem = async (req, res, next) => {
    try {
        const data = req.body;
        const items = await itemQueries.addItem(data);
        res.send(items)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const editItem = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const data = req.body;
        const updated = await itemQueries.editItem(itemId, data);
        res.send(updated)
    } catch (error) {
        res.status(400).send(error.message);
    }
}
// GET .../api/item/user/5
const getItemsByUserId = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const items = await itemQueries.getItemsByUserId(userId);
        res.send(items)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// POST .../api/item/ownership
const addItemOwnershipToUser = async (req, res, next) => {
    try {
        const data = req.body;
        const response = await itemQueries.addItemOwnershipToUser(data);
        res.send(response)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// PUT .../api/item/transfer
const transferItemsToAnotherUser = async (req, res, next) => {
    try {
        const data = req.body;
        const response = await itemQueries.transferItemsToAnotherUser(data);
        res.send(response)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// PUT .../api/item/ownership
const updateUserItemLastRecoredDate = async (req, res, next) => {
    try {
        const data = req.body;
        const response = await itemQueries.updateUserItemLastRecoredDate(data);
        res.send(response)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// DELETE  .../api/item/ownership
const deleteUserItemOwnership = async (req, res, next) => {
    try {
        const data = req.body;
        const response = await itemQueries.deleteUserItemOwnership(data);
        res.send(response)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// POST .../api/item/disable/5
const disableItem = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const item = await itemQueries.disableItem(itemId);
        res.send(item)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    getItems,
    getItemById,
    getItemsByUserId,
    addItem,
    editItem,
    addItemOwnershipToUser,
    transferItemsToAnotherUser,
    updateUserItemLastRecoredDate,
    deleteUserItemOwnership,
    disableItem
}