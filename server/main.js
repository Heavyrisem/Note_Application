const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 6777;

const FBconfig = require('./config.json');
const firebase = require('firebase');
const FB = firebase.initializeApp(FBconfig)
const database = firebase.database();

const crypto = require('crypto');


io.on("connection", (socket) => {

    console.log('connection')
    socket.on('test', (data) => {
        console.log('Client message : ', data);
        socket.emit('test', "Server Response");
    });




    // ================================== Note Processer ===================================
    socket.on('get_note', ID => {

        database.ref(`/${ID}/notes`).on("value", (snapshot) => {
            console.log('updated');
            
            let result = snapshot.val();
            // if (result == null) socket.emit("need_update", "Error result is null");
            // else socket.emit('need_update', result);
            socket.emit('need_update', result);
        });

    });

    socket.on('add_note', Data => {
        database.ref(`/${Data.userid}/notes/${Data.Data.id}`).set(Data.Data);
    });

    socket.on('delete_note', Data => {
        database.ref(`/${Data.userid}/notes/${Data.Id}`).remove();
    });


    // ================================= Login =============================================
    socket.on("login", userinfo => {
        const hashedpw = (userinfo.id) ? crypto.createHash("sha512").update((userinfo.password) ? userinfo.password : '').digest('base64') : undefined;
        console.log(userinfo);
        database.ref(`/${userinfo.id}/logindata`).once("value", data => {
            if (data.val() == null) {
                console.log("No user");
                socket.emit("login", {status: "ID"});
            } else if (data.val().password == hashedpw || data.val().macaddr == userinfo.macaddr) {
                socket.emit("login", {status: "ALLOW", id: userinfo.id, macaddr: data.val().macaddr});
            } else {
                console.log("wrong password");
                socket.emit("login", {status: "PW"});
            }
        });

    });

    socket.on("register", userinfo => {

        const userdata = {
            password: undefined,
            macaddr: userinfo.macaddr
        };

        userdata.password = crypto.createHash("sha512").update(userinfo.password).digest('base64');
        
        database.ref(`/${userinfo.id}/logindata`).set(userdata);
        socket.emit("register",userdata.id);

    });
});

server.listen(PORT, () => {
    console.log(`Socket IO server listening on ${PORT} port`);
});