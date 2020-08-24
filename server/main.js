const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 6777;

const FBconfig = require('./config.json');
const firebase = require('firebase');
const FB = firebase.initializeApp(FBconfig)
const database = firebase.database();

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
            if (result == null) socket.emit("need_update", "Error result is null");
            else socket.emit('need_update', result);
        });

    });

    socket.on('add_note', Data => {
        database.ref(`/${Data.userid}/notes/${Data.Data.id}`).set(Data.Data);
    });

    socket.on('delete_note', Data => {
        database.ref(`/${Data.userid}/notes/${Data.Id}`).remove();
    });

});

server.listen(PORT, () => {
    console.log(`Socket IO server listening on ${PORT} port`);
});