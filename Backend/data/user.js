'use strict';

const { pool, SECRET_KEY } = require('../config');
const bcrypt = require('bcrypt');
const { response } = require('express');


const getUsers = async () => {
    try {
        const sqlQuery = "SELECT app_user.user_id, first_name, last_name, email, phone, is_active, fk_roleid FROM app_user"   //name AS role  FROM app_user LEFT JOIN user_role ON app_user.fk_roleid = user_role.id
        const response = await pool.query(sqlQuery);
        return response.rows;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUserById = async (userId) => {
    try {
        const sqlQuery = "SELECT user_id, first_name, last_name, email, phone, is_active, fk_roleid FROM app_user WHERE user_id = $1"
        const response = await pool.query(sqlQuery, [userId]);
        if (response.rows.length > 0) {
            return response.rows;
        }
        else {
            throw new Error("Korisnik ne postoji.");//User doesnt exist
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

//Registration
const addUser = async (userData) => {
    try {
        let { first_name, last_name, email, password, phone, fk_roleid } = userData;
        let pwRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");
        //"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&.,*-]).{8,}$"

        if (pwRegex.test(password.toString())) {
            const existingEmailResponse = await pool.query("SELECT * FROM app_user WHERE email = $1", [email]);
            if (existingEmailResponse.rows.length == 0) {
                let hashedPassword = await bcrypt.hash(password, 10);
                const sqlQuery = "INSERT INTO app_user (first_name, last_name, email, hashed_password, phone, fk_roleid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
                const userResponse = await pool.query(sqlQuery, [first_name, last_name, email, hashedPassword, phone, fk_roleid]);
                return userResponse.rows[0];
            } else {
                throw new Error("Email zauzet.");//Email already taken
            }
        } else {
            throw new Error("Nedovoljno jaka lozinka. Lozinka treba sadržavti 8 znakova, veliko i malo slovo, broj i znak.");//Password is too weak
        }

    } catch (error) {
        throw new Error(error.message);
    }
}


const loginUser = async (loginData) => {
    let { email, password } = loginData;
    let pwRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");

    if (pwRegex.test(password.toString())) {
        const existingEmailResponse = await pool.query("SELECT * FROM app_user WHERE email = $1", [email]);
        if (existingEmailResponse.rows.length > 0) {
            let isPasswordCorrect = await bcrypt.compare(password, existingEmailResponse.rows[0].hashed_password)
            if (isPasswordCorrect) {
                return existingEmailResponse.rows[0];
            } else {
                throw new Error("Email ili lozinka nisu točni. Pokušajte ponovno."); //Email or pw are not correct
            }
        } else {
            throw new Error("Email ili lozinka nisu točni. Pokušajte ponovno.");
        }
    } else {
        throw new Error("Email ili lozinka nisu točni. Pokušajte ponovno.");
    }

}

const editUser = async (userId, userData) => {
    try {
        let { first_name, last_name, email, phone, fk_roleid } = userData;

        const existingUserResponse = await pool.query("SELECT * FROM app_user WHERE user_id = $1", [userId]);
        if (existingUserResponse.rows.length > 0) {
            const sqlQuery = "UPDATE app_user SET first_name = $1, last_name = $2, email = $3, phone = $4, fk_roleid = $5 WHERE user_id =$6 RETURNING *";
            const userResponse = await pool.query(sqlQuery, [first_name, last_name, email, phone, fk_roleid, userId]);
            return userResponse.rows[0];

        } else {
            throw new Error("Korisnik ne postoji.");//User does not exist
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

const disableUser = async (userId) => {
    try {
        const existingUserResponse = await pool.query("SELECT * FROM app_user WHERE user_id = $1", [userId]);
        if (existingUserResponse.rows.length > 0) {
            const existingUserItems = await pool.query("SELECT * FROM xref_user_has_item WHERE fk_userid = $1", [userId]);
            if (existingUserItems.rows.length > 0) {
                throw new Error("Na korisniku trenutno postoje zaduženi artikli. Prenesite ih prije deaktiviranja korisnika");//There are items connected to this user, remove them before deactivating user
            }
            const existingTransferRequests = await pool.query("SELECT * FROM transfer_request WHERE fk_previous_ownerid = $1 OR fk_new_ownerid = $2", [userId, userId]);
            if (existingTransferRequests.rows.length > 0) {
                throw new Error("Za korisnika trenutno postoji otvoren zahtjev za prijenos. Razriješite ih prije deaktiviranja korisnika");//There are transfer requests connected to this user, remove them before deactivating user
            }
            const existingWriteoffRequests = await pool.query("SELECT * FROM writeoff_request WHERE fk_userid = $1", [userId]);
            if (existingWriteoffRequests.rows.length > 0) {
                throw new Error("Za korisnika trenutno postoji otvoren zahtjev za otpis. Razriješite ih prije deaktiviranja korisnika");//There are writeoff requests connected to this user, remove them before deactivating user
            }

            const sqlQuery = "UPDATE app_user SET is_active = false WHERE user_id = $1 RETURNING *";
            const userResponse = await pool.query(sqlQuery, [userId]);
            return userResponse.rows[0];

        } else {
            throw new Error("Korisnik ne postoji.");//User doesnt exist
        }

    } catch (error) {
        throw new Error(error.message);
    }
}


const changeUserPassword = async (userId, userData) => {
    try {
        let { password } = userData;
        let pwRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");
        //^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&.,*-]).{8,}$

        const existingUserResponse = await pool.query("SELECT * FROM app_user WHERE user_id = $1", [userId]);
        if (existingUserResponse.rows.length > 0) {
            if (pwRegex.test(password.toString())) {
                let hashedPassword = await bcrypt.hash(password, 10);
                const sqlQuery = "UPDATE app_user SET hashed_password = $1 WHERE user_id =$2 RETURNING *";
                const userResponse = await pool.query(sqlQuery, [hashedPassword, userId]);
                return userResponse.rows[0];

            } else {
                throw new Error("Nedovoljno jaka lozinka. Potrebno veliko i malo slovo i broj.");//Password is too weak
            }
        } else {
            throw new Error("Korisnik ne postoji.");//User doesnt exist
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getUsers,
    getUserById,
    addUser,
    editUser,
    changeUserPassword,
    disableUser,
    loginUser

}