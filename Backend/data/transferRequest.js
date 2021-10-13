'use strict';

const { pool } = require('../config');
const { response } = require('express');

const getTransfer = async () => {
    try {
        const sqlQuery = `SELECT tr.transfer_id,
                                    tr.reason,
                                    tr.request_date,
                                    tr.is_accepted,
                                    tr.is_active,
                                    u1.user_id AS prev_id, 
                                    u1.first_name AS prev_first_name,
                                    u1.last_name AS prev_last_name,
                                    u1.email AS prev_email,
                                    u2.user_id AS next_id, 
                                    u2.first_name AS next_first_name,
                                    u2.last_name AS next_last_name,
                                    u2.email AS next_email,
                                    item.item_id,
                                    item.item_name,
                                    item.item_sn,
                                    item.item_description,
                                    item.purchase_price AS item_purchase_price,
                                    item.purchase_date AS item_purchase_date
                        FROM transfer_request tr 
                        LEFT JOIN app_user AS u1 ON tr.fk_previous_ownerid = u1.user_id 
                        LEFT JOIN app_user AS u2 ON tr.fk_new_ownerid = u2.user_id 
                        LEFT JOIN item ON tr.fk_itemid = item.item_id`
        const response = await pool.query(sqlQuery);
        return response.rows;

    } catch (error) {
        throw new Error(error.message);
    }
}

const getTransferById = async (transferRequestId) => {
    try {
        const sqlQuery = `SELECT tr.transfer_id,
                                    tr.reason,
                                    tr.request_date,
                                    tr.is_accepted,
                                    tr.is_active,
                                    u1.user_id AS prev_id, 
                                    u1.first_name AS prev_first_name,
                                    u1.last_name AS prev_last_name,
                                    u1.email AS prev_email,
                                    u2.user_id AS next_id, 
                                    u2.first_name AS next_first_name,
                                    u2.last_name AS next_last_name,
                                    u2.email AS next_email,
                                    item.item_id,
                                    item.item_name,
                                    item.item_sn,
                                    item.item_description,
                                    item.purchase_price AS item_purchase_price,
                                    item.purchase_date AS item_purchase_date
                            FROM transfer_request tr 
                            LEFT JOIN app_user AS u1 ON tr.fk_previous_ownerid = u1.user_id 
                            LEFT JOIN app_user AS u2 ON tr.fk_new_ownerid = u2.user_id 
                            LEFT JOIN item ON tr.fk_itemid = item.item_id
                            WHERE tr.transfer_id = $1`
        const response = await pool.query(sqlQuery, [transferRequestId]);
        if (response.rows.length > 0) {
            return response.rows;
        }
        else {
            throw new Error("Zahtjev ne postoji.");//Request doesnt exist
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

const getTransferByUserId = async (userId) => {
    try {
        const sqlQuery = `SELECT tr.transfer_id,
                                    tr.reason,
                                    tr.request_date,
                                    tr.is_accepted,
                                    tr.is_active,
                                    u1.user_id AS prev_id, 
                                    u1.first_name AS prev_first_name,
                                    u1.last_name AS prev_last_name,
                                    u1.email AS prev_email,
                                    u2.user_id AS next_id, 
                                    u2.first_name AS next_first_name,
                                    u2.last_name AS next_last_name,
                                    u2.email AS next_email,
                                    item.item_id,
                                    item.item_name,
                                    item.item_sn,
                                    item.item_description,
                                    item.purchase_price AS item_purchase_price,
                                    item.purchase_date AS item_purchase_date
                            FROM transfer_request tr 
                            LEFT JOIN app_user AS u1 ON tr.fk_previous_ownerid = u1.user_id 
                            LEFT JOIN app_user AS u2 ON tr.fk_new_ownerid = u2.user_id 
                            LEFT JOIN item ON tr.fk_itemid = item.item_id
                            WHERE tr.fk_previous_ownerid = $1`
        const response = await pool.query(sqlQuery, [userId]);
        return response.rows;

    } catch (error) {
        throw new Error(error.message);
    }
}

const addTransfer = async (transferData) => {
    try {
        let { reason, fkItemId, fkPreviousOwnerId, fkNewOwenerId, isActive, isAccepted } = transferData;
        const existingRequestResponse = await pool.query("SELECT * FROM transfer_request WHERE fk_itemid = $1 AND is_accepted = false AND is_active = true", [fkItemId]);
        if (existingRequestResponse.rows.length == 0) {
            const sqlQuery = "INSERT INTO transfer_request (reason, request_date, fk_itemid, fk_previous_ownerid, fk_new_ownerid, is_active, is_accepted ) VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5, $6) RETURNING *";
            const requestResponse = await pool.query(sqlQuery, [reason, fkItemId, fkPreviousOwnerId, fkNewOwenerId, isActive, isAccepted]);
            return requestResponse.rows[0];
        } else {
            throw new Error("Aktivan zahtjev za prijenos tog artikla već postoji. Izbrišite postojeći zahtjev da bi stvorili novi za taj artikl.");//Active transfer request for that item already exists.
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

const editTransfer = async (transferRequestId, transferData) => {
    try {
        let { is_accepted, is_active } = transferData;

        const existingRequestResponse = await pool.query("SELECT * FROM transfer_request WHERE transfer_id = $1 AND is_active=true", [transferRequestId]);
        if (existingRequestResponse.rows.length > 0) {
            const sqlQuery = "UPDATE transfer_request SET is_accepted = $1, is_active = $2 WHERE transfer_id =$3 RETURNING *";
            const requestResponse = await pool.query(sqlQuery, [is_accepted, is_active, transferRequestId]);
            return requestResponse.rows[0];

        } else {
            throw new Error("Traženi zahtjev za prijenos ne postoji u aktivnim zahtjevima.");//That transfer request doesnt exist among active requests
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getTransfer,
    getTransferById,
    getTransferByUserId,
    addTransfer,
    editTransfer
}