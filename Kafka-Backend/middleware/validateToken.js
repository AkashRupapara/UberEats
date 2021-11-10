/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');
const Customer = require('../models/Customer');


function validateToken(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, 'UberEats', async (err, data) => {
      if (err) {
        console.log(err);
        return res.status(401).send({error: 'Unauthorised Access Token'});
      }
      if (!data.role) {
        return res.status(400).send({error: 'Incomplete Information'});
      }
      if (data.role === 'restaurant') {
        if (!(data.email && data.r_id)) {
          return res.status(400).send({error:'Incomplete Information in Token'});
        }
        const rest = await Restaurant.findOne({
            email: data.email,  
        });
        
        if (!rest) {
          return res
            .status(209)
            .send({error: 'Permissions Required For accessing Restuarant'});
        }
        
        req.headers.role = 'restaurant';
        req.headers.id = data.r_id;
        next();
      } else if (data.role === 'customer') {
        if (!(data.email && data.c_id)) {
          return res.status(400).send({error:'Incomplete Information in Token'});
        }

        const cust = await Customer.findOne({
            email: data.email,
        });

        if (!cust) {
          return res
            .status(209)
            .send({error:'Permissions Required For accessing Customers'});
        }
        req.headers.role = 'customer';
        req.headers.id = data.c_id;

        next();
      } else {
        return res.status(400).send({error:'Error while Authorization'});
      }
    });
  }
}

exports.validateToken = validateToken;
