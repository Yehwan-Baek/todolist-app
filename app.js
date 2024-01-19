const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const userRouter = require('./controllers/UserController');
const taskRouter = require('./controllers/DateTaskController')
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session
app.use(session({
  secret: 'key1', // session key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//user router
app.use('/user', userRouter);
//tasks router
app.use('/tasks', taskRouter)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
