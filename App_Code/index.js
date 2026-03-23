const express           = require('express');
const compression 	    = require('compression');
const helmet 		        = require('helmet');
const bodyParser  	    = require('body-parser'); 		 
const cors 			        = require('cors');
const http 			        = require('http');
const fs                = require('fs');
const path              = require('path');   
const userRoute                 = require('./routes/user.route');
const tickersingleplayRoute     = require('./routes/tickerplay.route');
const tickermultiplayRoute      = require('./routes/tickerplaymulti.route');

const db = require('./db/database'); // Connect to the database when the app starts

require('dotenv').config();

const FROMWEB = process.env.FROMWEB || true;

const PORT = process.env.PORT || 7000;
const Dragapp = express();
// Middleware to parse JSON bodies
Dragapp.use(express.json());
Dragapp.use(compression());
Dragapp.use(helmet());
Dragapp.use(cors());

Dragapp.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
Dragapp.use(bodyParser.json({ limit: '50mb' }));  

Dragapp.use(function (req, res, next) {  
    res.setHeader('Access-Control-Allow-Origin', '*');    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');   
    res.setHeader('Access-Control-Allow-Headers', '*');   
    res.setHeader('Access-Control-Allow-Credentials', true);   
    next();
});

// Use the item routes
 
Dragapp.use('/api/user', userRoute);
Dragapp.use('/api/tickersingleplay', tickersingleplayRoute);
Dragapp.use('/api/tickermultiplay', tickermultiplayRoute);

Dragapp.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Best practice: close the database connection when the application exits
process.on('SIGINT', () => {
    db.close(() => {
        console.log('Database connection closed.');
        process.exit(0);
    });
});

 

if(FROMWEB==='false'){
 
  const { app, BrowserWindow, Menu } = require('electron');
  const isDev = require('electron-is-dev');
  
  let mainWindow;
  
  function createWindow() {
    splash = new BrowserWindow({
      width: 400,
      height: 400,
      frame: false,
      alwaysOnTop: true,
      transparent: false,
      resizable: false,
      });

      splash.loadFile(path.join(__dirname, "public", "splash.html"));
  
      mainWindow = new BrowserWindow({
          width:1024,
          height:800,
          show: false, 
      icon: path.join(__dirname, "assets", "icon.ico")
      });
    
      const indexPath = path.join(__dirname, "build", "index.html");  
      
      mainWindow.loadFile(indexPath); 
      
      const SPLASH_DELAY = 3000;

      mainWindow.once("ready-to-show", () => {
      setTimeout(() => {
        if (splash) splash.destroy();
        mainWindow.maximize();
        //mainWindow.webContents.openDevTools();
        mainWindow.show();
      }, SPLASH_DELAY);
      });
    
    
    const menu = Menu.buildFromTemplate([])
    Menu.setApplicationMenu(menu); 

    mainWindow.on('closed', () => {
        mainWindow = null;
    }); 
    
  }

  app.on('ready', createWindow);  
  
  app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  });  
}