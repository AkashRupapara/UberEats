/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
const express = require('express');
const jwtDecode = require('jwt-decode');

const { dishes, dish_imgs, sequelize } = require('../models/data.model');

const router = express.Router();

router.post('/newdish', async (req, res) => {
  try {
    const { name, ingredients, price, desc, category, type, imgs } = req.body;
    const headerToken = req.headers.authorization;
    const restID = jwtDecode(headerToken).r_id;

    const existingDish = await dishes.findOne({
      where: {
        r_id: restID,
        d_name: name,
      },
    });

    const t = await sequelize.transaction();
    try {
      if (!existingDish) {
        const dish = await dishes.create(
          {
            d_name: name,
            d_ingredients: ingredients,
            d_price: price,
            d_desc: desc,
            d_category: category,
            d_type: type,
            r_id: restID,
          },
          { transaction: t },
        );

        const dishImages = imgs.map((ele) => ({
          d_id: dish.d_id,
          di_img: ele,
          di_alt_text: 'Dish Image',
        }));
        await dish_imgs.bulkCreate(dishImages, {
          transaction: t,
        });
        t.commit();
        res.status(201).send({});
      } else {
        res.status(403).send('Dish Already Exist');
      }
    } catch (err) {
      t.rollback();
      res.status(404).send(err);
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
