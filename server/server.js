const WebSocketS = require('ws');


module.exports = function( _server ) {

    const wss = new WebSocketS.Server( {server: _server} );
    wss.on('listening', () => {
        console.log('open');
    });

    let i = 0;
    
    wss.on("connection" ,(ws) => {
    
        i += 1;
        console.log('connection');
        ws.send(`${i} 번째 호출`);
        ws.on("message", (message) => {
            i += 1;
            // ws.send("Server Response");
            ws.send(`${i} 번째 호출`);
        });
    
    });

}