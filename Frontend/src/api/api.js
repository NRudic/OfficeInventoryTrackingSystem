import axios from 'axios'

const api = axios.create({
    baseURL: 'https://inventory-tracker-bk.herokuapp.com/api'
    //baseURL: 'http://localhost:5000/api'

});

api.defaults.headers.post['Content-Type'] = 'application/json';
api.defaults.headers.put['Content-Type'] = 'application/json';

export default {
    async login(email, password) {
        let response = await api.get(`/login/${email}_${password}`);
        return response.data;
    },
    /*async login(userData) {
        let data = JSON.stringify(userData);
        try {
            let response = await api.post('/login', data);
            return response;
        } catch (err) {
            console.error(err);
        }
    },
*/

    async getUsers() {
        let response = await api.get('/user');
        return response.data;
    },

    async getUserById(userId) {
        let response = await api.get(`/user/${userId}`);
        return response.data;
    },

    async addNewUser(userData) {
        let response = await api.post('/user', userData);
        return response.data;
    },

    async updateUser(userData, userId) {
        let response = await api.put(`/user/${userId}`, userData);
        return response.data;
    },

    async disableUser(userId) {
        let response = await api.put(`/user/disable/${userId}`);
        return response.data;
    },

    async changeUserPw(userData, userId) {
        let response = await api.put(`/user/changepw/${userId}`, userData);
        return response.data;
    },


    async getItems() {
        let response = await api.get('/item');
        return response.data;
    },
    async getItemById(itemId) {
        let response = await api.get(`/item/${itemId}`);
        return response.data;
    },

    async disableItem(itemId) {
        let response = await api.put(`/item/disable/${itemId}`);
        return response.data;
    },

    async addNewItem(itemData) {
        let response = await api.post('/item', itemData);
        return response.data;
    },

    async updateItem(itemId, itemData) {
        let response = await api.put(`/item/${itemId}`, itemData);
        return response.data;
    },


    async createTransferRequest(transferData) {
        let response = await api.post('/transfer', transferData);
        return response.data;
    },

    async transferItemsToAnotherUser(itemData) {
        let response = await api.put('/item/transfer', itemData);
        return response.data;
    },

    async addItemOwnershipToUser(itemData) {
        let response = await api.post('/item/ownership', itemData);
        return response.data;
    },

    async createWriteoffRequest(writeoffData) {
        let response = await api.post('/writeoff', writeoffData);
        return response.data;
    },

    async deleteUserItemOwnership(userItemData) {
        let response = await api.delete('/item/ownership', { data: userItemData });
        return response.data;
    },

    async getTransferRequests() {
        let response = await api.get('/transfer');
        return response.data;
    },

    async editTransfer(transferId, trasferData) {
        let response = await api.put(`/transfer/${transferId}`, trasferData);
        return response.data;
    },

    async getWriteoffRequests() {
        let response = await api.get('/writeoff');
        return response.data;
    },

    async editWriteoff(writeoffId, writeoffData) {
        let response = await api.put(`/writeoff/${writeoffId}`, writeoffData);
        return response.data;
    },

    async getItemGroups() {
        let response = await api.get('/group');
        return response.data;
    },

    async addItemGroup(groupData) {
        let response = await api.post('/group', groupData);
        return response.data;
    },
    async editItemGroup(groupid, groupData) {
        let response = await api.put(`/group/${groupid}`, groupData);
        return response.data;
    },
}