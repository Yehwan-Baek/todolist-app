const bcrypt = require('bcrypt');
const { User, DateTask } = require('../models');
const session = require('express-session');

class UserService {

  // create user(register)
  async createUser(username, password) {
    try {
      const existingUser = await User.findOne({ where: { username } });
    
      if (existingUser) {
        throw new Error('Username is already taken');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // check the password validation
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username: username,
        password: hashedPassword,
      });

      return user;

    } catch (error) {
      if (error.message === 'Username is already taken' || error.message === 'Password must be at least 8 characters long') {
        // Username already exists
        throw new Error(error.message);
      } else if (error.errors && error.errors[0].validatorKey === 'isAlphanumeric') {
        // Username should only contain letters and numbers
        throw new Error('Username should only contain letters and numbers');
      } else if (error.errors && error.errors[0].validatorKey === 'notNull' && error.errors[0].path === 'User.username') {
        // Username cannot be null
        throw new Error('Username cannot be null');
      } else if (error.errors && error.errors[0].validatorKey === 'notEmpty' && error.errors[0].path === 'User.username') {
        // Username cannot be empty
        throw new Error('Username cannot be empty');
      } else if (error.errors && error.errors[0].validatorKey === 'notNull' && error.errors[0].path === 'User.password') {
        // Password cannot be null
        throw new Error('Password cannot be null');
      } else if (error.errors && error.errors[0].validatorKey === 'notEmpty' && error.errors[0].path === 'User.password') {
        // Password cannot be empty
        throw new Error('Password cannot be empty');
      } else if (error.errors && error.errors[0].validatorKey === 'len' && error.errors[0].path === 'User.password') {
        // Password must be at least 8 characters long
        throw new Error('Password must be at least 8 characters long');
      }

      throw new Error('Failed to create user');
    }
  }
  
  // User login
  async authenticateUser(req, res, username, password) {
    try {
      console.log('Received login request with username:', username);
      const user = await User.findOne({ where: { username } });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      // console.log('entered username:', username);
      // console.log('Entered Password:', password);
      // console.log('Stored Password Hash:', user.password);
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      console.log('Is Password Valid?', isPasswordValid);
  
      if (!isPasswordValid) {
        console.error('Password mismatch');
        throw new Error('Invalid username or password');
      }
  
      // Save user data in the session
      req.session.user = {
        id: user.id,
        username: user.username,
      };
  
      return user;
    } catch (error) {
      console.error('Error during authentication:', error.message);
      throw new Error('Authentication failed');
    }
  }

  // Current user logged in
  async profile  (req, res) {
    try {
      if (req.session.user) {
        const userId = req.session.user.id;
  
        // Fetch user data along with associated DateTasks
        const user = await User.findByPk(userId, {
          include: [{ model: DateTask }],
        });
  
        if (user) {
          res.status(200).json({ user });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      } else {
        res.status(401).json({ error: 'Not authenticated' });
      }
    } catch (error) {
      console.error('Error during profile request:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // User logout
  async logoutUser(req) {
    try {
      // Check if the user is logged in
      if (!req.session.user) {
        return res.status(401).json({ error: 'User not logged in' });
      }
  
      // Delete User data from session
      delete req.session.user;
      return true; // logout is successful
    } catch (error) {
      console.error('Error during logout:', error);
      return false; // logout failed
    }
  }
}

module.exports = UserService;
