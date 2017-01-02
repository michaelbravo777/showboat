const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const nativeImage = electron.nativeImage
// const Menu = electron.Menu
// const Tray = electron.Tray

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
// let appIcon = null

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
     titleBarStyle: 'hidden',
     width: 1281,
     height: 800,
     show: false,
     icon: nativeImage.createFromPath(__dirname, 'assets/icons/png/icon.png')})

  mainWindow.maximize()
  // mainWindow.setFullScreen(true)

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // appIcon = new Tray('showboat.png')
  // const contextMenu = Menu.buildFromTemplate([
  //   {label: 'Item1', type: 'radio'},
  //   {label: 'Item2', type: 'radio'}
  // ])
  //
  // // Make a change to the context menu
  // contextMenu.items[1].checked = false
  //
  // // Call this again for Linux because we modified the context menu
  // appIcon.setContextMenu(contextMenu)

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
