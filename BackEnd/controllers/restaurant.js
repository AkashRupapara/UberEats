/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  restaurants,
  restaurant_dishtypes,
  dish_imgs,
  dishes,
  sequelize,
} = require('../models/data.model');

// const { body, validationResult } = require('express-validator');

const createRestaurant = async (req, res) => {
  try {
    const {
      email, password, name, city, state, desc, contact, dish_types, del_type, start, end,
    } = req.body;

    // Validate user input
    if (!(name && email && password)) {
      res.status(400).send('All input is required');
    }
    // check if Restaurant already exist
    // Validate if user exist in our database
    const oldRes = await restaurants.findOne({
      where: {
        r_email: email,
      },
    });

    if (oldRes) {
      res.status(409).send('Restaurant Already Exist. Please Login');
    } else {
      // Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);
      let token;

      const t = await sequelize.transaction();
      try {
        // const t = await sequelize.transaction()
        const restaurant = await restaurants.create(
          {
            r_name: name,
            r_email: email,
            r_password: encryptedPassword,
            r_address_line: req.body.address_line,
            r_city: city,
            r_state: state,
            r_zipcode: req.body.zipcode,
            r_desc: desc,
            r_contact_no: contact,
            r_delivery_type: del_type,
            r_start: start,
            r_end: end,
          },
          { transaction: t },
        );
        if (dish_types) {
          const dishTypes = dish_types.map((ele) => ({
            r_id: restaurant.r_id,
            rdt_type: ele,
          }));
          await restaurant_dishtypes.bulkCreate(dishTypes, {
            transaction: t,
          });
        }

        token = jwt.sign({ r_id: restaurant.r_id, email, role: 'restaurant' }, 'UberEats', {
          expiresIn: '2h',
        });
        await t.commit();
        res.status(201).json(token);
      } catch (error) {
        await t.rollback();
        res.status(404).send(error);
      }
    }
  } catch (err) {
    res.status(404).send(err);
  }
};

const restaurantLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) res.status(400).send('All input is required');

  const rest = await restaurants.findOne({
    where: {
      r_email: email,
    },
  });

  if (!rest) {
    res.status(409).send('Restaurant does not exist');
  } else {
    bcrypt.compare(password, rest.r_password, (err, result) => {
      if (err) {
        // handle error
        res.status(409).send('Error Verifying details!!!');
      }
      if (result) {
        // Send JWT
        // Create token
        const token = jwt.sign({ r_id: rest.r_id, email, role: 'restaurant' }, 'UberEats', {
          expiresIn: '2h',
        });
        // save customer token
        rest.token = token;
        return res.status(201).json(token);
      }
      // response is OutgoingMessage object that server response http request
      return res.json({ success: false, message: 'passwords do not match' });
    });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restId = req.params.rid;
    const rest = await restaurants.findOne({
      where: {
        r_id: restId,
      },
    });

    if (!rest) return res.status(404).send('Restaurant Not Found');

    if (req.body.email && req.body.email !== rest.r_email) {
      const checkRest = await restaurants.findOne({
        where: {
          r_email: req.body.email,
        },
      });

      if (checkRest) {
        return res.status(403).send('Restaurant already exist with given email');
      }
    }
    const t = await sequelize.transaction();

    try {
      await restaurants.update(
        {
          r_name: req.body.name,
          r_city: req.body.city,
          r_state: req.body.state,
          r_address_line: req.body.address_line,
          r_zipcode: req.body.zipcode,
          r_desc: req.body.desc,
          r_contact_no: req.body.contact,
          r_delivery_type: req.body.delivery_type,
          r_start: req.body.start,
          r_end: req.body.end,
        },
        {
          returning: true,
          where: { r_id: restId },
        },
        { transaction: t },
      );
      if (req.body.dih_types) {
        const dishTypes = req.body.dish_types.map((ele) => ({
          r_id: restId,
          rdt_type: ele,
        }));
        await restaurant_dishtypes.destroy(
          {
            where: {
              r_id: restId,
            },
          },
          { transaction: t },
        );
        await restaurant_dishtypes.bulkCreate(dishTypes, {
          transaction: t,
        });
      }
      await t.commit();
    } catch (err) {
      await t.rollback();
      res.status(404).send(err);
    }
    return res.status(201).send(rest);
  } catch (err) {
    return res.status(404).send(err);
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const findEntry = await restaurants.findOne({
      where: {
        r_id: req.params.rid,
      },
    });
    if (!findEntry) {
      res.status(404).send('Restaurant Does not Exist to delete');
    } else {
      await restaurants.destroy({
        where: {
          r_id: req.params.rid,
        },
      });
      res.status(201).send({});
    }
  } catch (err) {
    res.status(404).send(err);
  }
};

const getRestaurantDetails = async (req, res) => {
  const restId = req.params.rid;
  if (!restId) return res.status(404).send('Provide Restaurant ID');

  const restDetails = await restaurants.findOne({
    include: [
      {
        model: dishes,
        include: dish_imgs,
      },
    ],
    where: {
      r_id: restId,
    },
  });
  return res.status(201).send(restDetails);
};
module.exports = {
  restaurantLogin,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantDetails,
};
