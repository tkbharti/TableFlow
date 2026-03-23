 
const db = require('../db/database');

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

class UserModel {
	 
	static async getUserById(id) {
		const sqlQuery = `
			SELECT 
				u.*,
				r.role AS rolename, 
				r.permissions
			FROM users AS u
			LEFT JOIN roles AS r ON u.role = r.id 
			WHERE u.id = ?`; 
		try {
			const { rows } = await runQuery(sqlQuery, [id]);
			return rows[0] || null;
		} catch (error) {
			console.error("Error fetching user by ID:", error.message);
			throw new Error("Failed to fetch user");
		}
	} 

	static async getUserByEmail(email) {  
		 
		const sqlQuery = `
			SELECT 
            u.*,
            r.role AS rolename,
            r.permissions
			FROM users AS u
			LEFT JOIN roles AS r ON u.role = r.id
			WHERE u.email = ? AND u.status = 'A'`;   
		try { 
			const rows  = await runQuery(sqlQuery, [email]);  
			return rows[0] || null;
		} catch (error) {
			console.error("Error fetching user by email:", error.message);
			throw new Error("Failed to fetch user");
		}
	} 
}

module.exports = UserModel;
