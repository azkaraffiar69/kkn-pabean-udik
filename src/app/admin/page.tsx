"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as actions from "@/app/actions";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"member" | "kegiatan" | "galeri">("member");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form States
  const [nameOrTitle, setNameOrTitle] = useState(""); 
  const [roleOrDesc, setRoleOrDesc] = useState("");
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
    setNameOrTitle("");
    setRoleOrDesc("");
    setMajor("");
    setFile(null);
  };

  // Fungsi Hapus Dinamis (Perbaikan Utama)
  const handleDelete = async (id: number) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data ${activeTab} ini?`)) return;

    try {
      if (activeTab === "member") await actions.deleteMember(id);
      else if (activeTab === "kegiatan") await actions.deleteKegiatan(id);
      else if (activeTab === "galeri") await actions.deleteGallery(id);
      
      alert("Data berhasil dihapus!");
      loadData(); // Refresh list setelah hapus
    } catch (error) {
      console.error("Gagal menghapus:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = "";
      // 1. Upload ke Supabase jika ada file baru
      if (file) {
        const path = `${activeTab}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from("kkn-pabean").upload(path, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("kkn-pabean").getPublicUrl(path);
        url = publicUrl;
      }

      // 2. Kirim ke Database (Neon) via Actions
      if (editId) {
        if (activeTab === "member") await actions.updateMember(editId, nameOrTitle, roleOrDesc, major);
        if (activeTab === "kegiatan") await actions.updateKegiatan(editId, nameOrTitle, roleOrDesc);
        if (activeTab === "galeri") await actions.updateGallery(editId, nameOrTitle);
      } else {
        if (activeTab === "member") await actions.createMember(nameOrTitle, roleOrDesc, major, url);
        if (activeTab === "kegiatan") await actions.createKegiatan(nameOrTitle, roleOrDesc, url);
        if (activeTab === "galeri") await actions.createGallery(url, nameOrTitle);
      }

      alert("Data Berhasil Disimpan!");
      cancelEdit();
      loadData();
    } catch (err) {
      console.error("EROR SAAT SIMPAN:", err);
      alert("Gagal simpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter italic text-[#174143]">Admin KKN Dashboard</h1>
      
      {/* Tab Switcher */}
      <div className="flex gap-4 mb-10 bg-gray-100 p-2 rounded-2xl w-fit">
        {["member", "kegiatan", "galeri"].map((t) => (
          <button 
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`px-6 py-2 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${activeTab === t ? "bg-white shadow-sm text-blue-600" : "text-gray-400"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Input */}
        <div className="bg-white border-2 border-gray-50 p-6 rounded-[2.5rem] shadow-sm h-fit">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-black uppercase mb-4 text-[#174143]">{editId ? "Edit" : "Tambah"} {activeTab}</h2>
            
            <input 
              placeholder={activeTab === "member" ? "Nama Lengkap" : "Judul/Caption"}
              className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-blue-500"
              value={nameOrTitle} onChange={(e) => setNameOrTitle(e.target.value)} required
            />

            {activeTab !== "galeri" && (
              <textarea 
                placeholder={activeTab === "member" ? "Role/Jabatan" : "Deskripsi"}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-blue-500 min-h-[100px]"
                value={roleOrDesc} onChange={(e) => setRoleOrDesc(e.target.value)} required
              />
            )}

            {activeTab === "member" && (
              <input 
                placeholder="Jurusan (Contoh: Sastra Inggris)"
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-blue-500"
                value={major} onChange={(e) => setMajor(e.target.value)} required
              />
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Foto (Opsional jika edit)</label>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>

            <div className="flex gap-2 pt-2">
              <button disabled={loading} className="flex-grow bg-[#174143] text-white p-4 rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-50">
                {loading ? "Memproses..." : editId ? "UPDATE DATA" : "SIMPAN DATA"}
              </button>
              {editId && (
                <button type="button" onClick={cancelEdit} className="px-6 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Data List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-black uppercase text-gray-300 tracking-widest text-sm mb-6">Daftar {activeTab} Terdaftar</h2>
          {data.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
              <p className="text-gray-400 italic">Belum ada data untuk kategori ini.</p>
            </div>
          ) : (
            data.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-3xl bg-white group hover:shadow-lg transition-all duration-300">
                <img 
                  src={item.imageUrl || item.image_url || "https://via.placeholder.com/150"} 
                  className="w-16 h-16 object-cover rounded-2xl bg-gray-100" 
                  alt="preview"
                />
                <div className="flex-grow">
                  <h3 className="font-bold text-[#174143] leading-tight">{item.name || item.title || "Tanpa Judul"}</h3>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1">
                    {item.role || (item.description ? item.description.substring(0, 30) + "..." : item.caption || "Dokumentasi")}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditId(item.id);
                      setNameOrTitle(item.name || item.title || "");
                      setRoleOrDesc(item.role || item.description || item.caption || "");
                      setMajor(item.major || "");
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-xs"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-xs"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}