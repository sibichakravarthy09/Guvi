const User = require('../models/User');

exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
};

exports.createUser = async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
};
