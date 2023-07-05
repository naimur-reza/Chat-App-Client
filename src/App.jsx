import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:5000");
const App = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [room, setRoom] = useState("");
  console.log(messageList);
  const sendMessage = async () => {
    await socket.emit("send_message", {
      message: message,
      room: room,
      author: name,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    });
  };

  const joinRoom = () => {
    socket.emit("join_room", room);
    setShowMessage(true);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((previousMessages) => [...previousMessages, data]);
      console.log(data);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleForm = (e) => {
    e.preventDefault();
  };
  return (
    <div className="h-[100vh]  flex items-center justify-center bg-gradient-to-r from-black via-red-950 to-black">
      <form
        onSubmit={handleForm}
        className=" p-5 space-y-4 rounded-lg w-1/2 shadow-xl bg-white/5 backdrop-blur-md">
        {!showMessage && (
          <h1 className="text-xl font-semibold text-gray-200">
            Please fill these field to start the chat
          </h1>
        )}
        {!showMessage && (
          <>
            <input
              required
              type="text"
              className="bg-gray-300 px-2 py-3 rounded-md text-black placeholder-slate-800 outline-none w-full"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <br />
            <input
              required
              type="text"
              className="bg-gray-300 px-2 py-3 rounded-md text-black placeholder-slate-800 outline-none w-full"
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Enter room id"
            />
            <br />
            <button
              className="px-2 py-3 bg-red-500 rounded-lg text-sm w-full hover:bg-red-600 transition text-black font-semibold"
              onClick={joinRoom}>
              Join Room
            </button>
          </>
        )}
        <br />
        {showMessage && (
          <>
            <h1 className="absolute -top-4 rounded-t-lg right-0 px-5 py-2 text-gray-200 bg-rose-600 w-full">
              Live ChatBox
            </h1>
            <ul className="space-y-10">
              {messageList.map((info, index) => (
                <li key={index}>
                  {" "}
                  <div className="flex gap-1 items-center">
                    {" "}
                    <p className="bg-pink-500 w-10 h-10 flex items-center justify-center rounded-full text-white">
                      {info.author[0]}
                    </p>{" "}
                    <p className=" bg-white/20 text-white w-full px-3 py-1 rounded-full">
                      {info.message}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center">
              <input
                type="text"
                required
                className="bg-gray-300 w-full px-2 py-3 rounded-l-md text-black placeholder-slate-800 outline-none "
                onChange={(e) => setMessage(e.target.value)}
                placeholder="message..."
              />
              <br />
              <button
                className=" pb-2 w-44 text-white bg-red-500  text-4xl"
                onClick={sendMessage}>
                &#8594;
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default App;
