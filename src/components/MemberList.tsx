"use client";
import { motion } from "framer-motion";

export default function MemberList({ data }: { data: any[] }) {
  return (
    // grid-cols-1 untuk HP, md:grid-cols-3 untuk Laptop
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      {data.map((member, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-full"
        >
          <div className="w-12 h-12 bg-[#174143]/10 rounded-xl mb-6 flex items-center justify-center font-bold text-[#174143]">
            {i + 1}
          </div>
          <h3 className="text-xl font-bold mb-1 uppercase tracking-tight">{member.name}</h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            {member.role} • {member.major}
          </p>
        </motion.div>
      ))}
    </div>
  );
}