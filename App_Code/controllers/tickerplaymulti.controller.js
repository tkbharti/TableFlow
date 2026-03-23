const { NotFoundError } = require("../helpers/utility");  
const TickerPlayModel  = require("../models/tickerplay.model");  
// --------------------------------------------
// RESPONSE COLLECTION
// --------------------------------------------
function sendJSON(res, success, message, responseCode=500, data = [], data2=[]) {
    if(success){
        console.log(message);
    }else{
        console.error(message);
    }
    return res.status(responseCode).json({ success, message, data, data2 });
}

const delay = (ms) => new Promise(res => setTimeout(res, ms));
 

// ----------------------------------------
// ACTIVE SCROLL LIST
// ----------------------------------------
exports.getActiveScrollList = async (req, res, next) => { 
	 try {		
		const  scrolllist = await TickerPlayModel.getActiveScrollList();  

		for (const fileitem of scrolllist) { 
			delete fileitem.carousaldata;
			fileitem.carousaldata = {right:{id:"right",name:"Right Queue",groups:[]}};
			let id = fileitem.id;  
			const glist = await TickerPlayModel.getTickerGroup({fileid:id,lftrgt:'right'});  
						
			for (const gitem of glist) { 
				let gid = gitem.gid;
				const ellist = await TickerPlayModel.getTickerItem({fileid:id, gid:gid});  
				let litems = [];
				for (const itm of ellist) {  
					const item = {
						id:`${itm.itemid}`,
						text:itm.tickertext,
						imgpath:JSON.parse(itm.imgpath),
						tag:itm.tag,
						created_by: itm.createdby_username,
						updated_by: itm.updatedby_username,
						created_at:itm.created_at,
						updated_at:itm.updated_at
					}
					litems.push(item);
				}  
				var str = 'DEFAULT_RIGHT';
				if(gid != 2000000000){
					str = gitem.gid;
				} 
				 
				const gdata= { id: str, name:gitem.name, expanded: gitem.expanded, isDefault: gitem.isdefault, items: litems};
				 
			 	fileitem.carousaldata.right.groups.push(gdata); 
			} 
		}
 
		for (const fileitem of scrolllist) { 
			delete fileitem.pooldata;
			fileitem.pooldata = {left:{id:"left",name:"Left Queue",groups:[]}};
			let id = fileitem.id;  
			const glist = await TickerPlayModel.getTickerGroup({fileid:id,lftrgt:'left'});  
						
			for (const gitem of glist) { 
				let gid = gitem.gid;
				const ellist = await TickerPlayModel.getTickerItem({fileid:id, gid:gid});  
				let litems = [];
				for (const itm of ellist) {  
					const item = {
						id:`${itm.itemid}`,
						text:itm.tickertext,
						imgpath:JSON.parse(itm.imgpath),
						tag:itm.tag,
						created_by: itm.createdby_username,
						updated_by: itm.updatedby_username,
						created_at:itm.created_at,
						updated_at:itm.updated_at
					}
					litems.push(item);
				}  
				var str = 'DEFAULT_LEFT';
				if(gid != 1000000000){
					str = gitem.gid;
				} 
				 
				const gdata= { id: str, name:gitem.name, expanded: gitem.expanded, isDefault: gitem.isdefault, items: litems};
				 
			 	fileitem.pooldata.left.groups.push(gdata); 
			} 
		}


		return sendJSON(res, true, "✅ Get all scroll files",200, scrolllist);    

	}catch (err) { 
		return next(err);
    } 
}

// ----------------------------------------
// ACTIVE SCROLL LIST
// ----------------------------------------
exports.getScrollData = async (req, res, next) => {
	try {
		let id = req.params;	  
		const  scrolllist = await TickerPlayModel.getScrollData(id);   

		for (const fileitem of scrolllist) { 
			delete fileitem.carousaldata;
			fileitem.carousaldata = {right:{id:"right",name:"Right Queue",groups:[]}};
			let id = fileitem.id;  
			const glist = await TickerPlayModel.getTickerGroup({fileid:id,lftrgt:'right'});  
						
			for (const gitem of glist) { 
				let gid = gitem.gid;
				const ellist = await TickerPlayModel.getTickerItem({fileid:id, gid:gid});  
				let litems = [];
				for (const itm of ellist) {  
					const item = {
						id:`${itm.itemid}`,
						text:itm.tickertext,
						imgpath:JSON.parse(itm.imgpath),
						tag:itm.tag, 
						created_by: itm.createdby_username,
						updated_by: itm.updatedby_username,
						created_at:itm.created_at,
						updated_at:itm.updated_at
					}
					litems.push(item);
				}  
				var str = 'DEFAULT_RIGHT';
				if(gid != 2000000000){
					str = gitem.gid;
				} 
				 
				const gdata= { id: str, name:gitem.name, expanded: gitem.expanded, isDefault: gitem.isdefault, items: litems};
				 
			 	fileitem.carousaldata.right.groups.push(gdata); 
			} 
		}
 
		for (const fileitem of scrolllist) { 
			delete fileitem.pooldata;
			fileitem.pooldata = {left:{id:"left",name:"Left Queue",groups:[]}};
			let id = fileitem.id;  
			const glist = await TickerPlayModel.getTickerGroup({fileid:id,lftrgt:'left'});  
						
			for (const gitem of glist) { 
				let gid = gitem.gid;
				const ellist = await TickerPlayModel.getTickerItem({fileid:id, gid:gid});  
				let litems = [];
				for (const itm of ellist) {  
					const item = {
						id:`${itm.itemid}`,
						text:itm.tickertext,
						imgpath:JSON.parse(itm.imgpath),
						tag:itm.tag,
						created_by: itm.createdby_username,
						updated_by: itm.updatedby_username,
						created_at:itm.created_at,
						updated_at:itm.updated_at
					}
					litems.push(item);
				}  
				var str = 'DEFAULT_LEFT';
				if(gid != 1000000000){
					str = gitem.gid;
				} 
				 
				const gdata= { id: str, name:gitem.name, expanded: gitem.expanded, isDefault: gitem.isdefault, items: litems};
				 
			 	fileitem.pooldata.left.groups.push(gdata); 
			} 
		}
  

	 	return sendJSON(res, true, "✅ Get scroll file data",200, scrolllist, []);   	
		 
	}catch (err) { 
		return next(err);
    } 
} 

// ----------------------------------------
// TICKER DATA UPDATED
// ----------------------------------------
exports.updatePoolCaroData = async (req, res, next) => {
	try {
			const formdata = req.body;   
			 
		 	let groupdata_caro = [];
			let itemdata_caro  = [];
			let pos_caro = 0;
		 	formdata.caro.right.groups.map((gitem,index)=>{ 
				let id = gitem.id;
				if(id==='DEFAULT_RIGHT'){
					id = 2000000000;
				}

				let tempgroup = {
					fileid:req.body.id,
					gid: id,
					name:gitem.name,
					expanded:gitem.expanded,
					isdefault:gitem.isDefault,
					lftrgt:'right',
					position: index+1,
					status:'A',
					created_by:req.user.id,
					updated_by:req.user.id
				};  
				 
				groupdata_caro.push(tempgroup); 

				gitem.items.map((item,i)=>{  
					pos_caro = pos_caro+1;
					let tempitem = {
						itemid: item.id,
						gid: id,
						tickertext: item.text,
						imgpath: item.imgpath,
						tag: item.tag,
						lftrgt: 'right',
						position: pos_caro,
						fileid: req.body.id,
						status: 'A',
						created_by:req.user.id,
						updated_by:req.user.id  
					}  
					itemdata_caro.push(tempitem); 
				});

			}); 

			for (const gitem of groupdata_caro) {
				await TickerPlayModel.saveTickerGroupData(gitem); 
			}
			 
			for (const tikitem of itemdata_caro) {
				await TickerPlayModel.saveTickerItemData(tikitem); 
			}
			  
			let groupdata_pool = [];
			let itemdata_pool  = [];
			let pos_pool = 0;
		 	formdata.pool.left.groups.map((gitem,index)=>{ 
				let id = gitem.id;
				if(id==='DEFAULT_LEFT'){
					id = 1000000000;
				}
				let tempgroup = {
					fileid:req.body.id,
					gid: id,
					name:gitem.name,
					expanded:gitem.expanded,
					isdefault:gitem.isDefault,
					lftrgt:'left',
					position: index+1,
					status:'A',
					created_by:req.user.id,
					updated_by:req.user.id
				};  
				groupdata_pool.push(tempgroup); 

				gitem.items.map((item,i)=>{  
					pos_pool = pos_pool+1;
					let tempitem = {
						itemid: item.id,
						gid: id,
						tickertext: item.text,
						imgpath: item.imgpath,
						tag: item.tag,
						lftrgt: 'left',
						position: pos_pool,
						fileid: req.body.id,
						status: 'A',
						created_by:req.user.id,
						updated_by:req.user.id  
					}  
					itemdata_pool.push(tempitem); 
				});

			}); 

			for (const gitem of groupdata_pool) {
				await TickerPlayModel.saveTickerGroupData(gitem); 
			}
			 
			for (const tikitem of itemdata_pool) {
				await TickerPlayModel.saveTickerItemData(tikitem); 
			} 
			  
			return sendJSON(res, true, "✅ Ticker data updated",200);   		
		 
	}catch (err) { 
		return next(err);
    } 
}

 

 
// ----------------------------------------
// DELETE TICKER GROUP
// ----------------------------------------
exports.deleteTickerGroup = async (req, res, next) => { 
	try {	
		const formdata = req.body; 
		formdata.updated_by =  req.user.id;  
		await TickerPlayModel.deleteTickerGroup(formdata);  	
		return sendJSON(res, true, "✅ Ticker group deleted",200); 
	}catch (err) { 
		return next(err);
    }
}

// ----------------------------------------
// DELETE TICKER ITEM
// ----------------------------------------
exports.deleteTickerItemData = async (req, res, next) => {
	try {	
		const formdata = req.body; 
		formdata.updated_by =  req.user.id;  
		await TickerPlayModel.deleteTickerItemData(formdata);  	
		return sendJSON(res, true, "✅ Ticker item deleted",200); 
	}catch (err) { 
		return next(err);
    }  
}

// ----------------------------------------
// DELETE TICKER ITEM
// ----------------------------------------
exports.updateTickerData = async (req, res, next) => {
	try {	
		const formdata = req.body;  
		formdata.updated_by = req.user.id;

		await TickerPlayModel.updateTickerData(formdata);  	
		return sendJSON(res, true, "✅ Ticker selected data updated",200);   	
		 
	}catch (err) { 
		return next(err);
    }  
}
