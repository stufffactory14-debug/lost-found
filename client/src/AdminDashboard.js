import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { 
  Settings, IndianRupee, FileText, Zap, Save, Loader2, TrendingUp
} from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [price, setPrice] = useState(500);
  const [enabled, setEnabled] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [statsRes, settingsRes] = await Promise.all([
          fetch("http://localhost:5000/api/payment/admin/stats", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:5000/api/payment/settings", {
             headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (statsRes.ok && settingsRes.ok) {
          const statsData = await statsRes.json();
          const settingsData = await settingsRes.json();
          
          setStats(statsData);
          setSettings(settingsData);
          setPrice(settingsData.price);
          setEnabled(settingsData.enabled);
        }
      } catch (err) {
        console.error("Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, user]);

  const handleSaveSettings = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/payment/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ price, enabled })
      });
      if (res.ok) alert("Settings saved successfully!");
      else alert("Failed to save settings.");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 pb-16 relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-indigo-100/50 to-transparent pointer-events-none z-0"></div>
      
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          
          <div className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                <Settings className="w-10 h-10 text-indigo-600" />
                Admin Dashboard
              </h2>
              <p className="text-gray-500 mt-2 font-medium">Manage priority listings, pricing, and view revenue analytics.</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-2">
                 <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div> Active
                 </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {/* Stat: Total Revenue */}
            <div className="bg-white rounded-[2rem] p-8 shadow-md border border-gray-100 relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
               <div className="flex justify-between items-start relative z-10 w-full mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                   <IndianRupee className="w-6 h-6" />
                 </div>
                 <div className="flex items-center gap-1 text-emerald-500 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                    <TrendingUp className="w-4 h-4" /> +100%
                 </div>
               </div>
               <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider relative z-10">Total Revenue</h3>
               <p className="text-4xl font-black text-gray-900 mt-2 relative z-10">₹{stats?.totalRevenue || 0}</p>
            </div>

            {/* Stat: Priority Posts */}
            <div className="bg-white rounded-[2rem] p-8 shadow-md border border-gray-100 relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
               <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center relative z-10 mb-6">
                 <Zap className="w-6 h-6" />
               </div>
               <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider relative z-10">Paid Listings</h3>
               <p className="text-4xl font-black text-gray-900 mt-2 relative z-10">{stats?.totalPayments || 0}</p>
            </div>

             {/* Stat: Controls */}
             <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 shadow-lg relative overflow-hidden text-white flex flex-col justify-between">
               <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-bl-[100px] pointer-events-none"></div>
               <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-4 text-blue-300">Feature Toggle</h3>
                 <label className="flex items-center cursor-pointer gap-4">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={enabled}
                      onChange={(e) => setEnabled(e.target.checked)} 
                    />
                    <div className={`block w-14 h-8 rounded-full transition-colors ${enabled ? "bg-emerald-500" : "bg-gray-600"}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? "transform translate-x-6" : ""}`}></div>
                  </div>
                  <span className="font-bold text-sm uppercase tracking-wider">{enabled ? "Enabled" : "Disabled"}</span>
                 </label>

                 <div className="mt-5">
                   <p className="text-xs text-gray-400 font-medium mb-1">Set Priority Price (INR)</p>
                   <div className="flex items-center gap-2">
                     <span className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center font-bold text-gray-400">₹</span>
                     <input 
                       type="number"
                       value={price}
                       onChange={(e) => setPrice(Number(e.target.value))}
                       className="w-full bg-gray-700 border-none rounded-xl py-2 px-3 text-white font-bold focus:ring-2 focus:ring-blue-500"
                     />
                   </div>
                 </div>
               </div>

               <button 
                 onClick={handleSaveSettings}
                 disabled={saving}
                 className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
               >
                 {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 Save Configuration
               </button>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <FileText className="w-6 h-6 text-gray-500" />
              <h3 className="text-xl font-extrabold text-gray-900">Recent Transactions</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {stats?.payments?.map((payment) => (
                    <tr key={payment._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-8 py-5 text-sm font-bold text-gray-900">{payment.razorpayPaymentId || '-'}</td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                               {payment.user?.name ? payment.user.name.charAt(0) : '?'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{payment.user?.name || 'Unknown'}</p>
                              <p className="text-xs font-medium text-gray-500">{payment.user?.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-gray-900">₹{payment.amount}</td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100">
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {stats?.payments?.length === 0 && (
                     <tr>
                        <td colSpan="5" className="px-8 py-10 text-center text-gray-500 font-medium">No transactions found.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
