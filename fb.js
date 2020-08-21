const firebase = require('firebase');
const FBinfo = require('./config.json');
let FBapp = firebase.initializeApp({
    apiKey: FBinfo.apiKey,
    authDomain: FBinfo.authDomain,
    databaseURL: FBinfo.databaseURL,
});
let database = firebase.database();
// let userId = firebase.auth().currentUser.uid;
database.ref('/heavyrisem').set({
    notes: [
        {
         title: "0",
         description: "0-description",
         id: 0
        },
        {
         title: "1",
         description: "1-description",
         id: 1
        },
        {
         title: "2",
         description: "2-description",
         id: 2
        },
        {
         title: "3",
         description: "3-description",
         id: 3
        },
        {
         title: "4",
         description: "4-description",
         id: 4
        },
        {
         title: "5",
         description: "5-description",
         id: 5
        }
    ]
});
database.ref('/heavyrisem/notes/6').set({
    title: "6",
    description: "6-description",
    id: 6
})
// console.log(database.ref('/heavyrisem').child('notes').push().key)
database.ref('/heavyrisem').once("value").then(function(snapshot) {
    console.log(snapshot.val());
});
