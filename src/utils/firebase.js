const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../config/key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://airbnb2-18822-default-rtdb.firebaseio.com',
});

// const db = admin.firestore();
// const db = admin.database();
// const db = admin.firestore();
// const rootRef = db.ref('/users');

async function createData(collectionName, data) {
  const collectionRef = db.collection(collectionName);
  const docRef = await collectionRef.add(data);
  return docRef.id;
}

async function readData(collectionName, id) {
  const docRef = db.collection(collectionName).doc(id);
  const doc = await docRef.get();
  if (doc.exists) {
    return doc.data();
  } else {
    throw new Error('Data not found');
  }
}

async function updateData(collectionName, id, newData) {
  const docRef = db.collection(collectionName).doc(id);
  await docRef.update(newData);
}

async function deleteData(collectionName, id) {
  const docRef = db.collection(collectionName).doc(id);
  await docRef.delete();
}

module.exports = {
  createData,
  readData,
  updateData,
  deleteData,
};

/* 
- create room chat: host vs user
                    host vs users
                    user

{
  "rules": {
    "Airbnb": {
      "$cconversationsId": {
        "messages": {
          ".read": "data.parent().child('members').child(auth.uid).exists()",
          ".write": "data.parent().child('members').child(auth.uid).val() === 'admin' || data.parent().child('members').child(auth.uid).val() === 'chatter'"
        },
        "members": {
          ".read": "data.child(auth.uid).val() === 'admin'",
          ".write": "data.child(auth.uid).val() === 'admin'"
        },
        "invites": {
          "$uid": {
            ".read": "$uid === auth.uid"
          }
        }
      }
    }
  }
}



*/
const firebase = require('firebase-admin');
// const db = admin.database();
// // const db = admin.firestore();
// const rootRef = db.ref('/Airbnb');
const rootRef = firebase.database().ref();

// Function to create a room, add users, and add messages to the room
function createRoomWithUsersAndMessages(roomId, roomData, hostId, userId, messageDataArray) {
  return new Promise((resolve, reject) => {
    const roomRef = rootRef.child('Airbnb2').child(roomId);
    roomRef
      .set(roomData)
      .then(() => {
        console.log(`Room with ID ${roomId} has been created.`);

        const usersPromises = [];

        // Set the host as admin
        const hostRef = roomRef.child('users').child(hostId);
        usersPromises.push(hostRef.set('admin'));

        // Set users as members
        // userIds.forEach((userId) => {
        //   const userRef = roomRef.child('users').child(userId);
        //   usersPromises.push(userRef.set('member'));
        // });

        // Set the user as member
        const userRef = roomRef.child('users').child(userId);
        usersPromises.push(userRef.set('member'));

        return Promise.all(usersPromises);
      })
      .then(() => {
        console.log(`Users have been added to the room.`);

        const messagesRef = roomRef.child('messages');

        const messagesPromises = messageDataArray.map((messageData) => {
          const newMessageRef = messagesRef.push(); // Generate a unique message ID
          return newMessageRef.set(messageData);
        });

        return Promise.all(messagesPromises);
      })
      .then(() => {
        console.log(`Messages have been added to the room.`);
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function sendMessage(roomId, senderId, content) {
  // const user = await getUsersInRoom(roomId);
  // console.log(user);
  // console.log(senderId);
  if (senderId === '001' || senderId === '002') {
    const messageData = {
      content,
      senderId,
      timestamp: new Date().toISOString(),
    };

    const messageRef = rootRef.child('Airbnb2').child(roomId).child('messages').push();
    await messageRef.set(messageData);
    console.log('Message has been sent successfully.');
  }
  throw new Error('User not allowed to create message');
}

// Function to listen for new messages in a chat room
function listenForNewMessages(roomId) {
  const messagesRef = rootRef.child('Airbnb2').child(roomId).child('messages');
  messagesRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    console.log(`New message received: ${message.content}`);
  });
}

// Function to retrieve messages in a chat room
function getMessages(roomId) {
  const messagesRef = rootRef.child('Airbnb2').child(roomId).child('messages');
  messagesRef
    .once('value')
    .then((snapshot) => {
      const messages = snapshot.val();
      console.log(`Messages in room ${roomId}:`, messages);
    })
    .catch((error) => {
      console.error('Error retrieving messages:', error);
    });
}

// Function to get all users in a chat room
function getUsersInRoom(roomId) {
  const usersRef = rootRef.child('Airbnb2').child(roomId).child('users');

  return usersRef
    .once('value')
    .then((snapshot) => {
      const users = snapshot.val();
      console.log('Users in room', roomId, ':', users);
      return users;
    })
    .catch((error) => {
      console.error('Error retrieving users:', error);
    });
}

// Function to mark a chat room as unavailable
function markChatRoomAsUnavailable(roomId) {
  const chatRoomRef = rootRef.child('Airbnb2').child(roomId);
  chatRoomRef.child('available').set(false);

  console.log(`Chat room with ID ${roomId} has been marked as unavailable.`);
}

// // Reservation success handler
function handleReservationSuccess(reservationData) {
  // Extract necessary data from the reservation
  const roomId = reservationData.roomId;
  const roomData = reservationData.roomData;
  const hostId = reservationData.hostId;
  const userId = reservationData.userId;

  // Create message data
  const messageDataArray = [
    {
      content: 'Hello, host!',
      senderId: userId, // Assuming the first user sends a message
      timestamp: new Date().toISOString(),
    },
    {
      content: 'Hello, user!',
      senderId: hostId,
      timestamp: new Date().toISOString(),
    },
  ];

  // Create room, add users, and add messages
  createRoomWithUsersAndMessages(roomId, roomData, hostId, userId, messageDataArray)
    .then(() => {
      console.log('Room, users, and messages creation completed successfully.');

      // Simulate sending a new message in the chat room
      // sendMessage(roomId, userId, 'Hi, how are you?');

      // Listen for new messages in the chat room
      // listenForNewMessages(roomId);

      // markChatRoomAsUnavailable(roomId);
    })
    .catch((error) => {
      console.error('Error occurred:', error);
    });
}

// Example reservation data
const reservationData = {
  roomId: '12345',
  roomData: {
    name: 'Room Name',
    description: 'Room Description',
  },
  hostId: '001',
  userId: '002',
};

// // Simulate reservation success

// handleReservationSuccess(reservationData);
// sendMessage((roomId = '12345'), '002', 'Hi, Can i help you?');
// listenForNewMessages((roomId = 'your-room-id'));
// getMessages('12345')
// getUsersInRoom(12345);


