const macaddress = require('macaddress');

async function getMacAddress() {
    return new Promise((resolve, reject) => {

        macaddress.one((err, mac) => {
            if (err) resolve(false);
    
            // console.log(mac)
            resolve(mac);
        });

    })
}

module.exports = getMacAddress;