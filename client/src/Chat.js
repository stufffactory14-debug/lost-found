import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";


function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const user =
    JSON.parse(localStorage.getItem("user") || "null") || {};
  const chatUser =
    JSON.parse(localStorage.getItem("chatUser") || "null");

  const bottomRef = useRef(null);

  /* 🔥 INIT SOCKET */
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  /* 🔥 JOIN USER */
  useEffect(() => {
  if (socket && user?._id) {
    socket.emit("join", user._id);
  }
}, [socket, user?._id]);

  /* 🔥 ONLINE USERS */
  useEffect(() => {
    if (!socket) return;

    socket.on("getOnlineUsers", (data) => {
      setOnlineUsers(data);
    });

    return () => socket.off("getOnlineUsers");
  }, [socket]);

  /* 🔥 AUTO SELECT USER */
  useEffect(() => {
    if (chatUser && user && chatUser._id !== user._id) {
      setSelectedUser(chatUser);
    }
  }, [chatUser, user]);

  /* 🔥 AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 🔥 FETCH USERS */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/users"
        );
        const data = await res.json();

        const filtered = data.filter(
          (u) => u._id !== user._id
        );
        setUsers(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?._id) fetchUsers();
}, [user?._id]);

  /* 🔥 FETCH + RECEIVE MESSAGES */
  useEffect(() => {
    if (!selectedUser || !socket) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/messages/${user._id}/${selectedUser._id}`
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    socket.on("receiveMessage", (data) => {
      if (
        data.senderId === selectedUser._id ||
        data.receiverId === selectedUser._id
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedUser, socket, user?._id]);

  /* 🔥 SEND MESSAGE */
  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId: selectedUser._id,
      text: message
    });

    setMessage("");
  };

  /* 🔥 LOGOUT */
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="h-screen flex bg-gray-100">
     
      {/* LEFT USERS */}
      <div className="w-1/3 bg-white border-r overflow-y-auto">
        <h2 className="text-xl font-bold p-4 border-b">
          Users
        </h2>

        {users.map((u) => {
          const isOnline = onlineUsers.some(
            (o) => o.userId === u._id
          );

          return (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`p-4 cursor-pointer flex justify-between items-center ${
                selectedUser?._id === u._id
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
            >
              <span>{u.name}</span>

              <span
                className={`text-sm ${
                  isOnline
                    ? "text-green-500"
                    : "text-gray-400"
                }`}
              >
                {isOnline ? "●" : "○"}
              </span>
            </div>
          );
        })}
      </div>

      {/* RIGHT CHAT */}
      <div className="w-2/3 flex flex-col">

        {/* HEADER */}
        <div className="p-4 bg-white border-b flex justify-between">
          <h2 className="font-bold">
            Chat with {selectedUser?.name || "..."}
          </h2>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.senderId === user._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.senderId === user._id
                    ? "bg-green-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          <div ref={bottomRef}></div>
        </div>

        {/* INPUT */}
        <div className="p-4 bg-white border-t flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1 border rounded px-3 py-2"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;