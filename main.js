const electron = require( 'electron' )

const app = electron.app
const Menu = electron.Menu
const dialog = electron.dialog
const BrowserWindow = electron.BrowserWindow
// const Tray = electron.Tray

const path = require('path')
const url = require('url')
const fs = require( 'fs' )
const configFilePath = 'showboat.config'

if ( fs.existsSync( path.resolve( app.getAppPath(), configFilePath ) ) ) {
  try {
    var configString = fs.readFileSync( path.resolve( app.getAppPath(), configFilePath ), 'utf8' )
  } catch ( err ) {
    console.log( err )
  }
  global.config = JSON.parse( configString )
} else {
  global.config = {
    musicPath: '',
    shuffle: 'false',
    cubeLayout: 0,
    cubeColors: 0,
    x: 800,
    y: 600,
    fullscreen: 'false'
  }
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
// let appIcon = null

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow( {
     width: global.config.x,
     height: global.config.y,
     icon: path.join( __dirname, 'assets/icons/png/icon.png' )
   } )

  // mainWindow.maximize()
  if ( global.config.fullscreen == true ) { mainWindow.setFullScreen( true ) }

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join( __dirname, 'index.html' ),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on( 'closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    fs.writeFileSync(
      path.resolve( app.getAppPath(), configFilePath ),
      JSON.stringify( global.config ),
      'utf8'
    )

    mainWindow = null
  })

  // appIcon = new Tray( path.join(__dirname, 'assets/icons/png/icon.png') )

  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: 'View',
  //     submenu: [
  //       {
  //         role: 'reload'
  //       },
  //       {
  //         role: 'toggledevtools'
  //       }
  //     ]
  //   }
  // ])
  //
  // Menu.setApplicationMenu(menu)

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
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
