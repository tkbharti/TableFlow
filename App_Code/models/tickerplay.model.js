const db = require('../db/database');

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

class TickerPlayModel { 
        
     static async getScrollData({ id }) {
        const sqlQuery = `
            SELECT id, filename as tab,pooldata,carousaldata FROM tickerfiles 
            WHERE id=? AND status='A'
            ORDER BY id ASC
        `;
       
        try { 
			const rows  = await runQuery(sqlQuery,[id]);   
			return rows;
		} catch (error) {
			console.error("Error fetching tab:", error.message);
			throw new Error("Failed to fetch tab");
		}  
    }
  
    static async getActiveScrollList() { 
        const sqlQuery = `
            SELECT id, filename as tab ,pooldata,carousaldata FROM tickerfiles 
            WHERE status='A' ORDER BY id ASC`;   
		try { 
			const rows  = await runQuery(sqlQuery,[]);   
			return rows;
		} catch (error) {
			console.error("Error fetching tab:", error.message);
			throw new Error("Failed to fetch tab");
		} 
    }
    
    static async updatePoolCaroData(req) {  
        const {id,pool,caro} = req ; 
        const sqlQuery = `
            UPDATE tickerfiles 
            SET pooldata=?, carousaldata=?
            WHERE id = ?
        `;

        try { 
			const rows  = await runQuery(sqlQuery,[JSON.stringify(pool),JSON.stringify(caro),id]);   
			return rows;
		} catch (error) {
			console.error("Error fetching data:", error.message);
			throw new Error("Failed to fetch data");
		}  
    } 


     // ----------------------------------------
    // INSERT/UPLOAD TICKER GROUP
    // ----------------------------------------
    static async saveTickerGroupData(item) {
        const {fileid, gid, name, expanded, isdefault, lftrgt, position, status, created_by, updated_by} = item;
        const q = `
                    INSERT INTO tickergroup (
                    fileid, gid, name, expanded, isdefault, lftrgt,
                    position, status, created_by, updated_by, created_at, updated_at
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))
                    ON CONFLICT (fileid,gid,lftrgt)
                    DO UPDATE SET
                        name = EXCLUDED.name,
                        expanded = EXCLUDED.expanded,
                        isdefault = EXCLUDED.isdefault, 
                        position = EXCLUDED.position,
                        status = EXCLUDED.status,
                        updated_by=EXCLUDED.updated_by,
                        updated_at = datetime('now')
                    `;

        const params = [fileid, gid, name, expanded, isdefault, lftrgt, position, status, created_by, updated_by];

        try {
            const result = await runQuery(q, params);
            return result || null;
        } catch (err) {
            console.error("❌ DB ERROR:", err);
            return null;
        } 
    }

    // ----------------------------------------
    // GET  GROUP LIST 
    // ----------------------------------------
    static async getTickerGroup({fileid,lftrgt}) { 
        const q = `
            SELECT * FROM tickergroup 
            WHERE fileid=? AND lftrgt=? AND status='A'
            ORDER BY position ASC
        `;
        return await runQuery(q, [fileid,lftrgt]); 
    }

    // ----------------------------------------
    // DELETE  GROUP 
    // ----------------------------------------
    static async deleteTickerGroup({gid, fileid, updated_by}) { 
        const q = `
            UPDATE tickergroup 
            SET status='D', updated_by=?, updated_at=datetime('now')
            WHERE gid=? AND fileid=?
        `; 
        return await runQuery(q, [updated_by, gid, fileid]);
    }

    // ----------------------------------------
    // INSERT/UPLOAD TICKER ITEM
    // ----------------------------------------
    static async saveTickerItemData(item) { 

        const {fileid, itemid, gid, tickertext, imgpath, tag, lftrgt, position, status, created_by, updated_by} = item;
        const q = `
                    INSERT INTO tickeritem (
                    fileid, itemid, gid, tickertext, imgpath, tag, lftrgt,
                    position, status, created_by, updated_by, created_at, updated_at
                    )
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))
                    ON CONFLICT (itemid)
                    DO UPDATE SET
                        gid        = EXCLUDED.gid,
                        tickertext = EXCLUDED.tickertext,
                        imgpath = EXCLUDED.imgpath,
                        position = EXCLUDED.position,
                        status = EXCLUDED.status,
                        updated_by=EXCLUDED.updated_by 
                    `;

        const params = [fileid, itemid, gid, tickertext, JSON.stringify(imgpath), tag, lftrgt, position, status, created_by, updated_by];

        try {
            const result = await runQuery(q, params);
            return result  || null;
        } catch (err) {
            console.error("❌ DB ERROR:", err);
            return null;
        } 
    }

    // ----------------------------------------
    // GET  ITEM LIST 
    // ----------------------------------------
    static async getTickerItem({fileid,gid}) { 
        const q = `
            SELECT *, (select name from users where users.id=tickeritem.created_by) as createdby_username,
            (select name from users where users.id=tickeritem.updated_by) as updatedby_username
            FROM tickeritem 
            WHERE fileid=? AND gid=? AND status='A'
            ORDER BY position ASC
        `;
        return await runQuery(q, [fileid,gid]); 
    }

    // ----------------------------------------
    // DELETE SINGLE TICKER ITEM
    // ----------------------------------------
    static async deleteTickerItemData({itemid,updated_by}) {  
        const q = `
            UPDATE tickeritem 
            SET status='D', updated_by=?, updated_at=datetime('now')
            WHERE itemid=ANY(?::bigint[])
        `; 
        return await runQuery(q, [updated_by, itemid.map(BigInt)]);
    }

    // ----------------------------------------
    // DELETE ALL TICKER ITEM IF GROUP DELETE
    // ----------------------------------------
    static async deleteTickerItemDataByGroup({gid, fileid,updated_by}) { 
        const q = `
            UPDATE tickeritem 
            SET status='D', updated_by=?, updated_at=datetime('now')
            WHERE itemid=? AND fileid=?
        `; 
        return await runQuery(q, [updated_by, gid, fileid]);
    }

    // ----------------------------------------
    // DELETE ALL TICKER ITEM IF GROUP DELETE
    // ----------------------------------------
    static async updateTickerData(item) { 
        const {itemid, tickertext,imgpath, updated_by} = item;
        const q = `
            UPDATE tickeritem 
            SET tickertext=?, imgpath=?, updated_by=?, updated_at=datetime('now')
            WHERE itemid=?
        `; 
        return await runQuery(q, [tickertext, imgpath, updated_by, itemid]);
    }


}

module.exports = TickerPlayModel;
