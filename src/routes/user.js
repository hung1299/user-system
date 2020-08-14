const express = require('express');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');
const { update } = require('../models/User');

// Register User
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);

    await user.save();

    const token = await user.generateToken();

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);

    const token = await user.generateToken();

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user data
router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

// Update user data
router.patch('/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['age', 'name', 'email', 'password'];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) return res.status(400).send({ msg: 'Invalid Updates!' });

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete user
router.delete('/me', auth, async (req, res) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
