import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { PackageSearch, Edit2, Trash2, CheckCircle, Tag, MapPin, Calendar, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MyItems() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const fetchMyItems = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/items/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setItems(data.reverse()); // Show newest first
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  /* 🔥 DELETE */
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this report?")) return;
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchMyItems();
  };

  /* 🔥 RESOLVE */
  const handleResolve = async (id) => {
    if(!window.confirm("Mark this item as resolved/found?")) return;
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/items/${id}/resolve`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchMyItems();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 pb-16 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none z-0"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse pointer-events-none z-0"></div>
      
      <div className="relative z-10 w-full">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 relative z-10">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                   <Folder className="w-7 h-7" />
                </div>
                <div>
                   <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                     My Inventory
                   </h2>
                   <p className="text-gray-500 mt-1 font-medium">Manage and track the items you've actively reported.</p>
                </div>
             </div>
             
             <button 
               onClick={() => navigate("/add-item")}
               className="bg-gray-900 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
             >
               + Report New Item
             </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm relative z-10">
               <PackageSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-gray-700">No items in your inventory</h3>
               <p className="text-gray-500 mt-2 font-medium">Any items you report as lost or found will appear here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
              {items.map((item) => {
                 const isResolved = item.status === "resolved";

                 return (
                <div
                  key={item._id}
                  className={`group bg-white rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 ${isResolved ? 'opacity-75 grayscale-[0.5]' : 'hover:-translate-y-1 shadow-blue-900/5 hover:shadow-blue-900/10'} flex flex-col`}
                >
                  {/* Image Header Render logic */}
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    {item.image ? (
                      <img 
                         src={item.image.startsWith('data:image') ? item.image : `data:image/jpeg;base64,${item.image}`} 
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

                    {/* Footer Admin Actions */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
                       
                       {/* Edit (Just links to the form but styling matches) */}
                       <button
                         onClick={() => window.location.href = `/edit/${item._id}`}
                         className="flex-1 min-w-[70px] flex justify-center items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-colors border border-blue-100 shadow-sm"
                       >
                         <Edit2 className="w-3.5 h-3.5" /> <span>Edit</span>
                       </button>

                       {/* Delete */}
                       <button
                         onClick={() => handleDelete(item._id)}
                         className="flex-1 min-w-[70px] flex justify-center items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-colors border border-red-100 shadow-sm"
                       >
                         <Trash2 className="w-3.5 h-3.5" /> <span>Delete</span>
                       </button>

                       {/* Resolve */}
                       {!isResolved && (
                         <button
                           onClick={() => handleResolve(item._id)}
                           className="flex-1 min-w-[70px] flex justify-center items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-colors border border-emerald-100 shadow-sm"
                         >
                           <CheckCircle className="w-3.5 h-3.5" /> <span>Resolve</span>
                         </button>
                       )}
                       
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

export default MyItems;