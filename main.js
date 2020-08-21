const { app, BrowserWindow, ipcMain } = require('electron');
const firebase = require('firebase');
const FBinfo = require('./config.json');
let FBapp = firebase.initializeApp(FBinfo);
let database = firebase.database();

let UserInfo = {
    id: "heavyrisem"
}

let win;
let lastData;

function createWindow () {
    win = new BrowserWindow({
        width: 1440,
        height: 680,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.webContents.openDevTools();

    win.loadFile('index.html');

    win.on('closed', () => {
        console.log('closed');
        win = null;
    });
}

ipcMain.on('get_note', (event, Data) => {
    database.ref(`/${UserInfo.id}/notes`).on("value", (snapshot) => {
        console.log('updated');

        lastData = [];
        let temp = snapshot.val();
        for (var i in temp)
            lastData.push(temp[i]);

        console.log(lastData)
        lastData = (lastData != null) ? lastData.reverse() : lastData;
        event.reply('need_update', lastData);
    })
})

ipcMain.on('add_note', (event, Data) => {
    const newData = {
        title: Data.title,
        description: Data.description,
        id: (lastData[0] != null) ? lastData[0].id+1 : 1
    };

    database.ref(`/${UserInfo.id}/notes/${newData.id}`).set(newData);

    // console.log(sampleData);
});

ipcMain.on('delete_note', (event, Id) => {
    database.ref(`/${UserInfo.id}/notes/${Id}`).remove();
})



app.on('ready', createWindow);