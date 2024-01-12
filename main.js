const { app, BrowserWindow, ipcMain } = require('electron');

const fs = require("fs");
const os = require("os");
const path = require('path');

const sep = path.sep;
const folderName = "jes's editor"
const folder = os.homedir() + sep + folderName + sep
const filesFolder = folder + sep + 'Files' + sep
const autoSaveFolder = folder + 'AutoSave' + sep
const autoSaveFile = autoSaveFolder + 'Content.JSON'

function checkFolders(){
    if(!fs.existsSync(folder))
    {
        fs.mkdirSync(folder)
    }
    if(!fs.existsSync(filesFolder))
    {
        fs.mkdirSync(filesFolder)
    }
    if(!fs.existsSync(autoSaveFolder))
    {
        fs.mkdirSync(autoSaveFolder)
    }
}

let mainWindow;
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        frame:false,
        fullscreen:false,
        minWidth: 350, minHeight: 450,
        width:350,
        height:450,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: false,
            }
        }
    );
    mainWindow.loadURL('http://localhost:3000')

    checkFolders()
});

ipcMain.on('check-folders', (event, value)=>{
    checkFolders()
})

ipcMain.on("close-window", (event, value)=>{
    app.quit();
});

ipcMain.on("update-content", (event, contents)=>{
    fs.writeFile(autoSaveFile, JSON.stringify(contents), (err) =>{
        if(!err) {console.log("File Written"); }
        else{
            console.log(err);
        }
    });
});

ipcMain.on('error', (event, err)=>{
    console.log(err)
})


//2 terminals (npm run electron . - electron terminal) and the other (npm run build - react terminal)

//if want to see instantaneous updates, use browser react (npm start in react terminal)
