
const express = require('express');
const rootRouter = express.Router();

const userRoutes = require('./userRoutes');
const itemRoutes = require('./itemRoutes');
const groupRoutes = require('./groupRoutes');
const transferRequestRoutes = require('./transferRequestRoutes');
const writeoffRequestRoutes = require('./writeoffRequestRoutes');


rootRouter.use('/user', userRoutes);
rootRouter.use('/item', itemRoutes);
rootRouter.use('/group', groupRoutes);
rootRouter.use('/transfer', transferRequestRoutes);
rootRouter.use('/writeoff', writeoffRequestRoutes);


module.exports = rootRouter;