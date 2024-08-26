const router = require('express').Router();
const { Post, Comment, User } = require('../models');
// const withAuth = require('../utils/auth');


//if a user goes directly to /login and they're already logged in, redirect them to their dashboard page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
});
module.exports = router;

//login a user from the login page
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.username } });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect username or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect username or password, please try again' });
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

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: { model: User, as: "user" },
            limit: 10
        })
        console.log(postData)
        res.render('homepage', { posts: postData })
    } catch (err) {
        console.log(err)
    }
});

router.get("/dashboard", async (req, res) => {
        try{
            const postData = Post.findAll({
                where: {user_id: req.params.user_id},
                include: {model: Comment, as: "comments", include: {model: User, as: "users"} }
            })
            res.render('dashboard', {posts: postData})
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
});

