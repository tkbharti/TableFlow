const router         = require('express').Router();
const {loggedIn}     = require('../helpers/auth.middleware');
const logMiddleware  = require("../helpers/log.middleware"); 

const TickerplayMultiController = require('../controllers/tickerplaymulti.controller');  
 
router.get('/getactivescrolllist', loggedIn, logMiddleware, TickerplayMultiController.getActiveScrollList);  
router.get('/getscrolldata/:id', loggedIn, logMiddleware, TickerplayMultiController.getScrollData); 
router.post('/updatepoolcarodata', loggedIn, logMiddleware, TickerplayMultiController.updatePoolCaroData); 

router.post('/deletetickergroup', loggedIn, logMiddleware, TickerplayMultiController.deleteTickerGroup); 
router.post('/deletetickeritemdata', loggedIn, logMiddleware, TickerplayMultiController.deleteTickerItemData); 
router.post('/updatetickerdata', loggedIn, logMiddleware, TickerplayMultiController.updateTickerData); 

module.exports = router;