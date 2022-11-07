import "./App.css";
import io from "socket.io-client";
import axios from 'axios'
import { useState } from "react";
import Chat from "./Chat";

var ls = require('local-storage');
let onlineUsers = [];

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
    
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="join-chat-container">
          <h3>Sawalif</h3>
          <input
            type="text"
            placeholder="Your nickname.."
            onChange={(event) => {
              setUsername(event.target.value);
              onlineUsers.push(event.target.value);
              ls.set('onlineUsers', onlineUsers);

            }}
          />
          <select onChange={(e) => {
            setRoom(e.target.value)
          }}>
            <option value="unselected">Select a Channel</option>
            <option value="general">General</option>
            <option value="random">Random</option>
            <option value="programming">Programming</option>
            <option value="politics">Politics</option>
            <option value="business">Business</option>
          </select>
         
          <button onClick={joinRoom}>Join This Channel</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;