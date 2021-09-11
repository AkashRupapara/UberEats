///Authentication

const express = require('express')
const { customers, restaurants } = require('../models/data.model')
const router = express.Router()
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


/// Customer Registration API
router.post('/register', async (req, res) => {
    try {
        // Get user input
        const { email, password, name } = req.body;

        // Validate user input
        if (!(name && email && password)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await customers.findOne({
            where: {
                c_email: email
            }
        });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);


        // Create user in our database---------------
        const customer = await customers.create({
            c_name: name,
            c_email: email, // sanitize: convert email to lowercase
            c_password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { c_id: customer.c_id, email, role: "customer"},
            "UberEats",
            {
                expiresIn: "2h",
            }
        );
        //save customer token
        customer.token = token;
        res.status(201).json(token);
    } catch (err) {
        console.log(err);
    }
})


/// Customer Login API
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (!(email && password))
        res.status(400).send("All input is required");

    const cust = await customers.findOne({
        where: {
            c_email: email
        }
    })

    if (!cust) {
        res.status(409).send("User does not exist")
    } else {
        bcrypt.compare(password, cust.c_password, function (err, result) {
            if (err) {
                // handle error
                res.status(409).send("Error Verifying details!!!")
            }
            if (result) {
                // Send JWT
                const token = jwt.sign(
                    { c_id: cust.c_id, email, role: "customer"},
                    "UberEats",
                    {
                        expiresIn: "2h",
                    }
                );
                //save customer token
                cust.token = token;
                res.status(201).json(token);
            } else {
                // response is OutgoingMessage object that server response http request
                return res.json({ success: false, message: 'passwords do not match' });
            }
        });
    }
})

/// Restuarant Registration API
router.post('/reslogin', async (req, res) => {
    const { email, password } = req.body

    if (!(email && password))
        res.status(400).send("All input is required");

    console.log(email)
    console.log(req.body)
    const rest = await restaurants.findOne({
        where: {
            r_email: email
        }
    })

    console.log(rest)
    if (!rest) {
        res.status(409).send("Restaurant does not exist")
    } else {
        bcrypt.compare(password, rest.r_password, function (err, result) {
            if (err) {
                // handle error
                res.status(409).send("Error Verifying details!!!")
            }
            if (result) {
                // Send JWT
                // Create token
                const token = jwt.sign(
                    { r_id: rest.r_id, email, role: "restaurant"},
                    "UberEats",
                    {
                        expiresIn: "2h",
                    }
                );
                //save customer token
                rest.token = token;
                res.status(201).json(token);
            } else {
                // response is OutgoingMessage object that server response http request
                return res.json({ success: false, message: 'passwords do not match' });
            }
        });
    }
})


///Restaurant Login API
router.post('/resregister', async (req, res) => {
    try {
        // Get user input
        const { email, password, name } = req.body;

        // Validate user input
        if (!(name && email && password)) {
            res.status(400).send("All input is required");
        }

        // check if Restaurant already exist
        // Validate if user exist in our database
        const oldRes = await restaurants.findOne({
            where: {
                r_email: email
            }
        });

        if (oldRes) {
            res.status(409).send("Restaurant Already Exist. Please Login");
        } else {
            //Encrypt user password
            encryptedPassword = await bcrypt.hash(password, 10);

            // Create user in our database---------------
            const restaurant = await restaurants.create({
                r_name: name,
                r_email: email,
                r_password: encryptedPassword,
            });
            // return new customer
            const token = jwt.sign(
                { r_id: restaurant.r_id, email, role: "restaurant"},
                "UberEats",
                {
                    expiresIn: "2h",
                }
            );
            //save customer token
            restaurant.token = token;
            res.status(201).json(token);
        }
    } catch (err) {
        console.log(err);
    }
    // Our reg
})


module.exports = router