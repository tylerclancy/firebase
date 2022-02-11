const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider(); // Google provider instance
signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

const db = firebase.firestore();

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');

let thingsRef; // Reference to a database location
let unsubscribe; // Turn off realtime stream

auth.onAuthStateChanged(user => {
  if (user) {
    // Signed in
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Greetings, ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;

    thingsRef = db.collection('things');

    createThing.onclick = () => {

      const { serverTimestamp } = firebase.firestore.FieldValue;

      thingsRef.add({
        uid: user.uid,
        name: 'test',
        createdAt: serverTimestamp()
      });
    }

    unsubscribe = thingsRef
      .where('uid', '==', user.uid)
      .orderBy('createdAt')
      .onSnapshot(querySnapshot => {
        const items = querySnapshot.docs.map(doc => {

          return `<li>${doc.data().name}</li>`

        });

        thingsList.innerHTML = items.join('');

      })

  } else {
    // Not signed in
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = '';

    unsubscribe && unsubscribe();

  }
});
