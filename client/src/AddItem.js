import React, { useState } from "react";
import Navbar from "./Navbar";
import {
  Type, AlignLeft, Tag, MapPin,
  Calendar, Search, CheckCircle,
  Loader2, Check, AlertCircle, Compass,
  UploadCloud, Image as ImageIcon
} from "lucide-react";

function AddItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("lost");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [status, setStatus] = useState(null);

  const handleAutoDetectLocation = () => {
    if (!("geolocation" in navigator)) {
      setStatus({ type: "error", message: "Geolocation is not supported by your browser." });
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error("Network response was not ok");
          const data = await res.json();

          const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state || "Unknown Location";
          setLocation(city);
          setStatus({ type: "success", message: "Location detected automatically!" });
          setTimeout(() => setStatus(null), 3000);
        } catch (error) {
          setStatus({ type: "error", message: "Failed to fetch city name." });
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        setStatus({ type: "error", message: "Location access denied. Please type it manually." });
        setDetectingLocation(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !date || !location) {
      setStatus({ type: "error", message: "Please fill out all required fields." });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);
      const token = localStorage.getItem("token");

      let base64Image = null;
      if (image) {
        const fileReader = new FileReader();
        base64Image = await new Promise((resolve, reject) => {
          fileReader.readAsDataURL(image);
          fileReader.onload = () => resolve(fileReader.result);
          fileReader.onerror = (error) => reject(error);
        });
      }

      const response = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          category,
          type,
          date,
          location,
          image: base64Image
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add item. Please try again.");
      }

      setStatus({ type: "success", message: "Item successfully reported! 🎉" });

      // reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setType("lost");
      setDate("");
      setLocation("");
      setImage(null);

      setTimeout(() => setStatus(null), 4000);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-500/30 pb-12 relative overflow-hidden text-gray-900">

      {/* Light Atmospheric Background Layers */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40rem] h-[40rem] bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 pointer-events-none" style={{ animation: "pulse 6s infinite" }}></div>

      <div className="relative z-10">
        <Navbar />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="bg-white px-8 py-10 border-b border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Report an Item
              </h2>
              <p className="text-gray-500 mt-2 text-base font-medium max-w-lg leading-relaxed">
                Provide as much detail as possible. The more specific you are, the faster we can connect the item with its owner.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">

              {/* Status Messages */}
              {status && (
                <div className={`p-4 rounded-2xl flex items-start gap-3 border shadow-sm ${status.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                  {status.type === 'success' ? (
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                  )}
                  <p className="text-sm font-bold">{status.message}</p>
                </div>
              )}

              {/* Segmented Control for Type (Lost/Found) */}
              <div className="space-y-3">
                <label className="block text-sm font-extrabold text-gray-700 tracking-wide uppercase">
                  What are you reporting?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setType("lost")}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 ${type === "lost"
                      ? "border-red-500 bg-red-50 text-red-700 shadow-sm scale-[1.02]"
                      : "border-gray-200 bg-gray-50/50 text-gray-500 hover:border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Search className={`w-7 h-7 mb-2 ${type === 'lost' ? 'text-red-500' : 'text-gray-400'}`} />
                    <span className="font-bold text-base">I Lost Something</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("found")}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 ${type === "found"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm scale-[1.02]"
                      : "border-gray-200 bg-gray-50/50 text-gray-500 hover:border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <CheckCircle className={`w-7 h-7 mb-2 ${type === 'found' ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <span className="font-bold text-base">I Found Something</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Image Upload Row */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 tracking-wide">
                    Upload Image <span className="text-gray-400 font-medium ml-1 text-xs">(Optional)</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group bg-gray-50/50">
                    <div className="space-y-2 text-center">
                      <div className="flex justify-center">
                        {image ? (
                          <div className="relative inline-block">
                            <ImageIcon className="h-16 w-16 text-blue-500" />
                            <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1 border-2 border-white">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        ) : (
                          <UploadCloud className="h-14 w-14 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                        )}
                      </div>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                          />
                        </label>
                        <p className="pl-1 font-medium">or drag and drop</p>
                      </div>
                      <p className="text-xs font-medium text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                      {image && (
                        <p className="text-sm text-blue-600 font-bold mt-2 truncate max-w-[200px] mx-auto">
                          {image.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Title & Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 tracking-wide">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <Type className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Blue iPhone 13"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 tracking-wide">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                        <Tag className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Electronics, Wallet..."
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 tracking-wide">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute top-4 left-4 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <AlignLeft className="w-5 h-5" />
                    </div>
                    <textarea
                      placeholder="Provide details like color, brand, unique marks..."
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold placeholder-gray-400 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Location & Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 tracking-wide">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 relative">
                      <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          placeholder="City or Area"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold placeholder-gray-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoDetectLocation}
                        disabled={detectingLocation}
                        title="Auto-detect Location"
                        className="h-[52px] px-4 flex items-center justify-center bg-blue-50 border border-blue-100 text-blue-600 rounded-xl hover:bg-blue-100 hover:border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative"
                      >
                        {detectingLocation ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Compass className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Detect Location
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 tracking-wide">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl py-4 shadow-[0_0_30px_rgba(79,70,229,0.2)] hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] transform hover:scale-[1.01] transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-lg overflow-hidden group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                      <span className="relative z-10">Submitting...</span>
                    </>
                  ) : (
                    <span className="relative z-10 flex items-center justify-center w-full">
                      Submit Report
                    </span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddItem;