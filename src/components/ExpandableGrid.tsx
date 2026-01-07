"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ExpandableGrid({ items, type }: { items: any[], type: 'programs' | 'gallery' }) {
  const [selected, setSelected] = useState<any | null>(null);

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder-kegiatan.jpg";
    if (path.startsWith("http")) return path;
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${SUPABASE_URL}/storage/v1/object/public/kkn-pabean-udik/${path}`;
  };

  return (
    <>
      <div className={type === 'programs' ? "grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20" : "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`card-${type}-${item.id}`}
            onClick={() => setSelected(item)}
            className={`cursor-pointer group ${type === 'gallery' ? 'break-inside-avoid bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm' : 'flex flex-col'}`}
          >
            {/* Image Container */}
            <div className={`${type === 'programs' ? 'aspect-square md:aspect-[16/10] rounded-[2rem] md:rounded-[3.5rem]' : 'aspect-auto'} overflow-hidden relative bg-gray-100 shadow-xl`}>
              <motion.img 
                src={getImageUrl(item.imageUrl || item.image_url)} 
                alt={item.title}
                className="w-full h-full object-cover grayscale md:group-hover:grayscale-0 transition-all duration-700"
              />
            </div>

            {/* Preview Text */}
            <div className={type === 'programs' ? "px-1 md:px-6 mt-6" : "p-8"}>
              <h3 className="text-xl md:text-2xl font-black text-[#174143] uppercase italic leading-tight mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-xs line-clamp-2 opacity-70">
                {item.description || item.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FLOATING MODAL */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-[#174143]/90 backdrop-blur-xl"
            />

            {/* Content Card */}
            <motion.div 
              layoutId={`card-${type}-${selected.id}`}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden"
            >
              <button 
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-gray-100 rounded-full transition-colors text-[#174143]"
              >
                <X size={24} />
              </button>

              <div className="md:w-1/2 h-64 md:h-auto overflow-hidden bg-gray-100">
                <img 
                  src={getImageUrl(selected.imageUrl || selected.image_url)} 
                  className="w-full h-full object-cover"
                  alt={selected.title}
                />
              </div>

              <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-4 block">
                  Project Details
                </span>
                <h2 className="text-4xl md:text-6xl font-serif italic font-light text-[#174143] leading-[0.9] mb-8 tracking-tighter">
                  {selected.title}
                </h2>
                <div className="w-12 h-1 bg-[#174143]/10 mb-8" />
                <p className="text-gray-500 leading-relaxed text-base md:text-lg font-serif italic">
                  {selected.description || selected.caption}
                </p>
                
                {selected.createdAt && (
                  <p className="mt-10 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    Published: {new Date(selected.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}