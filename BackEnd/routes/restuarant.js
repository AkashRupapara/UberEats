/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/// Authentication

const express = require('express');

const router = express.Router();
// const { checkAuth } = require('../config/checkAuthority');

router.post('/', async (req, res) => {
   console.log(req.body);
});

module.exports = router;
