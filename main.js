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
    id: undefined
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

// ======================================== Cookie ======================================

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

});

ipcMain.on('cookie_add', (event, Data) => {

    cookie.addCookie('userinfo', {id: Data.id, macaddr: Data.macaddr}, )

})


// ====================================== Login ======================================

ipcMain.on('login', async (event, data) => {

    data.macaddr = await macaddr();
    socket.emit('login', data);

    socket.once('login', Data => {
        switch (Data.status) {
            case "ID":
                event.reply("login_deny_id"); console.log("No User"); break;
            case "PW":
                event.reply("login_deny_pw"); console.log("Wrong Password"); break;
            default: {
                event.reply("login_allow", undefined);
                userinfo.id=data.id;
                ipcMain.emit("get_note", undefined);
                console.log("Login Succeed");
                break;
            }
        };
    });

});

ipcMain.on('register', async (event, userinfo) => {

    userinfo.macaddr = await macaddr();
    socket.emit("register", userinfo);

    socket.on("register", result => {
        event.reply("register", userinfo);
    });

});

socket.on('test', (data) => {
    console.log(("From server : ", data));
});

// ==================================== Note Processing =====================================

ipcMain.on("get_note", (ev, data) => {
    
    if (userinfo.id == undefined) return;
    let event = ev;
    console.log('losg')
    socket.emit("get_note", userinfo.id);
    socket.on("need_update", (Data) => {
        console.log('updated');
        // if (Data == null) return console.log("loading error");

        lastData = [];
        let temp = Data;
        for (var i in temp)
            lastData.push(temp[i]);
        
        lastData = (lastData != null) ? lastData.reverse() : lastData;
        win.webContents.send('need_update', lastData);
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