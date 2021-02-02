import firebase from "firebase/app";  
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyDDwJ91hvI_jIHGE9sQqcEQyUkCEAwcwYI",
    authDomain: "twitter-sth.firebaseapp.com",
    databaseURL: "https://twitter-sth-default-rtdb.firebaseio.com",
    projectId: "twitter-sth",
    storageBucket: "twitter-sth.appspot.com",
    messagingSenderId: "973555857022",
    appId: "1:973555857022:web:e548a456ae8aa65c650a2f",
    measurementId: "G-TKENWSXQGP"
  };

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
  };

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};
