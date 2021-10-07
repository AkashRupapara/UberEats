/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */

const {
  orders,
  carts,
  dishes,
  order_dishes,
  sequelize,
  dish_imgs,
} = require('../models/data.model');

const createOrder = async (req, res) => {
  const custId = req.headers.id;

  const cartDetails = await carts.findAll({
    attributes: ['d_id', 'r_id'],
    where: {
      c_id: custId,
    },
  });

  if (cartDetails.length === 0) {
    return res.status(404).send('No Items in Cart');
  }

  let dishIds = [];

  cartDetails.forEach((element) => {
    dishIds.push(element.d_id);
  });
  const dishPriceDetails = await dishes.findAll({
    attributes: ['d_id', 'd_price'],
    where: {
      d_id: dishIds,
    },
  });

  let sum = 0;
  dishIds.forEach((element) => {
    dishPriceDetails.forEach((ele) => {
      if (element === ele.d_id) {
        sum += ele.d_price;
      }
    });
  });

  const restId = cartDetails[0].r_id;

  const t = await sequelize.transaction();
  try {
    const initOrder = await orders.create(
      {
        o_status: 'Initialized',
        o_total_price: sum,
        c_id: custId,
        r_id: restId,
        o_tax: sum * 0.18,
        o_final_price: sum + sum * 0.18,
      },
      { transaction: t },
    );

    if (dishIds) {
      const listDishes = dishIds.map((ele) => ({
        o_id: initOrder.o_id,
        d_id: ele,
      }));

      await order_dishes.bulkCreate(listDishes, {
        transaction: t,
      });

      await carts.destroy(
        {
          where: {
            c_id: custId,
          },
        },
        { transaction: t },
      );
      t.commit();
      return res.status(201).send({orderId: initOrder.o_id, message: 'Order Initialised Successfully'});
    }
  } catch (err) {
    t.rollback();
    return res.status(400).send(err);
  }
};

const placeOrder = async (req, res) => {
  console.log("Here");
  const { type, address, id } = req.body;
  try {
    const updateOrder = await orders.update(
      {
        o_status: 'Placed',
        o_type: type,
        o_address: address,
        o_date_time: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        where: {
          o_id: id,
        },
      },
    );

    // Checking if Update was successfull or not
    if (updateOrder[0] !== 1) {
      return res.status(404).send('Order Not found');
    }
    return res.status(201).send('Order Placed');
  } catch (err) {
    return res.status(400).send(err);
  }
};

const updateOrder = async (req, res) => {
  const { status } = req.body;
  const { oid } = req.params;

  try {
    const updateStatus = await orders.update(
      {
        o_status: status,
      },
      {
        where: {
          o_id: oid,
        },
      },
    ); // Checking if Update was successfull or not
    if (updateStatus[0] !== 1) {
      return res.status(404).send('Order Not found');
    }
    return res.status(201).send({ msg: 'Order Status Updated' });
  } catch (err) {
    return res.status(404).send(err);
  }
};

const getOrders = async (req, res) => {
  const { role } = req.headers;

  let getorders;
  if (role === 'customer') {
    getorders = await orders.findAll({
      where: {
        c_id: req.headers.id,
      },
      order: [['createdAt', 'DESC']],
    });
  } else if (role === 'restaurant') {
    getorders = await orders.findAll({
      where: {
        r_id: req.headers.id,
      },
    });
  }
  res.status(201).send(getorders);
};

const getOrderById = async (req, res) => {
  const { role } = req.headers;
  const { oid } = req.params;
  const { id } = req.headers;
  if (role === 'restaurant') {
    const findRestOrder = await orders.findOne({
      includes: [{ order_dishes, includes: dishes }],
      where: {
        o_id: oid,
        r_id: id,
      },
    });

    if (findRestOrder) {
      return res.status(201).send(findRestOrder);
    }

    return res.status(404).send({error:"Restuarant Order Not Found"});
  }

  const findCustOrder = await orders.findOne({
    include: [{ model: order_dishes, include: [{ model: dishes, include: dish_imgs }] }],
    where: {
      o_id: oid,
      c_id: id,
    },
  });

  if (findCustOrder) {
    return res.status(201).send(findCustOrder);
  }

  return res.status(404).send('Customer Order Not Found');
};
module.exports = {
  createOrder,
  placeOrder,
  updateOrder,
  getOrders,
  getOrderById,
};
