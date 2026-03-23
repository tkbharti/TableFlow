const router         = require('express').Router();
const {loggedIn}     = require('../helpers/auth.middleware');
const logMiddleware  = require("../helpers/log.middleware"); 

const TickerplayController = require('../controllers/tickerplay.controller'); 
router.get('/getactivescrolllist', loggedIn, logMiddleware, TickerplayController.getActiveScrollList);  
router.get('/getscrolldata/:id', loggedIn, logMiddleware, TickerplayController.getScrollData); 
router.post('/updatepoolcarodata', loggedIn, logMiddleware, TickerplayController.updatePoolCaroData); 


module.exports = router;