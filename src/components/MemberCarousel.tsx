"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MemberProps {
  id: number;
  name: string;
  major: string;
  role: string;
  imageUrl?: string;
  image_url?: string;
}

export default function MemberCarousel({ data = [] }: { data: MemberProps[] }) {
  const [activeId, setActiveId] = useState<number | null>(null);

  if (!data || !Array.isArray(data)) return null;

  const getImageUrl = (path: string | undefined) => {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const BUCKET_NAME = "kkn-pabean"; 
    if (!path) return "/placeholder-avatar.jpg";
    if (path.startsWith("http")) return path;
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
  };

  return (
    <div className="w-full pt-0 pb-6 md:pb-12 overflow-visible">
      <div 
        className="flex gap-12 md:gap-20 overflow-x-auto no-scrollbar pb-10 items-end px-0"
        style={{ 
          scrollSnapType: 'x mandatory', // Diubah menjadi mandatory agar magnet lebih kuat
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch' 
        }}
      >
        {/* SPACER AWAL: Dikecilkan karena sekarang menggunakan snap center */}
        <div className="flex-shrink-0 w-8 md:w-[calc((100vw-1280px)/2)]" />

        {data.map((member) => (
          <motion.div
            key={member.id}
            onMouseEnter={() => setActiveId(member.id)}
            onMouseLeave={() => setActiveId(null)}
            // FITUR KLIK KE TENGAH
            onClick={(e) => {
              setActiveId(member.id);
              e.currentTarget.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center' // Menggeser card ke tengah secara horizontal
              });
            }}
            className="flex-shrink-0 w-[220px] md:w-[280px] relative group cursor-pointer"
            style={{ scrollSnapAlign: 'center' }} // Diubah dari start ke center
          >
            {/* IMAGE SECTION: Frameless with Fade Bottom */}
            <div className="relative aspect-[4/5] mb-6">
              <motion.div 
                animate={{ 
                  opacity: activeId === member.id ? 0.7 : 0,
                  scale: activeId === member.id ? 1.15 : 0.9
                }}
                className="absolute inset-0 bg-gradient-to-tr from-[#174143]/10 via-transparent to-transparent blur-[40px] -z-10"
              />

              <motion.div 
                animate={{ 
                  y: activeId === member.id ? -15 : 0,
                  filter: activeId !== null && activeId !== member.id ? "grayscale(1) opacity(0.3)" : "grayscale(0) opacity(1)"
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="w-full h-full relative"
              >
                <div className="w-full h-full relative overflow-hidden rounded-[3rem]">
                   <img 
                    src={getImageUrl(member.imageUrl || member.image_url)} 
                    alt={member.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>
              </motion.div>
            </div>

            {/* TEXT SECTION: Nama, Jurusan, Jabatan */}

            <motion.div 
            animate={{ 
                x: activeId === member.id ? 12 : 0,
                opacity: activeId !== null && activeId !== member.id ? 0.3 : 1
            }}
            className="space-y-2"
            >
            {/* Nama: Sekarang menggunakan wrapping normal, maksimal 2 baris */}
            <h3 className="text-2xl md:text-3xl font-black text-[#174143] uppercase italic leading-[1] tracking-tighter line-clamp-2 min-h-[3.5rem] md:min-h-[4rem]">
                {member.name}
            </h3>
            
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 truncate">
                {member.major}
            </p>
            
            <p className="text-sm font-serif italic text-[#174143]/40 truncate">
                {member.role}
            </p>
            </motion.div>

            <motion.div 
              animate={{ height: activeId === member.id ? 45 : 0 }}
              className="absolute -left-5 top-0 w-[1.5px] bg-[#174143]/20 origin-top"
            />
          </motion.div>
        ))}
        
        {/* SPACER AKHIR */}
        <div className="flex-shrink-0 w-20 md:w-40" />
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}