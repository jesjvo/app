const { app, BrowserWindow, ipcMain, shell } = require('electron');

const fs = require("fs");
const os = require("os");
const path = require('path');

const sep = path.sep; const extension = '.json'
const folderName = "Jes's Editor" + sep;
const homeDir = os.homedir() + sep

const folder = homeDir + folderName
const filesFolder = folder + 'Files' + sep
const autoSaveFolder = folder + 'AutoSave' + sep

const autoSaveFile = autoSaveFolder + 'Content' + extension
const activeFile = autoSaveFolder + 'activeFile'

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
            else{}
    });
    }
    if(!fs.existsSync(activeFile))
    {
        fs.writeFile(activeFile, '', (err) =>{
            if(!err) {}
            else{}
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
        icon: __dirname + sep + 'main.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: false,
            }
        }
    );
    mainWindow.loadURL(
        //isDev
        'http://localhost:3000'
        //__dirname + sep + 'build' + sep + 'index.html'
        )
    checkFolders()
});

ipcMain.on('delete-file', (event, path)=>{
    fs.unlink(path, (err) => {
        if (err) {} else {}
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

//npm run app -->