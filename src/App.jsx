import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:5000");
const App = () => {
  const [message, setMessage] = useState("");
  const [data, setData] = useState("");
  const [room, setRoom] = useState("");
  const sendMessage = () => {
    socket.emit("send_message", { message: message, room: room });
  };

  // sockets for joining room
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setData(data);
    });
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
      <ul>{data.message}</ul>
    </div>
  );
};

export default App;
