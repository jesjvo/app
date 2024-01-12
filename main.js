const { app, BrowserWindow, ipcMain, shell } = require('electron');

const fs = require("fs");
const os = require("os");
const path = require('path');

const sep = path.sep; const extension = '.json'
const folderName = "jes's editor" + sep; const homeDir = os.homedir() + sep
const folder = homeDir + folderName
const filesFolder = folder + 'Files' + sep
const autoSaveFolder = folder + 'AutoSave' + sep

const autoSaveFile = autoSaveFolder + 'Content' + extension
const activeFile = autoSaveFolder + 'activeFile'

const quickFileName = 'Files' + sep

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
    if(!fs.existsSync(autoSaveFile))
    {
        fs.writeFile(autoSaveFile, JSON.stringify(''), (err) =>{
            if(!err) {}
            else{console.log(err)}
    });
    }
    if(!fs.existsSync(activeFile))
    {
        fs.writeFile(activeFile, '', (err) =>{
            if(!err) {}
            else{console.log(err)}
    });
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

ipcMain.on('activate-file', (event, path)=>{
    console.log(path)
})

ipcMain.on('delete-file', (event, path)=>{
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File is deleted.');
        }
      });
})

ipcMain.on('check-folders', (event, value)=>{
    checkFolders()
})

ipcMain.on('open-folder', (event, value)=>{
    checkFolders()
    shell.openPath(filesFolder)
})

ipcMain.on("close-window", (event, value)=>{
    app.quit();
});

ipcMain.on('error', (event, err)=>{ //way of communicating
    console.log(err)
})

//npm run app -->