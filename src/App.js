import './App.css';

import { useState, useEffect } from 'react';

import { db } from './firebase';

import {
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";

function App() {

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {

    if(message === ""){
      return;
    }

    await addDoc(collection(db, "messages"), {
      text: message
    });

    setMessage("");

  };

  useEffect(() => {

    const unsubscribe = onSnapshot(

      collection(db, "messages"),

      (snapshot) => {

        setMessages(

          snapshot.docs.map((doc) => doc.data())

        );

      }

    );

    return () => unsubscribe();

  }, []);

  return (

    <div className="container">

      <h1>💬 Chat App</h1>

      <div className="chat-box">

        {messages.map((msg, index) => (

          <div className="message" key={index}>

            {msg.text}

          </div>

        ))}

      </div>

      <div className="input-box">

        <input
          type="text"
          placeholder="Type message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>

  );

}

export default App;