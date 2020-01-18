const { Customer, validateCustomer } = require('../schema/customer');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {   //auth middleware removed
    const customer = await Customer.find();
    res.send(customer);
});

router.post('/', auth, async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) { res.status(404).send(error.details[0].message) };
    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    })
    customer = await customer.save();
    res.send(customer);
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) { res.status(404).send(error) };
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, { new: true });
    if (!customer) { res.status(404).status("the customer is an asshole") };
    res.send(customer);
})

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) { res.status(404).send("No customer found") };
    res.send(customer);
})

router.get('/:id', auth, async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
})


module.exports = router;