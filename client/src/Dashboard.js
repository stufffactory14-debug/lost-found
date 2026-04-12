import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { 
  Package, Search, CheckCircle, MessageSquare, 
  Plus, LayoutGrid, MessageCircle, Folder, 
  ArrowRight, Clock, AlertCircle 
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/items");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch items", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const myItems = items.filter((i) => i.user?._id === user._id);
  const lost = items.filter((i) => i.type === "lost");
  const found = items.filter((i) => i.type === "found");

  const statCards = [
    { title: "My Items", value: loading ? "-" : myItems.length, icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Lost Items", value: loading ? "-" : lost.length, icon: Search, color: "text-red-600", bg: "bg-red-100" },
    { title: "Found Items", value: loading ? "-" : found.length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Messages", value: "--", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  const actionButtons = [
    { label: "Report Item", desc: "Lost or found something?", icon: Plus, onClick: () => navigate("/add-item"), gradient: "from-blue-500 to-indigo-600" },
    { label: "Browse Items", desc: "Search through the database", icon: LayoutGrid, onClick: () => navigate("/items"), gradient: "from-emerald-500 to-teal-600" },
    { label: "Messages", desc: "Your active chats", icon: MessageCircle, onClick: () => navigate("/chat"), gradient: "from-purple-500 to-fuchsia-600" },
    { label: "Inventory", desc: "Manage your listings", icon: Folder, onClick: () => navigate("/my-items"), gradient: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user.name}</span> 👋
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Here's an overview of your items and recent activity.</p>
          </div>
          <button 
            onClick={() => navigate("/add-item")}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-5 h-5" />
            New Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-500 tracking-wide">{stat.title}</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{stat.value}</h3>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions (Takes up 2/3 of space on large screens) */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {actionButtons.map((action, idx) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    className="group relative flex items-start flex-col justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 text-left overflow-hidden h-44"
                  >
                    {/* Background Icon Detail */}
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                      <ActionIcon className="w-32 h-32" />
                    </div>
                    
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md mb-4`}>
                      <ActionIcon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="z-10 mt-auto">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{action.label}</h3>
                      <p className="text-sm font-medium text-gray-500 mt-1">{action.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Items Sidebar */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recent Activity</h2>
              <button 
                onClick={() => navigate("/items")} 
                className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 overflow-hidden">
              {loading ? (
                <div className="p-8 flex flex-col items-center justify-center text-gray-400">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-medium">Loading items...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                  <Package className="w-12 h-12 mb-3 text-gray-300" />
                  <p className="text-base font-bold text-gray-600">No recent reports</p>
                  <p className="text-sm mt-1">There are no items reported yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {items.slice(0, 4).map((item) => (
                    <div 
                      key={item._id} 
                      className="p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group flex items-start gap-4" 
                      onClick={() => navigate(`/items`)}
                    >
                      <div className={`mt-0.5 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${
                        item.type === 'lost' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {item.type === 'lost' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      </div>
                      
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="text-base font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {item.type}
                          </span>
                          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Recently
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;