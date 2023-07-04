import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:5000");
const App = () => {
  const [message, setMessage] = useState("");
  const [data, setData] = useState("");
  const sendMessage = () => {
    socket.emit("send_message", { message: message });
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setData(data.message);
    });
  }, [socket]);
  return (
    <div>
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        placeholder="message..."
      />
      <button onClick={sendMessage}>Send Message</button>
      <h1>{data}</h1>
    </div>
  );
};

export default App;
