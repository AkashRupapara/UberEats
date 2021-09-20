/* eslint-disable consistent-return */
/* eslint-disable newline-per-chained-call */
const { body, validationResult, check } = require('express-validator');

const customerValidationRules = () => [
  body('email').optional({ nullable: true }).isEmail().withMessage('Enter Valid Email'),
  body('password').optional({ nullable: true }).isString().withMessage('Enter Valid Password'),
  body('name').optional({ nullable: true }).isString().withMessage('Enter Valid Email'),
  body('dob').optional({ nullable: true }).isDate().withMessage('Enter Valid Date'),
  body('city').optional({ nullable: true }).isString().withMessage('Enter Valid City Name'),
  body('state').optional({ nullable: true }).isString().withMessage('Enter Valid State'),
  body('country').optional({ nullable: true }).isString().withMessage('Enter Valid Country'),
  check('nname').optional({ nullable: true }).isString(),
  body('contact')
    .optional({ nullable: true })
    .isString()
    .custom((val) => {
      const regex = new RegExp('^([0-9]){10}$');
      const match = regex.test(val);
      if (match) {
        return Promise.resolve(val);
      }
      return Promise.reject(new Error('Enter Valid Phone Number'));
    })
    .withMessage('Enter Valid Contact Number'),
];

const restaurantValidationRules = () => [
  body('email').optional({ nullable: true }).isEmail().withMessage('Enter Valid Email'),
  body('password').optional({ nullable: true }).isString().withMessage('Enter Valid Password'),
  body('name').optional({ nullable: true }).isString().withMessage('Enter Valid Email'),
  body('address_line')
    .optional({ nullable: true })
    .isString()
    .withMessage('Enter Valid Address Line'),
  body('city').optional({ nullable: true }).isString().withMessage('Enter Valid City Name'),
  body('state').optional({ nullable: true }).isString().withMessage('Enter Valid State'),
  body('zipcode').optional({ nullable: true }).isNumeric().withMessage('Enter Valid Zipcode'),
  body('del_type').optional({ nullable: true }).isString().withMessage('Enter Valid Delivery Type'),
  body('contact')
    .optional({ nullable: true })
    .isString()
    .custom((val) => {
      const regex = new RegExp('^([0-9]){10}$');
      const match = regex.test(val);
      if (match) {
        return Promise.resolve(val);
      }
      return Promise.reject(new Error('Enter Valid Phone Number'));
    })
    .withMessage('Enter Valid Contact Number'),
];

const dishDetailsValidator = () => [
  body('name').optional({ nullable: true }).isString().withMessage('Enter Valid Dish Name'),
  body('ingredients')
    .optional({ nullable: true })
    .isString()
    .withMessage('Enter Valid Ingredient Details'),
  body('desc').optional({ nullable: true }).isFloat().withMessage('Enter Valid Price'),
  body('category').optional({ nullable: true }).isFloat().withMessage('Enter Valid Price'),
  body('type').optional({ nullable: true }).isFloat().withMessage('Enter Valid Price'),
];

const validator = async (req, res, next) => {
  const err = validationResult(req);
  const errors = [];
  err.array().forEach((ele) => {
    errors.push({ [ele.param]: ele.msg });
  });
  if (!err.isEmpty()) {
    return res.status(400).send(err);
  }
  next();
};

module.exports = {
  customerValidationRules,
  dishDetailsValidator,
  validator,
  restaurantValidationRules,
};
