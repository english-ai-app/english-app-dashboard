// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNoZSpvBphdYL6PwJ-lSLS6ImmVMYQ6vw",
  authDomain: "spotifyapp-efafb.firebaseapp.com",
  projectId: "spotifyapp-efafb",
  storageBucket: "spotifyapp-efafb.firebasestorage.app",
  messagingSenderId: "156556474154",
  appId: "1:156556474154:web:735273bc31e24dfa079053",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
