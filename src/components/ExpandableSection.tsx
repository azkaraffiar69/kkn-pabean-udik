"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Definisi Tipe Data untuk Props
interface ItemData {
  id: number;
  title?: string;
  description?: string;
  image_url?: string;
  imageUrl?: string;
}

interface ExpandableSectionProps {
  items: ItemData[];
  type: "programs" | "gallery";
}

export default function ExpandableSection({ items, type }: ExpandableSectionProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // 2. Logika Internal untuk mengambil URL Image dari Supabase
  const getImageUrl = (path: string | undefined) => {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const BUCKET_NAME = "kkn-pabean"; 
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={item.id}
          className="border-b border-[#174143]/5 overflow-hidden"
        >
          <button
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            className="w-full py-6 flex items-center justify-between text-left group"
          >
            <div className="flex items-baseline gap-4">
              <span className="text-[10px] font-black text-[#174143]/20 uppercase italic">
                {String(item.id).padStart(2, '0')}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-[#174143] uppercase italic tracking-tighter group-hover:translate-x-2 transition-transform duration-300">
                {item.title || "Dokumentasi Kegiatan"}
              </h3>
            </div>
            
            <div className={`w-8 h-8 rounded-full border border-[#174143]/10 flex items-center justify-center transition-all duration-500 ${expandedId === item.id ? 'rotate-180 bg-[#174143] text-white' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4L6 9L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          <AnimatePresence>
            {expandedId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="pb-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Foto Program/Gallery */}
                  <div className="relative aspect-video md:aspect-square rounded-[2rem] overflow-hidden bg-gray-100">
                    <img 
                      src={getImageUrl(item.image_url || item.imageUrl)} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Deskripsi (Hanya muncul jika tipe 'programs') */}
                  <div className="space-y-4">
                    {type === "programs" && (
                      <>
                        <p className="text-[#174143]/60 leading-relaxed text-sm md:text-base">
                          {item.description || "Tidak ada deskripsi tersedia untuk program ini."}
                        </p>
                        <div className="pt-4 flex gap-2">
                           <span className="px-4 py-2 rounded-full border border-[#174143]/10 text-[10px] font-black uppercase tracking-widest text-[#174143]">
                             Pabean Udik '26
                           </span>
                        </div>
                      </>
                    )}
                    {type === "gallery" && (
                       <p className="text-[#174143]/40 italic text-sm">
                         Diabadikan pada momen kegiatan pengabdian masyarakat.
                       </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}