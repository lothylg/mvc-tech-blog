const router = require('express').Router();

const apiRoutes = require('./api');
const pageRoutes = require('./pageRoutes');
const loginRoutes = require('./loginRoutes');



router.use('/api', apiRoutes);
router.use('/', pageRoutes)
router.use('/login', loginRoutes)



module.exports = router;