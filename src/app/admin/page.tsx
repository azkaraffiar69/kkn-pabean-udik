"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as actions from "@/app/actions";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Edit3, Image as ImageIcon } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"member" | "kegiatan" | "galeri">("member");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form States
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState("");
  const [major, setMajor] = useState(""); 
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    if (activeTab === "member") setData(await actions.getMembers());
    if (activeTab === "kegiatan") setData(await actions.getKegiatan());
    if (activeTab === "galeri") setData(await actions.getGallery());
  };

  useEffect(() => { 
    cancelEdit(); 
    loadData(); 
  }, [activeTab]);

  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setMajor("");
    setFile(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Hapus data ${activeTab} ini?`)) return;
    try {
      if (activeTab === "member") await actions.deleteMember(id);
      else if (activeTab === "kegiatan") await actions.deleteKegiatan(id);
      else if (activeTab === "galeri") await actions.deleteGallery(id);
      loadData();
    } catch (error) {
      alert("Gagal menghapus data.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = "";
      if (file) {
        const path = `${activeTab}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from("kkn-pabean").upload(path, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("kkn-pabean").getPublicUrl(path);
        url = publicUrl;
      }

      if (editId) {
        if (activeTab === "member") await actions.updateMember(editId, title, description, major);
        if (activeTab === "kegiatan") await actions.updateKegiatan(editId, title, description);
        if (activeTab === "galeri") await actions.updateGallery(editId, title, description); // Update Judul & Caption
      } else {
        if (activeTab === "member") await actions.createMember(title, description, major, url);
        if (activeTab === "kegiatan") await actions.createKegiatan(title, description, url);
        if (activeTab === "galeri") await actions.createGallery(url, title, description); // Simpan Judul & Caption
      }

      cancelEdit();
      loadData();
      alert("Data berhasil diperbarui!");
    } catch (err) {
      alert("Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20">
      {/* Header Admin */}
      <header className="bg-[#174143] text-white pt-16 pb-32 px-6 rounded-b-[3rem] md:rounded-b-[5rem]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors">
              <ArrowLeft size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Back to Web</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">
              Control <br /><span className="font-serif font-light lowercase opacity-60 italic">Panel.</span>
            </h1>
          </div>
          
          <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 w-full md:w-auto overflow-x-auto">
            {["member", "kegiatan", "galeri"].map((t) => (
              <button 
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all ${activeTab === t ? "bg-white text-[#174143] shadow-xl" : "text-white/60 hover:text-white"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FORM SECTION */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/5 sticky top-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-[#174143] rounded-lg flex items-center justify-center">
                <Plus size={16} className="text-white" />
              </div>
              <h2 className="text-xl font-black text-[#174143] uppercase italic">
                {editId ? "Update" : "Add"} {activeTab}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
                  {activeTab === "member" ? "Nama Lengkap" : "Judul Konten"}
                </label>
                <input 
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#174143]/20 focus:bg-white outline-none transition-all font-medium text-[#174143]"
                  value={title} onChange={(e) => setTitle(e.target.value)} required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
                  {activeTab === "member" ? "Jabatan / Role" : "Caption / Deskripsi"}
                </label>
                <textarea 
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#174143]/20 focus:bg-white outline-none transition-all font-medium text-[#174143] min-h-[120px]"
                  value={description} onChange={(e) => setDescription(e.target.value)} required
                />
              </div>

              {activeTab === "member" && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Program Studi</label>
                  <input 
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-[#174143]/20 focus:bg-white outline-none transition-all font-medium text-[#174143]"
                    value={major} onChange={(e) => setMajor(e.target.value)} required
                  />
                </div>
              )}

              <div className="p-6 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50 hover:bg-gray-50 transition-colors relative group">
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center gap-2 text-center">
                  <ImageIcon className="text-gray-300 group-hover:text-[#174143] transition-colors" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    {file ? file.name : "Tap to upload image"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button disabled={loading} className="w-full bg-[#174143] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:brightness-125 shadow-lg shadow-[#174143]/20 transition-all disabled:opacity-50">
                  {loading ? "Processing..." : editId ? "Update Data" : "Save to Database"}
                </button>
                {editId && (
                  <button type="button" onClick={cancelEdit} className="w-full py-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-red-500 transition-colors">
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="lg:col-span-7">
          <div className="space-y-4">
            {data.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                <p className="text-gray-300 italic font-serif">Belum ada data {activeTab}...</p>
              </div>
            ) : (
              data.map((item) => (
                <div key={item.id} className="group flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-[2rem] hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-50">
                    <img 
                      src={item.imageUrl || item.image_url || "https://via.placeholder.com/150"} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                      alt="preview"
                    />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h3 className="font-black text-[#174143] uppercase italic leading-tight truncate">
                      {item.name || item.title || "Untitled"}
                    </h3>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] mt-1 line-clamp-1">
                      {item.role || item.major || item.caption || item.description || "No Detail"}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-2">
                    <button 
                      onClick={() => {
                        setEditId(item.id);
                        setTitle(item.name || item.title || "");
                        setDescription(item.role || item.description || item.caption || "");
                        setMajor(item.major || "");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      className="p-3 bg-gray-50 text-[#174143] hover:bg-[#174143] hover:text-white rounded-xl transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}