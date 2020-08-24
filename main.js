const { app, BrowserWindow, ipcMain } = require('electron');
// import io from 'socket.io-client';
const io = require('socket.io-client');
const socket = io('http://localhost:6777');
socket.on("connect", () => {
    console.log("socket connected");
});

let cookie = require('./cookie.js');
cookie = new cookie();
const macaddr = require('./macaddress');




let userinfo = {
    id: 'heavyrisem'
}

let win;
let lastData;

function createWindow () {

    win = new BrowserWindow({
        width: 1440,
        height: 680,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.webContents.openDevTools();

    win.loadFile('index.html');

    win.on('closed', () => {
        console.log('closed');
        win = null;
        socket.close();
    });
}

ipcMain.on('cookie_check', (event, Data) => {

    cookie.getCookie('userinfo').then(async (cookies) => {
        const macaddress = await macaddr();
        console.log('addr', macaddress);

        if (cookies.length == 0) {
            event.reply("cookie_check", undefined);
        } else {
            let cookieInfo = cookies[0];
            cookie.removeCookie();
            console.log(cookieInfo);
        }
    });

})


ipcMain.on('login', (event, userinfo) => {

    console.log('sending data');
    socket.emit('login', userinfo);

});

socket.on('test', (data) => {
    console.log(("From server : ", data));
});

// ==================================== Note Processing =====================================

ipcMain.on("get_note", (event) => {

    if (userinfo.id == undefined) return;
    console.log('losg')
    socket.emit("get_note", userinfo.id);
    socket.on("need_update", (Data) => {
        console.log('updated');
        if (Data == null) return console.log("loading error");

        lastData = [];
        let temp = Data;
        for (var i in temp)
            lastData.push(temp[i]);

        // console.log(lastData)
        lastData = (lastData != null) ? lastData.reverse() : lastData;
        event.reply('need_update', lastData);
    });

});

ipcMain.on('add_note', (event, Data) => {

    if (userinfo.id == undefined) return;
    const newData = {
        title: Data.title,
        description: Data.description,
        id: (lastData[0] != null) ? lastData[0].id+1 : 1
    };

    socket.emit("add_note", {userid: userinfo.id, Data: newData});
    
    // console.log(sampleData);
});

ipcMain.on('delete_note', (event, Id) => {

    if (userinfo.id == undefined) return;
    socket.emit("delete_note", {userid: userinfo.id, Id: Id});

});



app.on('ready', createWindow);