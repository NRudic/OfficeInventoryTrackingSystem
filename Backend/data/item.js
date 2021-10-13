'use strict';

const { pool } = require('../config');
const { response } = require('express');

const getItems = async () => {
    try {
        const sqlQuery = `SELECT item_id,item_name,item_sn,item_description,purchase_price,purchase_date,is_scannable,item.is_active,group_name,fk_groupid, in_possession_from_date, last_recorded_date, user_id, concat(first_name, ' ', last_name) as user_name FROM item 
        LEFT JOIN item_group ON fk_groupid = group_id 
        LEFT JOIN xref_user_has_item ON item_id = fk_itemid
        LEFT JOIN app_user ON fk_userid = user_id`
        const response = await pool.query(sqlQuery);
        console.log(response)
        return response.rows;

    } catch (error) {
        throw new Error(error.message);
    }
}

const getItemById = async (itemId) => {
    try {
        const sqlQuery = `SELECT item_id,item_name,item_sn,item_description,purchase_price,purchase_date,is_scannable,item.is_active,group_name,fk_groupid, in_possession_from_date, last_recorded_date, user_id, concat(first_name, ' ', last_name) as user_name FROM item 
        LEFT JOIN item_group ON fk_groupid = group_id 
        LEFT JOIN xref_user_has_item ON item_id = fk_itemid
        LEFT JOIN app_user ON fk_userid = user_id
        WHERE item_id = $1`
        const response = await pool.query(sqlQuery, [itemId]);
        if (response.rows.length > 0) {
            return response.rows[0];
        }
        else {
            throw new Error("Aritkl ne postoji.");//Item doesnt exist
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

const addItem = async (itemData) => {
    try {
        let { item_name, item_sn, item_description, purchase_price, purchase_date, is_scannable, fk_groupid } = itemData;
        const sqlQuery = "INSERT INTO item (item_name,item_sn,item_description,purchase_price,purchase_date,is_scannable,fk_groupid,is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
        const itemResponse = await pool.query(sqlQuery, [item_name, item_sn, item_description, purchase_price, purchase_date, is_scannable, fk_groupid, true]);
        return itemResponse.rows;
    } catch (error) {
        throw new Error(error.message);
    }
}

const editItem = async (itemId, itemData) => {
    try {
        let { item_name, item_sn, item_description, purchase_price, purchase_date, is_scannable, fk_groupid } = itemData;

        const existingItemResponse = await pool.query("SELECT * FROM item WHERE item_id = $1", [itemId]);
        if (existingItemResponse.rows.length > 0) {
            const sqlQuery = "UPDATE item SET item_name = $1, item_sn = $2, item_description = $3, purchase_price = $4, purchase_date = $5, is_scannable = $6, fk_groupid=$7 WHERE item_id =$8 RETURNING *";
            const userResponse = await pool.query(sqlQuery, [item_name, item_sn, item_description, purchase_price, purchase_date, is_scannable, fk_groupid, itemId]);
            return userResponse.rows[0];

        } else {
            throw new Error("Aritkl ne postoji.");//Item doesnt exist
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

const getItemsByUserId = async (userId) => {
    try {
        const sqlQuery = `SELECT item_id,item_name,item_sn,item_description,purchase_price,purchase_date,is_scannable,item.is_active,group_name,fk_groupid, in_possession_from_date, last_recorded_date, user_id, concat(first_name, ' ', last_name) as user_name FROM item 
        LEFT JOIN item_group ON fk_groupid = group_id 
        LEFT JOIN xref_user_has_item ON item_id = fk_itemid
        LEFT JOIN app_user ON fk_userid = user_id
        WHERE xref_user_has_item.fk_userid = $1`
        const response = await pool.query(sqlQuery, [userId]);
        return response.rows;

    } catch (error) {
        throw new Error(error.message);
    }
}


const addItemOwnershipToUser = async (userItemData) => {
    try {
        let { userId, itemId } = userItemData;
        const someoneHasItemResponse = await pool.query("SELECT * FROM xref_user_has_item WHERE fk_itemid = $1", [itemId]);
        if (someoneHasItemResponse.rows.length > 0) {
            throw new Error("Artikl već pripada drugom korisniku.");// Item is already owned by other user
        } else {
            const sqlQuery = "INSERT INTO xref_user_has_item (fk_userid, fk_itemid, in_possession_from_date, last_recorded_date) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *";
            const response = await pool.query(sqlQuery, [userId, itemId]);
            return response.rows;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


const transferItemsToAnotherUser = async (userItemData) => {
    try {
        let { userId, itemId, newUserId } = userItemData;
        const sqlQuery = `UPDATE xref_user_has_item SET fk_userid=$1, in_possession_from_date=CURRENT_TIMESTAMP, last_recorded_date=CURRENT_TIMESTAMP WHERE fk_userid=$2 AND fk_itemid=$3 RETURNING *`
        const response = await pool.query(sqlQuery, [newUserId, userId, itemId]);
        return response.rows;

    } catch (error) {
        throw new Error(error.message);
    }
}

const updateUserItemLastRecoredDate = async (userItemData) => {
    try {
        let { userId, itemId } = userItemData;
        const sqlQuery = `UPDATE xref_user_has_item SET last_recorded_date=CURRENT_TIMESTAMP WHERE fk_userid=$1 AND fk_itemid=$2 RETURNING *`
        const response = await pool.query(sqlQuery, [userId, itemId]);
        return response.rows;

    } catch (error) {
        throw new Error(error.message);
    }
}

// RETURN SUCCESS?? IZMJENA ?? 
const deleteUserItemOwnership = async (userItemData) => {
    try {
        let { userId, itemId } = userItemData;
        const sqlQuery = `DELETE FROM xref_user_has_item WHERE fk_userid=$1 AND fk_itemid=$2 RETURNING *`
        const deleteResponse = await pool.query(sqlQuery, [userId, itemId]);
        if (deleteResponse.rowCount > 0) {
            return deleteResponse;
        } else {
            throw new Error("Greška prilikom brisanja.");//Error
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

const disableItem = async (itemId) => {
    try {
        const existingItemResponse = await pool.query("SELECT * FROM item WHERE item_id = $1", [itemId]);
        if (existingItemResponse.rows.length > 0) {
            const existingItemOwnership = await pool.query("SELECT * FROM xref_user_has_item LEFT JOIN app_user ON user_id = fk_userid WHERE fk_itemid = $1", [itemId]);
            if (existingItemOwnership.rows.length > 0) {
                throw new Error(`Artikl je u vlasništvu korisnika ${existingItemOwnership.rows[0].first_name} ${existingItemOwnership.rows[0].last_name}. Prvo napravite otpis`);//Item is owned by user, write it off first.
            }
            const existingTransferRequests = await pool.query("SELECT * FROM transfer_request WHERE fk_itemid = $1 AND is_accepted = false AND is_active = true", [itemId]);
            if (existingTransferRequests.rows.length > 0) {
                throw new Error(`Za artikl trenutno postoji otvoren zahtjev za prijenos (Zahtjev br: ${existingTransferRequests.rows[0].transfer_id}). Razriješite ga prije deaktiviranja artikla`);//There are transfer requests connected to this item, remove it before deactivating item
            }
            const existingWriteoffRequests = await pool.query("SELECT * FROM writeoff_request WHERE fk_itemid = $1 AND is_accepted = false AND is_active = true", [itemId]);
            if (existingWriteoffRequests.rows.length > 0) {
                throw new Error(`Za Artikl trenutno postoji otvoren zahtjev za otpis (Zahtjev br: ${existingWriteoffRequests.rows[0].writeoff_id}). Razriješite ga prije deaktiviranja artikla`);//There are writeoff requests connected to this item, remove it before deactivating item
            }

            const sqlQuery = "UPDATE item SET is_active = false WHERE item_id =$1 RETURNING *";
            const itemResponse = await pool.query(sqlQuery, [itemId]);
            return itemResponse.rows[0];

        } else {
            throw new Error("Artikl ne postoji.");//Item doesnt exist
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getItems,
    getItemById,
    addItem,
    editItem,
    getItemsByUserId,
    addItemOwnershipToUser,
    transferItemsToAnotherUser,
    updateUserItemLastRecoredDate,
    deleteUserItemOwnership,
    disableItem
}