const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../schema/user');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(404).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) res.status(404).send("User not found");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) res.status(400).send("Invalid password or email");

    const token = user.generateAuthToken();

    res.send(token);
})

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(30).required().email(),
        password: Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;