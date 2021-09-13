/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/// Authentication

const express = require('express');
const {
  restaurants,
  sequelize,
  restaurant_dishtypes,
} = require('../models/data.model');

const router = express.Router();

router.put('/:rid', async (req, res) => {
  try {
    const restId = req.params.rid;
    const rest = await restaurants.findOne({
      where: {
        r_id: restId,
      },
    });

    if (!rest) return res.status(404).send('Restaurant Not Found');
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

module.exports = router;
