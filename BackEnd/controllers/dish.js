/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const { dishes, dish_imgs, sequelize } = require('../models/data.model');

const createDish = async (req, res) => {
  try {
    const { name, ingredients, price, desc, category, type, imgs } = req.body;
    const restID = req.headers.id;

    if (!(name && price && category && type)) {
      return res.status(403).send('Provide all Details');
    }

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
        res.status(201).send('Dish Added');
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
};

const updateDish = async (req, res) => {
  const { name, ingredients, price, desc, category, type, imgs } = req.body;
  const dishId = req.params.did;
  const restId = req.headers.id;

  if (!dishId) return res.status(403).send('Provide all Details');
  const existDish = await dishes.findOne({
    where: {
      d_id: dishId,
      r_id: restId,
    },
  });

  if (!existDish) return res.status(404).send('Dish Does not exist!!');

  if (name !== existDish.d_name) {
    const findDishName = await dishes.findOne({
      where: {
        d_name: name,
        r_id: restId,
      },
    });

    if (findDishName) return res.status(403).send('Dish with same name Exist');
  }

  try {
    existDish.update(
      {
        d_name: name,
        d_ingredients: ingredients,
        d_price: price,
        d_desc: desc,
        d_category: category,
        d_type: type,
      },
      {
        returning: true,
      },
    );
    res.status(201).send('Dish Updated!!');
  } catch (err) {
    return res.status(404).send(err);
  }

  if (imgs) {
    try {
      await dish_imgs.destroy({
        where: {
          d_id: dishId,
        },
      });
      const dishImages = imgs.map((ele) => ({
        d_id: dishId,
        di_img: ele,
        di_alt_text: 'Dish Image',
      }));
      await dish_imgs.bulkCreate(dishImages);
    } catch (err) {
      res.status(404).send('Unable to update Dish Images');
    }
  }
};

const deleteDish = async (req, res) => {
  const dishId = req.params.did;
  if (!dishId) return res.status(404).send('Dish Does not Exist');

  try {
    await dishes.destroy({
      where: {
        d_id: dishId,
      },
    });
    res.status(201).send('Dish Deleted');
  } catch (err) {
    return res.status(404).send(err);
  }
};

const getDishById = async (req, res) => {
  const dishId = req.params.did;
  const dish = await dishes.findOne({
    include: dish_imgs,
    where: { d_id: dishId },
  });

  if (!dish) return res.status(404).send('Dish not found');
  return res.status(201).send(dish);
};

const getAllDishes = async (req, res) => {
  const rid = req.headers.id;
  const dishDetails = await dishes.findAll({
    where: {
      r_id: rid,
    },
  });
  if (dishDetails.lenght === 0) {
    return res.status(404).send({ error: 'No Dishes Found' });
  }
  return res.status(201).send(dishDetails);
};

module.exports = {
  createDish,
  updateDish,
  deleteDish,
  getDishById,
  getAllDishes,
};
