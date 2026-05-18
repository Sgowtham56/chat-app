import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBBVv5GuLc8lAcmhQbvcZn47JvlpPnJt-Y",
  authDomain: "chat-app-40a97.firebaseapp.com",
  projectId: "chat-app-40a97",
  storageBucket: "chat-app-40a97.firebasestorage.app",
  messagingSenderId: "990800600978",
  appId: "1:990800600978:web:58cdae6d920e5abf08ab4b",
  measurementId: "G-YJ8ES5B35W",
};

// Firebase initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // Realtime messages
  useEffect(() => {
    const q = query(
      collection(db,"messages"),
      orderBy("time","asc")
    );
    const unsubscribe = onSnapshot(q,(snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => doc.data())
        );
         bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  });

    return () => unsubscribe();
  }, []);

  // Send message
  const sendMessage = async () => {
    if (input.trim() === "") return;
    const sender = window.innerWidth < 700
    ? "mobile"
    : "laptop";

    await addDoc(collection(db, "messages"), {
      text: input,
      sender: "sender",
      time: Date.now()
    });

    setInput("");
  };

  return (
    <div className="app">
      <div className="chat-box">

        <h1 className="title">💬 Chat App</h1>

        <div className="messages">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "laptop"
                ? "my-msg"
                : "friend-msg"
              }>
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef}></div>

        </div>

        <div className="input-box">

          <input
            type="text"
            placeholder="Type message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>
    </div>
  );
}

export default App;