"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

// Interface disesuaikan dengan data dari database
interface Member {
  id: number;
  name: string;
  role: string;
  major: string;
  imageUrl?: string | null;
}

// UBAH: Menggunakan 'data' agar sesuai dengan pemanggilan di page.tsx
interface MemberCarouselProps {
  data: Member[];
}

export default function MemberCarousel({ data = [] }: MemberCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ 
    align: "start", 
    loop: data.length > 3, // Loop hanya jika member lebih dari 3
    dragFree: true,
    containScroll: "trimSnaps"
  });

  const defaultImage = "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931";

  // Pengaman jika data kosong
  if (!data || data.length === 0) {
    return (
      <div className="p-20 border-2 border-dashed border-gray-100 rounded-[4rem] text-center w-full">
        <p className="text-gray-400 font-serif italic">Belum ada anggota tim yang terdaftar.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex gap-6 md:gap-10">
          {data.map((member, i) => (
            <div key={member.id || i} className="flex-[0_0_85%] md:flex-[0_0_30%] min-w-0">
              <motion.div 
                whileHover={{ y: -12 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative h-[450px] rounded-[3rem] overflow-hidden group flex flex-col justify-end p-10 isolate"
              >
                {/* LAYER 1: Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 z-[-2]"
                  style={{ backgroundImage: `url(${member.imageUrl || defaultImage})` }}
                />

                {/* LAYER 2: Dark Teal Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#174143] via-[#174143]/60 to-transparent z-[-1]" />
                
                {/* LAYER 3: Content */}
                <div className="relative z-10">
                  <div className="absolute top-0 right-0 -mt-[350px] w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center text-sm font-black italic border border-white/30">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-3">
                    {member.role}
                  </p>
                  
                  <h3 className="text-3xl font-black text-white tracking-tighter leading-tight uppercase mb-4">
                    {member.name}
                  </h3>
                  
                  <div className="h-[1px] w-12 bg-white/30 mb-4" />
                  
                  <p className="text-[12px] font-medium text-white/80 italic font-serif tracking-wide">
                    {member.major} Universitas Padjadjaran
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex items-center gap-4 pl-4">
          <div className="h-[2px] w-12 bg-gray-200" />
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-300">
            Drag to explore
          </p>
      </div>
    </div>
  );
}