'use strict';

const { pool } = require('../config');
const { response } = require('express');

const getGroups = async () => {
    try {
        const sqlQuery = "SELECT * FROM item_group"
        const response = await pool.query(sqlQuery);
        return response.rows;

    } catch (error) {
        throw new Error(error.message);
    }
}

const getGroupById = async (groupId) => {
    try {
        const sqlQuery = "SELECT * FROM item_group WHERE group_id = $1"
        const response = await pool.query(sqlQuery, [groupId]);
        if (response.rows.length > 0) {
            return response.rows;
        }
        else {
            throw new Error("Grupa ne postoji.");//Group doesnt exist
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

const addGroup = async (groupData) => {
    try {
        let { group_name, group_description } = groupData;

        const sqlQuery = "INSERT INTO item_group (group_name,group_description) VALUES ($1, $2) RETURNING *";
        const itemResponse = await pool.query(sqlQuery, [group_name, group_description]);
        return itemResponse.rows[0];

    } catch (error) {
        throw new Error(error.message);
    }
}

const editGroup = async (groupId, groupData) => {
    try {
        let { group_name, group_description } = groupData;

        const existingItemResponse = await pool.query("SELECT * FROM item_group WHERE group_id = $1", [groupId]);
        if (existingItemResponse.rows.length > 0) {
            const sqlQuery = "UPDATE item_group SET group_name = $1, group_description = $2 WHERE group_id =$3 RETURNING *";
            const itemResponse = await pool.query(sqlQuery, [group_name, group_description, groupId]);
            return itemResponse.rows[0];

        } else {
            throw new Error("Grupa ne postoji.");//Group doesnt exist
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getGroups,
    getGroupById,
    addGroup,
    editGroup
}