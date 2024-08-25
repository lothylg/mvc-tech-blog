const router = require('express').Router();
const { User } = require('../../models');

//get all users
router.get('/', async (req, res) => {
    try {
      const users = await User.findAll();
      res.json({ data: users });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching users', error: err });
    }
  });
//create new user
router.post('/', async (req, res) => {

    try {
      const userData = await User.create(req.body);
  
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
        res.status(200).json(userData);
        console.log("User created");
        console.log(req.session.body)
      });
    } catch (err) {
      res.status(400).json({ message: 'Error creating user', error: err });
    }
  });

//login a user from the login page
  router.post('/login', async (req, res) => {
    try {
      const userData = await User.findOne({ where: { email: req.body.email } });
  
      if (!userData) {
        res.status(400).json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      const validPassword = await userData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
        res.json({ user: userData, message: 'You are now logged in!' });
      });
  
    } catch (err) {
      res.status(500).json({ message: 'Error logging in', error: err });
    }
  });
  
//if a user goes directly to /login and they're already logged in, redirect them to their dashboard page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/dashboard');
      return;
    }
    res.render('login');
  });
module.exports = router;


//get user by id


//user log out
router.post('/users/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).json({status: "logged out"});
        // res.redirect('logout')
      });
    } else {
      res.status(404).json({ message: 'No active session to destroy' });
    }
  });
