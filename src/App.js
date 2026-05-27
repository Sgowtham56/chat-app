import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  deleteDoc,
  orderBy,
  doc
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
  const deletMessage = async (id) => {
    await deleteDoc(doc(db,"messages",id));
  };
  useEffect(() =>{
    bottomRef.current?.scrollIntoView({
      behavior:"smooth"
    });
  },[messages]);
  const [typing, setTyping] = useState(false);

  // Realtime messages
  useEffect(() => {
    const q = query(
      collection(db,"messages"),
      orderBy("time","asc")
    );
    const unsubscribe = onSnapshot(q,(snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({id: doc.id,...doc.data()}))
        );
         bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  });

    return () => unsubscribe();
  }, []);

  // Send message
  const handleTyping = async (value) => {
    setInput(value);
    await addDoc(collection(db, "typing"),
  {
    user: "typing..."
  });
  };
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    addDoc(collection(db,"messages"),{
      image: imageUrl,
      sender:
      navigator.userAgent.includes("mobile")
      ? "mobile"
      : "laptop",
      time: Date.now()
    
    });
  };
  const sendMessage = async () => {
    if (input.trim() === "") return;
    const sender = navigator.userAgent.includes("mobile")
    ? "mobile"
    : "laptop";

    await addDoc(collection(db, "messages"), {
      text: input,
      sender: "sender",
      time: Date.now()
    });

    setInput("");
    const audio = new audio("/send.mp3");
    audio.play();
  };

  return (
    <div className="app">
      <div className="chat-box">

        <h1 className="title">💬 Chat App</h1>
        <p className="online">Online</p>

        <div className="messages">
          <div className="date">Today</div>
          <img src="" alt="profile" className="profile"/>

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
          {typing && (
            <div className="typing">
              Typping...
              </div>
          )
          }

          {typing && (
            <div className="typing-animation">
              <span></span>
              <span></span>
              <span></span>
         </div> 
        )}
          
          <div ref={bottomRef}></div>

        </div>

        <div className="input-box">

         <input
  type="text"
  type="file"
  accept="image/*"
  placeholder="Type message..."
  value={input}
  onChange={handleImage}
  onChange={(e) => {

    handleTyping(e.target.value);

    setTyping(true);

    setTimeout(() => {
      setTyping(false);
    }, 1000);

  }}

  onKeyPress={(e) => {

    if(e.key === "Enter"){
      sendMessage();
    }

  }}
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