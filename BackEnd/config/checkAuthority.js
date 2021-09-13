/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
// passport.js
// const passport = require("passport");
// const passportJWT = require("passport-jwt");
const e = require('express');
const { decode } = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const { restaurants, customers } = require('../models/data.model');
// const JWTStrategy = passportJWT.Strategy;
// const ExtractJWT = passportJWT.ExtractJwt;

async function checkAuth(req, res, next) {
  const path = req.path;
  if (
    path === '/auth/login'
    || path === '/auth/reslogin'
    || path === '/auth/register'
    || path === '/auth/resregister'
  ) {
    next();
  } else {
    const header = req.headers.authorization;
    if (typeof header !== 'undefined') {
      const decodedToken = jwtDecode(header);
      if (decodedToken.role === 'restaurant') {
        const rest = await restaurants.findOne({
          where: {
            r_email: decodedToken.email,
          },
        });
        if (!rest) {
          res.status(209).send('Permissions Required For accessing Restuarant');
        } else {
          next();
          // res.status(201).json(rest)
        }
      } else if (decodedToken.role === 'customer') {
        const cust = await customers.findOne({
          where: {
            c_email: decodedToken.email,
          },
        });
        if (!cust) {
          res.status(209).send('Permissions Required For accessing Customers');
        } else {
          next();
        }
      } else {
        res.status(209).send('No Authorization');
      }
    } else {
      res.status(403).send('FORBIDDEN');
    }
  }
}

exports.checkAuth = checkAuth;
