import React, { useEffect, useState } from "react";
import axios from "axios";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
 var ls = require('local-storage');

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };


  const getOnlineUsers = async () => {
    const onlineUsers = await axios.get("http://localhost:3001/users");
    // get online users from local storage
    const onlineUsersFromLocalStorage = ls.get('onlineUsers');
    console.log(onlineUsersFromLocalStorage, 'ls')
    console.log(onlineUsers.data);
    console.log(username)
    };


    const leaveChannel = async () => {
        window.location.reload();
    }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-container"> 
    <div className="users-list"> Online Users 🟢 
    <button onClick={getOnlineUsers}> Show </button>
    <button onClick={leaveChannel} className="leave"> Leave Channel </button>

    
    </div>
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat 🟢</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                 
                  <div className="sent-message">
                    <p id="message-element">{messageContent.author}: {messageContent.message}</p>
                    <p id="time">{messageContent.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Message"
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
    </div>
  );
}

export default Chat;