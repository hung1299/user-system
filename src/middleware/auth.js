const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decode._id }).select('-password');

    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ msg: 'Please Authenticate' });
  }
};

module.exports = auth;
