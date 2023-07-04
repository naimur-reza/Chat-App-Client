import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:5000");
const App = () => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [room, setRoom] = useState("");

  const sendMessage = () => {
    socket.emit("send_message", { message: message, room: room });
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((previousMessages) => [...previousMessages, data.message]);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setRoom(e.target.value)}
        placeholder="enter room id"
      />
      <button onClick={joinRoom}>Join Room</button>
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        placeholder="message..."
      />
      <button onClick={sendMessage}>Send Message</button>
      <ul>
        {messageList.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
