"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Pastikan sudah install framer-motion
import { X } from "lucide-react";

interface ExpandableItem {
  id: number;
  title: string;
  description?: string;
  caption?: string;
  imageUrl?: string;
  image_url?: string;
  createdAt?: Date | string;
}

export default function ExpandableSection({ items, type }: { items: ExpandableItem[], type: 'programs' | 'gallery' }) {
  const [selected, setSelected] = useState<ExpandableItem | null>(null);

  /**
   * Logika Internal URL Gambar:
   * Dipindahkan ke sini untuk menghindari error "Functions cannot be passed directly to Client Components".
   */
  const getImageUrl = (path: string | undefined) => {
    // Variabel NEXT_PUBLIC_ otomatis tersedia di Client Component
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const BUCKET_NAME = "kkn-pabean"; // Sesuai dengan konfigurasi di page.tsx Anda
    
    if (!path) return "/placeholder-kegiatan.jpg";
    if (path.startsWith("http")) return path;
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
  };

  return (
    <>
      {/* Tampilan Layout Grid (Programs) atau Masonry (Gallery) */}
      <div className={type === 'programs' 
        ? "grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20" 
        : "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
      }>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`card-${type}-${item.id}`} // Efek Shared Element Transition
            onClick={() => setSelected(item)}
            className={`cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-500 bg-white ${
              type === 'gallery' 
                ? 'break-inside-avoid rounded-[2.5rem] overflow-hidden border border-gray-100' 
                : 'rounded-[3rem] p-4 border border-transparent hover:border-gray-100 flex flex-col'
            }`}
          >
            {/* Media Wrapper */}
            <div className={`${type === 'programs' ? 'aspect-square md:aspect-[16/10] rounded-[2rem] md:rounded-[2.5rem]' : 'aspect-auto'} overflow-hidden relative bg-gray-100`}>
              <motion.img 
                src={getImageUrl(item.imageUrl || item.image_url)} 
                alt={item.title}
                className="w-full h-full object-cover grayscale md:group-hover:grayscale-0 transition-all duration-700"
              />
            </div>

            {/* Konten Pratinjau */}
            <div className={type === 'programs' ? "px-4 md:px-6 py-6" : "p-8"}>
              <h3 className="text-xl md:text-2xl font-black text-[#174143] uppercase italic leading-tight mb-2 tracking-tighter">
                {item.title}
              </h3>
              <p className="text-gray-500 text-xs line-clamp-2 opacity-70 leading-relaxed font-medium">
                {item.description || item.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL FLOATING DETAIL */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 lg:p-20">
            {/* Backdrop dengan Blur Efek */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-[#174143]/90 backdrop-blur-xl"
            />

            {/* Modal Card yang Mengembang */}
            <motion.div 
              layoutId={`card-${type}-${selected.id}`}
              className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[3rem] md:rounded-[4rem] shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelected(null)} 
                className="absolute top-6 right-6 z-10 p-3 bg-gray-100/80 hover:bg-[#174143] hover:text-white rounded-full transition-all duration-300 shadow-lg"
              >
                <X size={24} />
              </button>

              <div className="md:w-1/2 h-72 md:h-auto overflow-hidden bg-gray-50">
                <img 
                  src={getImageUrl(selected.imageUrl || selected.image_url)} 
                  className="w-full h-full object-cover" 
                  alt={selected.title} 
                />
              </div>

              {/* Detail Teks Lengkap */}
              <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto flex flex-col justify-center bg-white">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-[2px] w-8 bg-[#174143]/20" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 block">
                    {type === 'programs' ? 'Program Detail' : 'Archive Documentation'}
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-7xl font-black text-[#174143] uppercase italic leading-[0.85] mb-8 tracking-tighter">
                  {selected.title}
                </h2>

                <div className="space-y-6">
                  <p className="text-[#174143]/80 leading-relaxed text-base md:text-xl font-serif italic">
                    {selected.description || selected.caption}
                  </p>
                  
                  {/* Catatan Kaki */}
                  <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                      KKN Pabean Udik • 2026
                    </p>
                    {selected.createdAt && (
                       <span className="text-[9px] px-3 py-1 bg-gray-50 rounded-full text-gray-400 font-bold uppercase italic">
                         {new Date(selected.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                       </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}