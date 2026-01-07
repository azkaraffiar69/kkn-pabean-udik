"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function StatsSection({ config, prokers }: { config: any, prokers: any[] }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
  const [status, setStatus] = useState<"upcoming" | "ongoing" | "finished">("upcoming");

  useEffect(() => {
    if (!config) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(config.startDate).getTime();
      const end = new Date(config.endDate).getTime();
      
      let target = (now < start) ? start : end;
      
      if (now < start) {
        setStatus("upcoming");
      } else if (now < end) {
        setStatus("ongoing");
      } else {
        setStatus("finished");
        return clearInterval(timer);
      }

      const distance = target - now;
      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000), // Detik dihitung di sini
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [config]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* LIST PROGRESS TIAP PROKER */}
      <div className="bg-[#F9F9F9] p-8 md:p-12 rounded-[3rem] border border-gray-100 flex flex-col">
        <h4 className="text-[#174143] font-black uppercase italic text-2xl tracking-tighter mb-2">Program Progress</h4>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Pantau Progres Program Kerja Kami</p>
        
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar flex-grow">
          {prokers.map((proker) => (
            <div key={proker.id} className="group">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[11px] font-black text-[#174143] uppercase italic truncate max-w-[70%]">
                  {proker.title}
                </span>
                <span className="text-sm font-black text-[#174143] italic">{proker.progress || 0}%</span>
              </div>
              <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-gray-100">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${proker.progress || 0}%` }}
                  transition={{ duration: 1, ease: "circOut" }}
                  className="h-full bg-[#174143] rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COUNTDOWN DENGAN DETIK */}
      <div className="bg-[#174143] p-8 md:p-12 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl shadow-[#174143]/20">
        <div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">
            Countdown
          </p>
          <h3 className="text-2xl font-serif italic font-light opacity-80 leading-none">
            {status === "upcoming" ? "Waiting for departure" : status === "ongoing" ? "Days in Pabean Udik" : "Mission Accomplished"}
          </h3>
        </div>
        
        {status !== "finished" && timeLeft ? (
          <div className="grid grid-cols-4 gap-2 mt-12 md:mt-0">
            {[
              { l: 'Days', v: timeLeft.d },
              { l: 'Hrs', v: timeLeft.h },
              { l: 'Min', v: timeLeft.m },
              { l: 'Sec', v: timeLeft.s } // Menambahkan kolom detik
            ].map((t, i) => (
              <div key={i} className="text-center">
                <span className="text-3xl md:text-5xl lg:text-6xl font-black italic block tracking-tighter leading-none">
                  {String(t.v).padStart(2, '0')}
                </span>
                <span className="text-[8px] md:text-[9px] uppercase font-bold opacity-30 tracking-widest">{t.l}</span>
              </div>
            ))}
          </div>
        ) : (
          <h2 className="text-4xl font-black italic leading-none mt-12 md:mt-0">Selesai. <br/><span className="opacity-40 font-serif font-light lowercase">2026 Pengabdian.</span></h2>
        )}
      </div>
    </div>
  );
}