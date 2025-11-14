// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBkB2sEYpXbh1QDNO2URlschLGVy04q0iA",
  authDomain: "sara-a3a18.firebaseapp.com",
  projectId: "sara-a3a18",
  storageBucket: "sara-a3a18.firebasestorage.app",
  messagingSenderId: "526006986520",
  appId: "1:526006986520:web:35c850c1744e46dcaca06d",
  measurementId: "G-8Y8TV8XYLT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, signInWithEmailAndPassword, signOut, onAuthStateChanged };
