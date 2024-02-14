// var admin = require('firebase-admin');

// var serviceAccount = require('../config/key.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://airbnb2-18822-default-rtdb.firebaseio.com',
// });

// const db = admin.database();
// // const db = admin.firestore();
// const rootRef = db.ref('/Airbnb3');

// class FirebaseService {
//   createData(data) {
//     const newRef = rootRef.push();
//     return newRef.set(data).then(() => {
//       return newRef.key;
//     });
//   }

//   async readData(key) {
//     const ref = rootRef.child(key);
//     const snapshot = await ref.once('value');
//     if (snapshot.exists()) {
//       return snapshot.val();
//     } else {
//       throw new Error('Data not found');
//     }
//   }

//   updateData(key, newData) {
//     const ref = rootRef.child(key);
//     return ref.update(newData);
//   }

//   deleteData(key) {
//     const ref = rootRef.child(key);
//     return ref.remove();
//   }
// }

// module.exports = new FirebaseService();
