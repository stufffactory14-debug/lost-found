import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Chat from "./Chat";
import Dashboard from "./Dashboard";
import AddItem from "./AddItem";
import Items from "./Items";
import MyItems from "./MyItems";
import EditItem from "./EditItem";
import Register from "./Register";



function App() {
  return (
    
    <BrowserRouter>
     <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/chat" element={<Chat />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/add-item" element={<AddItem />} />
  <Route path="/items" element={<Items />} />
<Route path="/my-items" element={<MyItems />} />
<Route path="/edit/:id" element={<EditItem />} />
<Route path="/register" element={<Register />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;


