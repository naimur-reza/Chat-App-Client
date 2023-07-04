import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:5000");
const App = () => {
  const sendMessage = () => {
    socket.emit("send_message", { message: "He wrote Notir Pola" });
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
    });
  }, [socket]);
  return (
    <div>
      <input type="text" placeholder="message..." />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default App;
