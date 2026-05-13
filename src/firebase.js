import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBVv5GuLc8lAcmhQbvcZn47JvlpPnJt-Y",
  authDomain: "chat-app-40a97.firebaseapp.com",
  projectId: "chat-app-40a97",
  storageBucket: "chat-app-40a97.firebasestorage.app",
  messagingSenderId: "990800600978",
  appId: "1:990800600978:web:58cdae6d920e5abf08ab4b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);