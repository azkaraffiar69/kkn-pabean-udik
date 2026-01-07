import { getMembers, getKegiatan, getGallery } from "@/app/actions";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MemberCarousel from "@/components/MemberCarousel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let allMembers: any[] = [];
  let allProjects: any[] = [];
  let allPhotos: any[] = [];
  let hasError = false;

  try {
    const [membersData, kegiatanData, galleryData] = await Promise.all([
      getMembers(),
      getKegiatan(),
      getGallery()
    ]);
    
    allMembers = membersData || [];
    allProjects = kegiatanData || [];
    allPhotos = galleryData || [];
  } catch (error) {
    console.error("Database connection failed:", error);
    hasError = true;
  }

  return (
    <main className="min-h-screen bg-white selection:bg-[#174143] selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* --- SECTION: PERSONNEL --- 
          Optimasi: Pengurangan margin bawah pada mobile agar flow lebih enak.
      */}
      <section id="team" className="max-w-7xl mx-auto px-5 md:px-6 py-16 md:py-40 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-24 gap-6">
          <div className="max-w-xl">
            <h2 className="text-[2.5rem] md:text-6xl font-black tracking-tighter text-[#174143] leading-[1.1] mb-6">
              Meet <span className="font-serif italic font-light block md:inline text-[3rem] md:text-7xl">The Team.</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed border-l-2 border-[#174143]/10 pl-4 md:pl-6 max-w-md">
              Sinergi mahasiswa Universitas Padjadjaran lintas disiplin ilmu untuk pemberdayaan masyarakat Desa Pabean Udik.
            </p>
          </div>
        </div>

        {allMembers.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-gray-100 rounded-[2rem] text-center bg-gray-50/50">
            <p className="text-gray-400 font-serif italic text-base">Roster is empty...</p>
          </div>
        ) : (
          <div className="-mx-5 md:mx-0"> 
            <MemberCarousel data={allMembers} />
          </div>
        )}
      </section>

      {/* --- SECTION: PROGRAM KERJA --- 
          Optimasi: Menggunakan aspect-square pada mobile agar gambar tidak terlalu tinggi.
      */}
      <section id="programs" className="bg-[#F9F9F9] py-16 md:py-40 px-5 md:px-6 rounded-[2.5rem] md:rounded-[5rem] mx-2 md:mx-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 md:mb-24 text-center md:text-left">
           <h2 className="text-[2.5rem] md:text-6xl font-black tracking-tighter text-[#174143] leading-[1.1] mb-4">
              Work <span className="font-serif italic font-light block md:inline text-[3rem] md:text-7xl">Programs.</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-lg">Transformasi digital dan pemberdayaan berkelanjutan.</p>
          </div>

          {allProjects.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-[2rem] border border-gray-100">
              <p className="text-gray-400 italic text-sm">Belum ada program kerja.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
              {allProjects.map((project: any) => (
                <div key={project.id} className="group flex flex-col">
                  <div className="aspect-square md:aspect-[16/10] w-full overflow-hidden rounded-[2rem] md:rounded-[3.5rem] mb-6 md:mb-10 bg-gray-200 shadow-xl relative">
                    <img 
                      src={project.imageUrl || "/placeholder-kegiatan.jpg"} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="px-1 md:px-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-[1px] w-6 bg-[#174143]/20" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#174143]/40">Program Unggulan</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black text-[#174143] mb-3 md:mb-6 tracking-tight uppercase italic leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-sm md:text-base opacity-80">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- SECTION: GALLERY --- 
          Optimasi: Grid yang lebih rapat untuk estetika dokumentasi.
      */}
      <section id="gallery" className="py-16 md:py-40 max-w-7xl mx-auto px-5">
        <div className="mb-10 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-[2.5rem] md:text-5xl font-black tracking-tighter text-[#174143]">Gallery.</h2>
            <p className="text-gray-400 mt-2 text-sm md:text-lg">Visualisasi dedikasi dan kebersamaan.</p>
          </div>
          <p className="text-[#174143]/10 font-black text-6xl hidden sm:block select-none">2026</p>
        </div>

        {allPhotos.length === 0 ? (
          <p className="text-gray-400 italic text-center py-16 text-sm">Dokumentasi belum tersedia.</p>
        ) : (
          <div className="columns-2 lg:columns-3 gap-3 md:gap-8 space-y-3 md:space-y-8">
            {allPhotos.map((photo: any) => (
              <div key={photo.id} className="relative group overflow-hidden rounded-2xl md:rounded-[3rem] border border-gray-100 break-inside-avoid isolate">
                <img 
                  src={photo.imageUrl} 
                  alt="Dokumentasi KKN" 
                  className="w-full h-auto object-cover grayscale md:group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- SECTION: CONTACT --- */}
      <section id="contact" className="py-16 md:py-40 bg-white px-5 border-t border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-32 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-[2.5rem] md:text-5xl font-black tracking-tighter text-[#174143] mb-8 leading-none">Get in <br /><span className="font-serif italic font-light opacity-40 lowercase">Touch.</span></h2>
            <div className="space-y-6 md:space-y-12">
              <div className="flex gap-5 md:gap-8 items-start">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-[#174143] text-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="font-black italic text-xs">L</span>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-1">Lokasi Posko</p>
                  <p className="text-[#174143] font-bold text-base md:text-xl">Balai Desa Pabean Udik, Indramayu</p>
                </div>
              </div>
              <div className="flex gap-5 md:gap-8 items-start">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-50 text-[#174143] rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <span className="font-black italic text-xs">E</span>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 mb-1">Surel Resmi</p>
                  <p className="text-[#174143] font-bold text-sm md:text-lg">pabeanudik26@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 h-[250px] md:h-[400px] bg-gray-50 rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-gray-100">
             <div className="w-full h-full flex items-center justify-center text-gray-400 italic text-xs">Map Placeholder</div>
          </div>
        </div>
      </section>

      <footer className="py-16 md:py-32 text-center border-t border-gray-50 bg-white">
        <div className="font-black text-2xl md:text-4xl tracking-tighter text-[#174143] uppercase mb-6 md:mb-12">
          PABEAN <span className="opacity-100 italic font-serif font-light lowercase">Udik '26</span>
        </div>
        <p className="text-[8px] md:text-[10px] font-bold tracking-[0.5em] md:tracking-[0.8em] uppercase text-[#174143]/20 leading-loose">
          Universitas Padjadjaran • Kuliah Kerja Nyata
        </p>
      </footer>
      
      {hasError && (
        <div className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-full text-[9px] font-black uppercase z-50 animate-bounce">
          System Error
        </div>
      )}
    </main>
  );
}