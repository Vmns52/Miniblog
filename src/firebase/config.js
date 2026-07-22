// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtfWo7l2H3_DqWR6EBqYfVqiT3QTZEVIg",
  authDomain: "miniblog-241fc.firebaseapp.com",
  projectId: "miniblog-241fc",
  storageBucket: "miniblog-241fc.firebasestorage.app",
  messagingSenderId: "990510826493",
  appId: "1:990510826493:web:5661b7adfe489bdfa70f94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export {db, auth };

