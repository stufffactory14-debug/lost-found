import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send, MessageSquare, LogOut, ArrowLeft, Handshake, CheckCircle, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  // Resolve feature states
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [myItems, setMyItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null") || {};
  const chatUser = JSON.parse(localStorage.getItem("chatUser") || "null");

  const bottomRef = useRef(null);
  const navigate = useNavigate();

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

  /* 🔥 FETCH CONVERSATIONS (NOT ALL USERS) */
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/conversations/${user._id}`);
        const data = await res.json();
        
        // Remove ourselves from the list if present
        let conversationList = data.filter((u) => u._id !== user._id);

        // ALWAYS inject chatUser if we clicked "Contact Owner" and they aren't in history yet
        if (chatUser && chatUser._id !== user._id) {
          const exists = conversationList.some((u) => u._id === chatUser._id);
          if (!exists) {
            conversationList.unshift(chatUser); 
          }
          setSelectedUser(chatUser);
        } else if (conversationList.length > 0 && !selectedUser) {
           setSelectedUser(conversationList[0]);
        }

        setUsers(conversationList);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?._id) fetchConversations();
  }, [user?._id]); // We don't depend on chatUser/selectedUser to avoid re-fetching constantly

  /* 🔥 AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 🔥 FETCH + RECEIVE MESSAGES */
  useEffect(() => {
    if (!selectedUser || !socket) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${user._id}/${selectedUser._id}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    // Remove existing listener before adding to prevent duplicates
    socket.off("receiveMessage");
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
  const sendMessage = (e, customPayload = null) => {
    if (e) e.preventDefault();
    if (!customPayload && !message.trim()) return;
    if (!selectedUser) return;

    const payload = customPayload || {
      senderId: user._id,
      receiverId: selectedUser._id,
      text: message,
      type: "text"
    };

    socket.emit("sendMessage", payload);

    if (!customPayload) setMessage("");
  };

  /* 🔥 PROPOSE RESOLVE */
  const fetchMyItems = async () => {
    setLoadingItems(true);
    try {
      const res = await fetch("http://localhost:5000/api/items");
      const data = await res.json();
      setMyItems(data.filter(i => i.user?._id === user._id && i.status === "open"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItems(false);
    }
  };

  const openResolveModal = () => {
    setShowResolveModal(true);
    fetchMyItems();
  };

  const sendProposal = (item) => {
    sendMessage(null, {
      senderId: user._id,
      receiverId: selectedUser._id,
      text: `I'd like to mark "${item.title}" as resolved. Do you accept?`,
      type: "proposal",
      itemId: item._id,
      itemTitle: item.title
    });
    setShowResolveModal(false);
  };

  /* 🔥 ACCEPT PROPOSAL */
  const acceptProposal = async (msg) => {
     try {
       const token = localStorage.getItem("token");
       // Resolve the actual item
       const res = await fetch(`http://localhost:5000/api/items/${msg.itemId}/resolve`, {
         method: "PUT",
         headers: { Authorization: `Bearer ${token}` }
       });
       
       if (res.ok) {
          // Broadcast that it was accepted
          sendMessage(null, {
            senderId: user._id,
            receiverId: selectedUser._id,
            text: `Proposal accepted! "${msg.itemTitle}" has been resolved.`,
            type: "accepted_proposal",
            itemId: msg.itemId,
            itemTitle: msg.itemTitle
          });
       }
     } catch (err) {
       console.error("Failed to accept proposal", err);
     }
  };

  /* 🔥 LOGOUT */
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="h-screen flex bg-slate-50 font-sans text-gray-900 overflow-hidden">
      
      {/* LEFT USERS LIST */}
      <div className="w-1/3 max-w-sm bg-white border-r border-gray-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white relative">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Messages
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto w-full p-3 space-y-1 scrollbar-hide">
          {users.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center space-y-3">
             <MessageSquare className="w-10 h-10 text-gray-200" />
             <p className="text-sm font-medium">No active conversations yet.</p>
           </div>
          ) : (
            users.map((u) => {
              const isOnline = onlineUsers.some((o) => o === u._id); // Assuming backend sends array of ids
  
              return (
                <div
                  key={u._id}
                  onClick={() => setSelectedUser(u)}
                  className={`p-4 rounded-xl cursor-pointer flex items-center gap-4 transition-all duration-200 border border-transparent ${
                    selectedUser?._id === u._id
                      ? "bg-blue-50 border-blue-100 shadow-sm"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      selectedUser?._id === u._id ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "bg-gray-100 text-gray-500"
                    }`}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-base truncate ${selectedUser?._id === u._id ? "text-blue-900" : "text-gray-900"}`}>
                      {u.name}
                    </h3>
                    <p className={`text-xs mt-0.5 truncate ${selectedUser?._id === u._id ? "text-blue-600/70 font-medium" : "text-gray-400"}`}>
                       Click to chat
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
        
        {/* Background Blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>

        {selectedUser ? (
          <>
            {/* HEADER */}
            <div className="py-5 px-8 bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center z-10 sticky top-0 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/30">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-extrabold text-lg text-gray-900">
                    {selectedUser.name}
                  </h2>
                  <p className="text-xs text-blue-600 font-medium tracking-wide">Connected</p>
                </div>
              </div>
    
              <div className="flex items-center gap-2">
                <button
                  onClick={openResolveModal}
                  className="flex items-center gap-1.5 text-amber-600 hover:text-white font-bold px-4 py-2 bg-amber-50 hover:bg-amber-500 rounded-full transition-colors text-sm border border-amber-200 shadow-sm"
                >
                  <Handshake className="w-4 h-4" />
                  Propose Resolve
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-semibold px-4 py-2 hover:bg-red-50 rounded-lg transition-colors text-sm border border-transparent hover:border-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
    
            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 z-10 scrollbar-hide">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="bg-white/50 backdrop-blur px-6 py-3 rounded-full text-sm font-medium text-gray-400 shadow-sm border border-gray-100">
                    Start of conversation with {selectedUser.name}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.senderId === user._id;

                  // INTERACTIVE CARDS
                  if (msg.type === "proposal") {
                    return (
                      <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                         <div className="max-w-[75%] bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-5 rounded-2xl shadow-sm text-amber-900">
                            <div className="flex items-center gap-2 font-black text-amber-600 mb-2">
                               <Handshake className="w-5 h-5" />
                               Deal Proposal
                            </div>
                            <p className="text-[15px] font-medium leading-relaxed bg-white/50 p-3 rounded-lg border border-amber-100">
                              {msg.text}
                            </p>
                            {!isMe && (
                               <button 
                                 onClick={() => acceptProposal(msg)}
                                 className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl shadow-md flex justify-center items-center gap-2 transition-transform transform active:scale-95"
                               >
                                  <Check className="w-5 h-5" /> Accept & Resolve Item
                               </button>
                            )}
                            {isMe && (
                               <p className="text-xs font-bold text-amber-500 mt-3 text-center uppercase tracking-wider">Awaiting response...</p>
                            )}
                         </div>
                      </div>
                    );
                  }

                  if (msg.type === "accepted_proposal") {
                    return (
                      <div key={i} className="flex justify-center my-4">
                         <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-3 rounded-full flex items-center gap-3 shadow-sm font-bold text-sm">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            {msg.text}
                         </div>
                      </div>
                    );
                  }

                  // STANDARD TEXT BUBBLE
                  return (
                    <div
                      key={i}
                      className={`flex ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 text-xs font-bold ${
                           isMe ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600"
                        }`}>
                          {isMe ? user.name.charAt(0).toUpperCase() : selectedUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div
                          className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                            isMe
                              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm"
                              : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
    
              <div ref={bottomRef}></div>
            </div>
    
            {/* INPUT */}
            <div className="p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 z-10">
              <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto items-center p-2 bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-inner relative">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-800 placeholder-gray-400"
                />
    
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4 z-10">
             <MessageSquare className="w-16 h-16 text-gray-200" />
             <p className="text-lg font-semibold text-gray-500">Your Chat History</p>
             <p className="text-sm font-medium max-w-xs text-center text-gray-400">Select a conversation from the left to start sending messages.</p>
          </div>
        )}

        {/* RESOLVE MODAL */}
        {showResolveModal && (
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <h3 className="font-extrabold text-xl text-gray-900 flex items-center gap-2">
                     <Handshake className="text-amber-500" />
                     Propose Resolution
                   </h3>
                   <button onClick={() => setShowResolveModal(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition">
                      <X className="w-5 h-5" />
                   </button>
                </div>
                <div className="p-6">
                   <p className="text-sm font-medium text-gray-500 mb-4">
                     Select an item to formally hand over or return. This will send a proposal to <span className="font-bold text-gray-900">{selectedUser.name}</span>.
                   </p>
                   
                   <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                      {loadingItems ? (
                        <div className="text-center py-6 text-gray-400 font-medium">Loading items...</div>
                      ) : myItems.length === 0 ? (
                         <div className="text-center py-6 text-gray-400 font-medium border-2 border-dashed border-gray-200 rounded-xl">
                            You have no open items right now.
                         </div>
                      ) : (
                         myItems.map(item => (
                            <div 
                              key={item._id} 
                              onClick={() => sendProposal(item)}
                              className="p-4 border-2 border-gray-100 rounded-xl hover:border-amber-400 hover:bg-amber-50 cursor-pointer transition-all group flex items-center justify-between"
                            >
                               <div className="flex flex-col">
                                 <span className="font-bold text-gray-900 group-hover:text-amber-900 line-clamp-1">{item.title}</span>
                                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.type}</span>
                               </div>
                               <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-white transition-colors">
                                  <Send className="w-4 h-4 ml-0.5" />
                               </div>
                            </div>
                         ))
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Chat;