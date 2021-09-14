/* eslint-disable camelcase */
const express = require('express');
const jwtDecode = require('jwt-decode');
const { customers } = require('../models/data.model');

const router = express.Router();
function isValidEmailAddress(emailAddress) {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(emailAddress).toLowerCase());
}
router.put('/:cid', async (req, res) => {
  const headerToken = req.headers.authorization;
  const custID = jwtDecode(headerToken).c_id;
  if (custID !== req.params.cid) return res.status(401).send('Unauthorised');

  const {
    name,
    email,
    about,
    profile_img,
    dob,
    city,
    state,
    country,
    nick_name,
    contact_no,
  } = req.body;

  const cust = await customers.findOne({
    where: {
      c_id: custID,
    },
  });

  if (!isValidEmailAddress(email)) {
    return res.json({
      status: 'error',
      message: 'Enter Valid Email Address.',
    });
  }

  if (email && email !== cust.c_email) {
    const checkCust = await customers.findOne({
      where: {
        c_email: email,
      },
    });

    if (checkCust) return res.status(403).send('Customer already exist with given email');
  }

  try {
    await cust.update(
      {
        c_name: name,
        c_email: email,
        c_about: about,
        c_profile_img: profile_img,
        c_dob: dob,
        c_city: city,
        c_state: state,
        c_country: country,
        c_nick_name: nick_name,
        c_contact_no: contact_no,
      },
      {
        returning: true,
      },
    );
    return res.status(201).send('Customer Updated');
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.delete('/:cid', async (req, res) => {
  const custID = req.params.cid;
  if (!custID) return res.status(404).send('Need Customer ID');

  const cust = await customers.findOne({
    where: {
      c_id: custID,
    },
  });

  if (!cust) return res.status(403).send('Customer does not exist');
  try {
    cust.destroy();
    return res.status(201).send('Customer deleted');
  } catch (err) {
    return res.status(404).send(err);
  }
});
module.exports = router;
