const sqlite3 = require('sqlite3').verbose();
const { app } = require('electron'); 
const path    = require('path');  
const fs      = require('fs');   

require('dotenv').config();
const FROMWEB = process.env.FROMWEB || true;
 
const sPath = path.join(__dirname, 'app.db');
var dPath = sPath; 

 

if(FROMWEB==='false'){  

    dPath = path.join(app.getPath('userData'), 'app.db'); 

    if (!fs.existsSync(dPath)) {
        fs.copyFileSync(sPath, dPath);
        console.log("Database copied");
    }  
}

const db = new sqlite3.Database(dPath, (err) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
        } else {
            console.log('Connected to the SQLite database.'); 
        }
});   
 

/*
db.serialize(() => {
        // Initialize tables if they don't exist
        db.run(`CREATE TABLE IF NOT EXISTS tickergroup (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gid INTEGER DEFAULT 0,
            name TEXT,
            expanded INTEGER DEFAULT 1,       
            isdefault INTEGER DEFAULT 0,      
            lftrgt TEXT,
            status TEXT DEFAULT 'A',
            created_by INTEGER DEFAULT 0,
            updated_by INTEGER DEFAULT 0,
            created_at DATETIME,
            updated_at DATETIME,
            position INTEGER NOT NULL DEFAULT 0,
            fileid INTEGER NOT NULL DEFAULT 0,
            UNIQUE (fileid, gid, lftrgt) 
        )`, 
        (err)=> {
                if (err) {
                    console.error(err.message);
                } 
            }
        ); 
        
        db.run(`CREATE TABLE IF NOT EXISTS tickeritem (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            itemid INTEGER DEFAULT 0,
            gid INTEGER DEFAULT 0,
            tickertext TEXT,
            imgpath TEXT,
            tag TEXT,
            lftrgt TEXT,
            status TEXT DEFAULT 'A',
            created_by INTEGER DEFAULT 0,
            updated_by INTEGER DEFAULT 0,
            created_at DATETIME,
            updated_at DATETIME,
            position INTEGER NOT NULL DEFAULT 0,
            fileid INTEGER NOT NULL DEFAULT 0,
            UNIQUE (itemid)
        )`,
        (err)=> {
                if (err) {
                    console.error(err.message);
                } 
            } 
        );    

        db.run(`CREATE TABLE IF NOT EXISTS tickerfiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                status TEXT DEFAULT 'A',
                addedby INTEGER DEFAULT 0,
                created_at DATETIME,
                updated_at DATETIME,
                pooldata TEXT,
                carousaldata TEXT,
                created_by INTEGER DEFAULT 0,
                updated_by INTEGER DEFAULT 0
        )`,
         (err)=> {
            if (err) {
                console.error(err.message);
            }  
        }); 


        db.run(`CREATE TABLE IF NOT EXISTS roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL,
            status TEXT DEFAULT 'A',
            created_at DATETIME,
            updated_at DATETIME,
            permissions TEXT NOT NULL 
        )`,
            (err)=> {
                if (err) {
                    console.error(err.message);
                }  
        });

        // ✅ Insert Admin Only If Not Exists
        db.get(`SELECT id FROM roles WHERE role = ?`, ['Administrator'], function(err, row) {
            if (err) {
                console.error(err.message);
            } else if (!row) {

                db.run(
                    `INSERT INTO roles 
                    (role, status, permissions, created_at, updated_at)
                    VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
                    [
                        'Administrator',
                        'A',
                        '[1]' 
                    ],
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("Admin role with ID:", this.lastID);
                        }
                    }
                );

            } else {
                console.log("Admin Role already exists");
            }
        });

         // ✅ USERS TABLE
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT NOT NULL UNIQUE,
                password TEXT,
                pageaccess TEXT,
                status TEXT NOT NULL DEFAULT 'A',
                created_at DATETIME,
                updated_at DATETIME,
                role INTEGER NOT NULL DEFAULT 0,
                created_by INTEGER DEFAULT 0,
                updated_by INTEGER DEFAULT 0
            )`,
            (err)=> {
                if (err) {
                    console.error(err.message);
                }  
        });

         // ✅ Insert Admin Only If Not Exists
        db.get(`SELECT id FROM users WHERE email = ?`, ['admin'], function(err, row) {
            if (err) {
                console.error(err.message);
            } else if (!row) {

                db.run(
                    `INSERT INTO users 
                    (name, email, password, pageaccess, status, created_at, updated_at, role, created_by, updated_by)
                    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?, ?, ?)`,
                    [
                        'Admin',
                        'admin',
                        '$2a$10$yFDgLbzGw3OTgcs2jmAljO9jyRR49X3BFi60XydnwIUaJAOcKa3Ku',
                        '',
                        'A',
                        1,
                        1,
                        1
                    ],
                    function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log("Admin created with ID:", this.lastID);
                        }
                    }
                );

            } else {
                console.log("Admin already exists");
            }
        });
       
        
    
}); */

module.exports = db;
