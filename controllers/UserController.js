const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');

const userService = new UserService();

// router for user register
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userService.createUser(username, password);
    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// router for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userService.authenticateUser(req, res, username, password);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error login:', error);
    res.status(401).json({ error: error.message });
  }
});

// router for user profile
router.get('/profile', (req, res) => {
  userService.profile(req, res);
});

// router for user logout
router.post('/logout', async (req, res) => {
  try {
    const result = await userService.logoutUser(req);
    if (result) {
      res.status(200).json({ message: 'Logout successful' });
    } else {
      res.status(401).json({ error: 'User not logged in' });
    }
  } catch (error) {
    console.error('Error logout:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;