import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Search, Tag, MapPin, Calendar, CheckCircle, MessageCircle, AlertCircle, PackageSearch } from "lucide-react";

function Items() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/items");
        const data = await res.json();
        // reverse to show newest first!
        setItems(data.reverse());
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    
    const matchesSearch =
      (item.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(search.toLowerCase());

    const matchesLocation = 
      !locationSearch || (item.location || "").toLowerCase().includes(locationSearch.toLowerCase());

    return matchesFilter && matchesSearch && matchesLocation;
  }).sort((a, b) => {
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    return 0;
  });

  const handleContact = (itemUser) => {
    if (!user) {
      navigate("/"); // Redirect to login if not logged in
      return; 
    }

    if (user._id === itemUser._id) {
      alert("This is your own item 😅");
      return;
    }

    // Set chat target exactly
    localStorage.setItem("chatUser", JSON.stringify(itemUser));
    navigate("/chat");
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this report?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from state
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (id) => {
    if(!window.confirm("Mark this item as resolved/found?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/items/${id}/resolve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update state locally
      setItems(items.map(i => i._id === id ? { ...i, status: "resolved" } : i));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 pb-16 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none z-0"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse pointer-events-none z-0"></div>
      
      <div className="relative z-10 w-full">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-3">
              <PackageSearch className="w-10 h-10 text-blue-600" />
              Community Feed
            </h2>
            <p className="text-gray-500 mt-3 text-base font-medium leading-relaxed">
              Browse newly reported lost items or look through recently found items near you.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 p-4 mb-12 flex flex-col gap-4 z-10 relative">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Keyword Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Keyword (e.g. Wallet, iPhone)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium placeholder-gray-400 shadow-inner"
                />
              </div>

              {/* Location Search */}
              <div className="relative flex-[0.7]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                </div>
                <input
                  type="text"
                  placeholder="Address or City (e.g. Mathura)..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full bg-emerald-50/30 border border-emerald-100 text-gray-900 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium placeholder-emerald-700/50 shadow-inner"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex bg-gray-100/80 p-1.5 rounded-2xl shadow-inner">
                <button
                  onClick={() => setFilter("all")}
                  className={`flex-1 px-5 py-2 rounded-xl font-bold text-sm tracking-wide transition-all ${
                    filter === "all" ? "bg-white text-gray-900 shadow-md transform scale-100" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 scale-95"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("lost")}
                  className={`flex-1 px-5 py-2 rounded-xl font-bold text-sm tracking-wide transition-all ${
                    filter === "lost" ? "bg-red-500 text-white shadow-md shadow-red-500/20 transform scale-100" : "text-gray-500 hover:text-red-500 hover:bg-red-50 scale-95"
                  }`}
                >
                  Lost
                </button>
                <button
                  onClick={() => setFilter("found")}
                  className={`flex-1 px-5 py-2 rounded-xl font-bold text-sm tracking-wide transition-all ${
                    filter === "found" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 transform scale-100" : "text-gray-500 hover:text-emerald-500 hover:bg-emerald-50 scale-95"
                  }`}
                >
                  Found
                </button>
              </div>
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm relative z-10">
               <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-gray-700">No items found</h3>
               <p className="text-gray-500 mt-2 font-medium">Try checking a different category or search term.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
              {filteredItems.map((item) => {
                const isOwner = user && user._id === item.user?._id;
                const isResolved = item.status === "resolved";

                return (
                <div
                  key={item._id}
                  className={`group rounded-3xl shadow-md hover:shadow-2xl overflow-hidden transform transition-all duration-300 flex flex-col relative ${
                    isResolved 
                      ? 'opacity-75 grayscale-[0.5] bg-white border border-gray-100' 
                      : item.priority 
                        ? 'hover:-translate-y-1 bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 shadow-amber-900/10 hover:shadow-amber-900/20' 
                        : 'hover:-translate-y-1 bg-white border border-gray-100 shadow-blue-900/5 hover:shadow-blue-900/10'
                  }`}
                >
                  {/* Image Header */}
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    {item.image ? (
                      <img 
                         src={item.image.startsWith('data:image') ? item.image : `data:image/jpeg;base64,${item.image}`} // handle base64 encoding correctly if it wasn't prefixed
                         alt={item.title} 
                         className={`w-full h-full object-cover transition-transform duration-500 ${!isResolved && 'group-hover:scale-105'}`}
                         onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                         }}
                      />
                    ) : null}
                    
                    {/* Fallback Image Placheolder */}
                    <div className={`${item.image ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center justify-center text-blue-300`}>
                       <PackageSearch className="w-12 h-12 opacity-50 mb-2" />
                       <span className="text-xs font-bold uppercase tracking-wider text-blue-400/60">No Image</span>
                    </div>

                     <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                       {item.priority && !isResolved && (
                         <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full shadow-md bg-gradient-to-r from-amber-400 to-amber-600 text-white flex items-center gap-1 border border-amber-300 animate-pulse">
                           🔥 Priority
                         </span>
                       )}
                       {isResolved && (
                         <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-md bg-gray-800 text-white flex items-center gap-1">
                           <CheckCircle className="w-3 h-3" /> Resolved
                         </span>
                       )}
                       <span className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-sm ${
                         item.type === "lost" 
                           ? "bg-red-500/90 text-white" 
                           : "bg-emerald-500/90 text-white"
                       }`}>
                         {item.type}
                       </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className={`text-xl font-extrabold line-clamp-1 ${isResolved ? "text-gray-500" : "text-gray-900"}`}>{item.title}</h3>
                    <p className="text-gray-500 font-medium text-sm mt-3 line-clamp-2 leading-relaxed flex-1">
                      {item.description}
                    </p>

                    <div className="mt-5 space-y-2 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm font-medium text-gray-600 gap-2">
                         <Tag className="w-4 h-4 text-blue-400 flex-shrink-0" />
                         <span className="truncate">{item.category}</span>
                      </div>
                      
                      {item.location && (
                        <div className="flex items-center text-sm font-medium text-gray-600 gap-2">
                           <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                           <span className="truncate">{item.location}</span>
                        </div>
                      )}

                      {item.date && (
                        <div className="flex items-center text-sm font-medium text-gray-600 gap-2">
                           <Calendar className="w-4 h-4 text-orange-400 flex-shrink-0" />
                           <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer / Actions */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                       <div className="flex items-center gap-2 max-w-[40%]">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                             {item.user?.name ? item.user.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <span className="text-xs font-bold text-gray-700 truncate">
                            {item.user?.name || "Unknown"}
                          </span>
                       </div>

                       <div className="flex gap-2 relative z-20">
                         {isOwner ? (
                           <>
                             {!isResolved && (
                               <button
                                 onClick={(e) => { e.stopPropagation(); handleResolve(item._id); }}
                                 className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-colors border border-emerald-100 flex items-center gap-1 shadow-sm"
                               >
                                 <CheckCircle className="w-3.5 h-3.5" /> Resolve
                               </button>
                             )}
                             <button
                               onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                               className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-colors border border-red-100 shadow-sm"
                             >
                               Delete
                             </button>
                           </>
                         ) : (
                           <button
                             onClick={() => handleContact(item.user)}
                             disabled={isResolved}
                             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors group/btn border shadow-sm flex-shrink-0 ${
                               isResolved 
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                                : "bg-gray-50 hover:bg-blue-50 text-blue-600 border-gray-100 hover:border-blue-100"
                             }`}
                           >
                             <MessageCircle className={`w-4 h-4 ${!isResolved && "group-hover/btn:animate-pulse"}`} />
                             <span>Contact</span>
                           </button>
                         )}
                       </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Items;