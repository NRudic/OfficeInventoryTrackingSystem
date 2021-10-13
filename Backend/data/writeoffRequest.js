'use strict';

const { pool } = require('../config');
const { response } = require('express');

const getWriteoff = async () => {
    try {
        const sqlQuery = `SELECT wr.writeoff_id,
                                    wr.reason,
                                    wr.request_date,
                                    wr.is_accepted,
                                    wr.is_active,
                                    u.user_id, 
                                    u.first_name,
                                    u.last_name,
                                    u.email,                                    
                                    item.item_id,
                                    item.item_name,
                                    item.item_sn,
                                    item.item_description,
                                    item.purchase_price AS item_purchase_price,
                                    item.purchase_date AS item_purchase_date
                        FROM writeoff_request wr 
                        LEFT JOIN app_user AS u ON wr.fk_userid = u.user_id 
                        LEFT JOIN item ON wr.fk_itemid = item.item_id`
        const response = await pool.query(sqlQuery);
        return response.rows;

    } catch (error) {
        throw new Error(error.message);
    }
}

const getWriteoffById = async (writeoffRequestId) => {
    try {
        const sqlQuery = `SELECT wr.writeoff_id,
                                wr.reason,
                                wr.request_date,
                                wr.is_accepted,
                                wr.is_active,
                                u.user_id, 
                                u.first_name AS owner_name,
                                u.last_name AS owner_name,
                                u.email AS owner_email,                                    
                                item.item_id,
                                item.item_name,
                                item.item_sn,
                                item.item_description,
                                item.purchase_price AS item_purchase_price,
                                item.purchase_date AS item_purchase_date
                        FROM writeoff_request wr 
                        LEFT JOIN app_user AS u ON wr.fk_userid = u.user_id 
                        LEFT JOIN item ON wr.fk_itemid = item.item_id
                        WHERE wr.writeoff_id = $1`
        const response = await pool.query(sqlQuery, [writeoffRequestId]);
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

const getWriteoffByUserId = async (userId) => {
    try {
        const sqlQuery = `SELECT wr.writeoff_id,
                                wr.reason,
                                wr.request_date,
                                wr.is_accepted,
                                wr.is_active,
                                u.user_id, 
                                u.first_name AS owner_name,
                                u.last_name AS owner_name,
                                u.email AS owner_email,                                    
                                item.item_id,
                                item.item_name,
                                item.item_sn,
                                item.item_description,
                                item.purchase_price AS item_purchase_price,
                                item.purchase_date AS item_purchase_date
                        FROM writeoff_request wr 
                        LEFT JOIN app_user AS u ON wr.fk_userid = u.user_id 
                        LEFT JOIN item ON wr.fk_itemid = item.item_id
                        WHERE wr.fk_userid = $1`
        const response = await pool.query(sqlQuery, [userId]);
        return response.rows;

    } catch (error) {
        throw new Error(error.message);
    }
}

const addWriteoff = async (writeoffData) => {
    try {
        let { reason, fkItemId, fkOwnerId, isAccepted, isActive } = writeoffData;
        const existingRequestResponse = await pool.query("SELECT * FROM writeoff_request WHERE fk_itemid = $1 AND is_accepted = false AND is_active = true", [fkItemId]);
        if (existingRequestResponse.rows.length == 0) {
            const sqlQuery = "INSERT INTO writeoff_request (reason, request_date, fk_itemid, fk_userid, is_accepted, is_active) VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5) RETURNING *";
            const requestResponse = await pool.query(sqlQuery, [reason, fkItemId, fkOwnerId, isAccepted, isActive]);
            return requestResponse.rows[0];
        } else {
            throw new Error("Aktivan zahtjev za otpis tog artikla već postoji. Izbrišite postojeći zahtjev da bi stvorili novi za taj artikl.");//Active writeoff request for that item already exists.
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

const editWriteoff = async (writeoffRequestId, writeoffData) => {
    try {
        let { is_accepted, is_active } = writeoffData;

        const existingRequestResponse = await pool.query("SELECT * FROM writeoff_request WHERE writeoff_id = $1 AND is_active=true", [writeoffRequestId]);
        if (existingRequestResponse.rows.length > 0) {
            const sqlQuery = "UPDATE writeoff_request SET is_accepted = $1, is_active = $2 WHERE writeoff_id =$3 RETURNING *";
            const requestResponse = await pool.query(sqlQuery, [is_accepted, is_active, writeoffRequestId]);
            return requestResponse.rows[0];

        } else {
            throw new Error("Traženi zahtjev za otpis ne postoji u aktivnim zahtjevima.");//That writeoff request doesnt exist among active requests.
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getWriteoff,
    getWriteoffById,
    getWriteoffByUserId,
    addWriteoff,
    editWriteoff
}