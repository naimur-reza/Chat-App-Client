import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

// const socket = io.connect("https://chatapp-server-naimur-reza.vercel.app");
const socket = io("http://localhost:5000", {
  withCredentials: true,
});
const App = () => {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [room, setRoom] = useState("");
  console.log(messageList);
  const sendMessage = async () => {
    if (message !== "") {
      await socket.emit("send_message", {
        message: message,
        room: room,
        author: name,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      });
    }
  };

  const joinRoom = async () => {
    if (name !== "" && room !== "") {
      await socket.emit("join_room", { room: room, author: name });
      setShowMessage(true);
      socket.on("joined_user", ({ joinedRoom, author }) => {
        console.log(joinedRoom, author);
        if (joinedRoom === room) {
          toast(`${author} connected, Welcome!`, {
            icon: "👏",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      });
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((previousMessages) => [...previousMessages, data]);
      console.log(data);
    });

    socket.on("user_connected", (data) => {
      setConnectedUsers(data.length);
    });

    return () => {
      socket.disconnect();
      socket.on("user_connected", (data) => {
        setConnectedUsers(data.length);
      });
    };
  }, [socket]);

  const handleForm = (e) => {
    e.preventDefault();
    const form = e.target;
    form.reset();
  };

  const chatBoxRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };
  console.log(connectedUsers);
  return (
    <div className="lg:h-[100vh] min-h-[90vh]   flex items-center justify-center  px-5">
      <form
        onSubmit={handleForm}
        className=" p-5 space-y-2 bg-gradient-to-r from-pink-600 via-red-800 to-violet-700 relative rounded-lg lg:w-1/2 w-full shadow-xl bg-white/5 backdrop-blur-md">
        {!showMessage && (
          <>
            <div className="space-y-6">
              <h1 className="text-xl font-semibold text-gray-200">
                Please fill these field to start the chat 💌
              </h1>
              <input
                required
                type="text"
                className="bg-black/60 w-full px-2 lg:py-3 py-2 rounded-l-md text-gray-100 placeholder-gray-200 outline-none"
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
              <br />
              <input
                required
                type="text"
                className="bg-black/60 w-full px-2 lg:py-3 py-2 rounded-l-md text-gray-100 placeholder-gray-200 outline-none"
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Enter room id"
              />
              <br />
              <button
                type="submit"
                className="px-2 py-3 bg-gradient-to-r from-black/40 via-rose-800 to-black/40 rounded-lg text-sm w-full  transition text-white font-semibold"
                onClick={joinRoom}>
                Join Room
              </button>
            </div>
          </>
        )}
        <br />
        {showMessage && (
          <>
            <div className="absolute bg-rose-500 -top-4 rounded-t-lg right-0 px-5 py-2 w-full flex justify-between">
              <h1 className=" text-gray-200 font-bold  w-full animate-pulse">
                Live ChatBox
              </h1>
              <p className="w-full text-end text-gray-200 text-sm mr-4 font-semibold">
                <span className="text-green-200 ">&#x2022;</span> Connected
                Users: {connectedUsers}
              </p>
            </div>
            <ul
              ref={chatBoxRef}
              className="space-y-4 h-[350px]  overflow-y-scroll scrollbar  px-3">
              {messageList.map((info, index) => (
                <li key={index}>
                  {" "}
                  <div
                    className={`flex  gap-1 items-center ${
                      name === info.author
                        ? "justify-end"
                        : "justify-start flex-row"
                    }`}>
                    {" "}
                    <p
                      className={`${
                        name === info.author ? "hidden" : "bg-sky-500"
                      } w-10 h-10 flex items-center justify-center rounded-full text-white`}>
                      {info.author[0].toUpperCase()}
                    </p>{" "}
                    <div className="flex flex-col items-center justify-center">
                      <p className="mt-4 break-words bg-white/20 text-white w-fit px-3 py-1 rounded-full">
                        {info.message}
                      </p>
                      <span className="text-xs  text-gray-300">
                        {info.time}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center">
              <input
                type="text"
                required
                className="bg-black/60 w-full px-2 lg:py-3 py-2 rounded-l-md text-gray-100 placeholder-gray-200 outline-none "
                onBlur={(e) => setMessage(e.target.value)}
                placeholder="message..."
              />
              <br />
              <button
                className=" w-24 lg:pb-2 lg:w-44 text-white bg-red-500  text-4xl"
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
