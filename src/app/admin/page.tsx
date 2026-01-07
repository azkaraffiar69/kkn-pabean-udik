"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as actions from "@/app/actions";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Edit3, Image as ImageIcon, Settings, CheckCircle2, Save, Loader2 } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"member" | "kegiatan" | "galeri" | "progress">("member");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null); // State buat loading per baris

  // Form States Umum
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState("");
  const [major, setMajor] = useState(""); 
  const [progress, setProgress] = useState(0); 
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  // Form States Khusus Config (Countdown)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadData = async () => {
    if (activeTab === "member") setData(await actions.getMembers());
    if (activeTab === "kegiatan") setData(await actions.getKegiatan());
    if (activeTab === "galeri") setData(await actions.getGallery());
    if (activeTab === "progress") {
      const [cfg, prokers] = await Promise.all([
        actions.getConfig(),
        actions.getKegiatan()
      ]);
      if (cfg) {
        setStartDate(new Date(cfg.startDate).toISOString().slice(0, 16));
        setEndDate(new Date(cfg.endDate).toISOString().slice(0, 16));
      }
      setData(prokers);
    }
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
    setProgress(0);
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "progress") {
        const formData = new FormData();
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("totalProgress", "0");
        
        const res = await actions.updateConfig(formData);
        if (res.success) alert("Jadwal KKN berhasil diperbarui!");
        return;
      }

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
        if (activeTab === "kegiatan") {
            await actions.updateKegiatan(editId, title, description);
            await actions.updateProkerProgress(editId, progress);
        }
        if (activeTab === "galeri") await actions.updateGallery(editId, title, description); 
      } else {
        if (activeTab === "member") await actions.createMember(title, description, major, url);
        if (activeTab === "kegiatan") await actions.createKegiatan(title, description, url);
        if (activeTab === "galeri") await actions.createGallery(url, title, description);
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

  // Fungsi khusus untuk simpan progress per proker
  const handleSaveProkerProgress = async (id: number, val: number) => {
    setSavingId(id);
    const res = await actions.updateProkerProgress(id, val);
    setSavingId(null);
    if (res.success) {
      // Tidak perlu alert kalau mau seamless, tapi kalau mau konfirmasi boleh ditambah
      console.log("Progress updated");
    } else {
      alert("Gagal menyimpan progress.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20">
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
          
          <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 w-full md:w-auto overflow-x-auto no-scrollbar">
            {["member", "kegiatan", "galeri", "progress"].map((t) => (
              <button 
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === t ? "bg-white text-[#174143] shadow-xl" : "text-white/60 hover:text-white"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FORM SECTION */}
        <div className={activeTab === "progress" ? "lg:col-span-12" : "lg:col-span-5"}>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-[#174143] rounded-lg flex items-center justify-center text-white">
                {activeTab === "progress" ? <Settings size={16} /> : <Plus size={16} />}
              </div>
              <h2 className="text-xl font-black text-[#174143] uppercase italic">
                {activeTab === "progress" ? "Jadwal Countdown KKN" : `${editId ? "Update" : "Add"} ${activeTab}`}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className={activeTab === "progress" ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "space-y-5"}>
              {activeTab === "progress" ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Mulai KKN</label>
                    <input type="datetime-local" className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none font-medium text-[#174143]" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Selesai KKN</label>
                    <input type="datetime-local" className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none font-medium text-[#174143]" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                  </div>
                  <div className="flex items-end">
                    <button disabled={loading} className="w-full bg-[#174143] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:brightness-125 transition-all">
                      {loading ? "Updating..." : "Update Jadwal"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">{activeTab === "member" ? "Nama Lengkap" : "Judul Konten"}</label>
                    <input className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none font-medium text-[#174143]" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">{activeTab === "member" ? "Jabatan / Role" : "Caption / Deskripsi"}</label>
                    <textarea className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none font-medium text-[#174143] min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} required />
                  </div>

                  {activeTab === "kegiatan" && (
                     <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Progress Program (%)</label>
                        <input type="number" min="0" max="100" className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none font-medium text-[#174143]" value={progress} onChange={(e) => setProgress(parseInt(e.target.value) || 0)} />
                     </div>
                  )}

                  {activeTab === "member" && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Program Studi</label>
                      <input className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none font-medium text-[#174143]" value={major} onChange={(e) => setMajor(e.target.value)} required />
                    </div>
                  )}

                  <div className="p-6 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50 hover:bg-gray-50 transition-colors relative group text-center">
                    <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <ImageIcon className="mx-auto text-gray-300 group-hover:text-[#174143] mb-2" />
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{file ? file.name : "Upload Media"}</p>
                  </div>

                  <button disabled={loading} className="w-full bg-[#174143] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-[#174143]/20 transition-all">
                    {loading ? "Processing..." : editId ? "Update Data" : "Save to Database"}
                  </button>
                  {editId && <button type="button" onClick={cancelEdit} className="w-full text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors">Cancel Edit</button>}
                </>
              )}
            </form>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className={activeTab === "progress" ? "lg:col-span-12" : "lg:col-span-7"}>
          <div className={activeTab === "progress" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {data.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-gray-100">
                <p className="text-gray-300 italic font-serif">Tidak ada data ditemukan...</p>
              </div>
            ) : (
              data.map((item) => (
                <div key={item.id} className={`group bg-white border border-gray-100 rounded-[2rem] transition-all duration-500 hover:shadow-2xl ${activeTab === 'progress' ? 'p-8' : 'p-5 flex items-center gap-4'}`}>
                  {activeTab === 'progress' ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-black text-[#174143] uppercase italic leading-tight text-lg min-h-[3rem] line-clamp-2">{item.title}</h3>
                        <div className={`p-2 rounded-lg ${item.progress === 100 ? "bg-green-50 text-green-500" : "bg-gray-50 text-gray-200"}`}>
                           <CheckCircle2 size={20} />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-grow">
                           <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 block mb-1 ml-1">Percentage (%)</label>
                           <input 
                              type="number" min="0" max="100" 
                              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#174143]/10 rounded-xl font-black text-[#174143] outline-none transition-all text-xl"
                              value={item.progress || 0}
                              onChange={(e) => {
                                 const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                 setData(prev => prev.map(p => p.id === item.id ? {...p, progress: val} : p));
                              }}
                           />
                        </div>
                        {/* SEKARANG TOMBOL INI ACTIVE */}
                        <button 
                          disabled={savingId === item.id}
                          onClick={() => handleSaveProkerProgress(item.id, item.progress || 0)}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center mt-4 transition-all ${
                            savingId === item.id 
                            ? "bg-gray-100 text-gray-400" 
                            : "bg-[#174143] text-white hover:brightness-125 shadow-lg shadow-[#174143]/20"
                          }`}
                        >
                          {savingId === item.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Save size={16} />
                          )}
                        </button>
                      </div>

                      <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                         <div className="h-full bg-[#174143] transition-all duration-500" style={{ width: `${item.progress || 0}%` }} />
                      </div>
                    </div>
                  ) : (
                    // Tampilan List Biasa
                    <>
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={item.imageUrl || item.image_url || "https://via.placeholder.com/150"} className="w-full h-full object-cover" alt="preview" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-black text-[#174143] uppercase italic leading-tight truncate">{item.name || item.title}</h3>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 truncate">{item.role || item.major || item.description || item.caption}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          setEditId(item.id);
                          setTitle(item.name || item.title || "");
                          setDescription(item.role || item.description || item.caption || "");
                          setMajor(item.major || "");
                          setProgress(item.progress || 0);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} className="p-3 bg-gray-50 text-[#174143] hover:bg-[#174143] hover:text-white rounded-xl transition-all"><Edit3 size={14} /></button>
                        <button onClick={async () => {
                            if(confirm("Hapus data?")) {
                                if(activeTab === "member") await actions.deleteMember(item.id);
                                if(activeTab === "kegiatan") await actions.deleteKegiatan(item.id);
                                if(activeTab === "galeri") await actions.deleteGallery(item.id);
                                loadData();
                            }
                        }} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={14} /></button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}