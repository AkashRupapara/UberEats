const express = require('express');
const jwtDecode = require('jwt-decode');

const { orders, order_dishes, sequelize } = require('../models/data.model');

const router = express.Router();

router.post('/neworder', async (req,res) => {

});