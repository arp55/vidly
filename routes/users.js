const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { validate, User } = require('../schema/user');
const _ = require('lodash');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(404).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) res.status(404).send("User already exists!");

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
})

module.exports = router;