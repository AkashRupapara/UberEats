/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/// Authentication

const express = require('express');
const {
  restaurants,
  sequelize,
  restaurant_dishtypes,
  dishes,
  dish_imgs,
} = require('../models/data.model');

const router = express.Router();
function isValidEmailAddress(emailAddress) {
  // eslint-disable-next-line no-useless-escape
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(emailAddress).toLowerCase());
}

router.put('/:rid', async (req, res) => {
  try {
    const restId = req.params.rid;
    const rest = await restaurants.findOne({
      where: {
        r_id: restId,
      },
    });

    if (!rest) return res.status(404).send('Restaurant Not Found');

    if (!isValidEmailAddress(req.body.email)) {
      return res.json({
        status: 'error',
        message: 'Enter Valid Email Address.',
      });
    }

    if (req.body.email && req.body.email !== rest.r_email) {
      const checkRest = await restaurants.findOne({
        where: {
          r_email: req.body.email,
        },
      });

      if (checkRest) {
        return res
          .status(403)
          .send('Restaurant already exist with given email');
      }
    }
    const t = await sequelize.transaction();

    try {
      const updatedRestaurant = await restaurants.update(
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
        const dishType = await restaurant_dishtypes.bulkCreate(dishTypes, {
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
});

router.delete('/:rid', async (req, res) => {
  try {
    const findEntry = await restaurants.findOne({
      where: {
        r_id: req.params.rid,
      },
    });
    if (!findEntry) {
      res.status(404).send('Restaurant Does not Exist to delete');
    } else {
      const deleteEntry = await restaurants.destroy({
        where: {
          r_id: req.params.rid,
        },
      });
      res.status(201).send({});
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

router.get('/:rid', async (req, res) => {
  const restId = req.params.rid;
  if (!restId) return res.status(404).send('Provide Restaurant ID');

  const rest = await restaurants.findOne({
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

  return res.status(200).send(rest);
});
module.exports = router;
