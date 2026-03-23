const router         = require('express').Router();
const {loggedIn}     = require('../helpers/auth.middleware');
const logMiddleware  = require("../helpers/log.middleware");

const UserController = require('../controllers/user.controller');

router.post('/login', logMiddleware, UserController.login); 
router.get('/checktoken', loggedIn, logMiddleware, UserController.checkToken);
router.get('/getuserbyid/:id', loggedIn, logMiddleware, UserController.getUserById); 

module.exports = router;
 