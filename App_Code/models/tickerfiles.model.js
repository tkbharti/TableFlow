const db = require('../db/database');

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

class TickerFilesModel { 
        
    // ----------------------------------------
    // ACTIVE SCROLL LIST
    // ----------------------------------------
    static async getActiveScrollList() { 
        const sqlQuery = `
            SELECT * FROM tickerfiles 
            WHERE status='A' ORDER BY id ASC`;   
		try { 
			const rows  = await runQuery(sqlQuery,[]);   
			return rows;
		} catch (error) {
			console.error("Error fetching tab:", error.message);
			throw new Error("Failed to fetch tab");
		} 
    }
     
}

module.exports = TickerFilesModel;
