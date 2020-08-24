const { session } = require('electron');
const noteapp = "http://www.noteapp.com";

class Cookie {
    getCookie(path) {
        return new Promise((resolve, reject) => {

            session.defaultSession.cookies.get({url: noteapp+'/'+path}).then((cookies) => {
                resolve(cookies);
            }).catch(err => {
                resolve(err);
            })

        });
    }

    addCookie(key, value, path, expire) {
        return new Promise((resolve, reject) => {
            
            let today = new Date();
            if (expire != undefined) {
                today.setDate(today.getDate() + expire);
                today = today.getTime() / 1000;
                console.log(today);
            }
    
            const cookie = {
                url: noteapp+'/'+path,
                name: key,
                value: value,
                session: (expire == undefined),
                expirationDate: today
            };
    
            session.defaultSession.cookies.set(cookie).then(() => {
                resolve();
            }).catch(err => {resolve(err)});

        })
    }

    removeCookie() {
        session.defaultSession.cookies.remove(noteapp+'/userinfo', 'macaddr').then(value => {console.log(value)}).catch(err => {console.log('rmerr', err)});
    }
}

// function cookieTest() {
//     const samplecookie = {
//         url: "http://www.noteapp.com",
//         name: "ddd",
//         value: "value ddd"
//     }
//     const samplecookie1 = {
//         url: "http://www.noteapp.com",
//         name: "aaa",
//         value: "value aaa"
//     }
//     session.defaultSession.cookies.set(samplecookie);
//     session.defaultSession.cookies.set(samplecookie1);
    
//     session.defaultSession.cookies.get()
//     .then((cookies) => {
//         console.log(cookies)
//     });
// }

module.exports = Cookie;