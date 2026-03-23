const { NotFoundError } = require("../helpers/utility");  
const TickerPlayModel  = require("../models/tickerplay.model");  

// Reusable response helper
const sendResponse = (res, success, message, data = [], status = 200) => {
  return res.status(status).json({ success, message, data });
};

exports.getActiveScrollList = async (req, res, next) => {  
	const scrolllist = await TickerPlayModel.getActiveScrollList();  
	try {		
		return sendResponse(res, true, "Get all scroll files", scrolllist); 
	}catch (err) {
        if (err instanceof NotFoundError) {
			return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
}

exports.getScrollData = async (req, res, next) => {
	let id = req.params;	  
	const scrolllist = await TickerPlayModel.getScrollData(id);  
	 try {		
		 return sendResponse(res, true, "Get scroll files", scrolllist); 
	}catch (err) {
        if (err instanceof NotFoundError) {
           return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
} 

exports.updatePoolCaroData = async (req, res, next) => {
	const formdata = req.body;  
	const scrolllist = await TickerPlayModel.updatePoolCaroData(formdata);  
	 try {		
		return sendResponse(res, true, "Update data", scrolllist);   
	}catch (err) {
        if (err instanceof NotFoundError) {
            return sendResponse(res, false, "Error", [], 500); 
        }
		return next(err);
    } 
} 