const router = require('express').Router();
const { User } = require('../../models');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ data: users });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err });
    }
});

// Create new user
router.post('/login', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            res.status(200).json(userData);
            res.render('homepage');
            console.log("User created");
            console.log(req.session);
        });
    } catch (err) {
        res.status(400).json({ message: 'Error creating user', error: err });
    }
});



// User log out
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.render('notloggedin')
            res.status(200).end(); 
        });
    } else {
        res.render('notloggedin')
        res.status(404).json({ message: 'No active session to destroy' });
    }
});

module.exports = router;
