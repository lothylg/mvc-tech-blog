const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { User } = require('../../models');


// Create new user
router.post('/', async (req, res) => {
  console.log("make new user")
  try {
      const userData = await User.create(req.body);
      console.log(userData)
      req.session.save(() => {
          req.session.user_id = userData.id;
          req.session.logged_in = true;
          res.status(200).json(userData);
          // res.render('homepage', {userData: userData, loggedIn: req.session.logged_in}); (you can't do a render from an api route)
          console.log("User created");
          console.log(req.session);
      });
  } catch (err) {
    console.log(err)
      res.status(400).json({ message: 'Error creating user', error: err });
  }
});


//get a list of all users (to hit within postman)
router.get('/', async (req,res) =>{
  try{
    const userData = await User.findAll();
    res.status(200).json(userData);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
})
//get all posts and comments that one specific user had made
router.get('/:id', async (req, res) => {
  try {
      const userPosts = await Post.findAll({
          where: { user_id: req.params.id },
          include: [
              { model: Post, as: "posts", include: {model: Comment, as: "comments", include: { model: User, as: "users"}}},
              { model: Comment, as: "comments", include: {model: User, as: "user"}  },
          ]
      });

      if (userPosts.length > 0) {
          res.json({ status: "success", payload: userPosts });
      } else {
          res.status(404).json({ status: "error", message: "No posts found for this user." });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "An error occurred while fetching posts." });
  }
});

//log in a user:
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user || !user.checkPassword(password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, 'New mask, same task', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Logout
router.post('/logout', (req, res) => {
    // When the user logs out, destroy the session
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });
module.exports = router;
