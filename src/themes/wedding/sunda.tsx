"use client";

import { useEffect, useState } from "react";
import type { ThemeProps } from "@/lib/types";
import Image from "next/image";
import { Play, Pause, MapPin, Calendar, Gift, Heart } from "lucide-react";

export default function SundaTheme({ data, guestName }: ThemeProps & { guestName?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (data.musicUrl) {
      const a = new Audio(data.musicUrl);
      a.loop = true;
      setAudio(a);
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [data.musicUrl]);

  const toggleAudio = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleOpen = () => {
    setIsOpened(true);
    if (audio && !isPlaying) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#54463a] font-sans overflow-x-hidden selection:bg-[#978864] selection:text-white flex flex-col md:flex-row">
      
      {/* Audio Control */}
      {data.features?.music && data.musicUrl && isOpened && (
        <button 
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#3e342a] text-[#f7f4ed] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
      )}

      {/* LEFT PANEL (Fixed on Desktop) */}
      <div className="hidden md:flex md:w-[60%] lg:w-[65%] fixed left-0 top-0 bottom-0 flex-col items-center justify-center relative overflow-hidden">
        <Image 
          src={data.coverPhoto || "/images/themes/sunda-thumb.png"} 
          alt="Couple Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        <div className="relative z-10 text-center text-white mt-auto pb-20 px-8">
          <p className="text-sm uppercase tracking-[0.2em] mb-2 font-medium">The Wedding of</p>
          <h1 className="text-5xl lg:text-7xl font-[family-name:var(--font-display)] drop-shadow-lg">
            {data.couple.person1.name} & {data.couple.person2.name}
          </h1>
          {data.events[0] && (
            <p className="mt-4 text-lg font-medium tracking-wide">
              {data.events[0].date}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT PANEL (Scrollable Content) */}
      <div className={`w-full md:w-[40%] lg:w-[35%] md:ml-auto min-h-screen relative bg-[#f7f4ed] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] transition-transform duration-1000 ${isOpened ? 'translate-y-0' : 'translate-y-0'}`}>
        
        {/* Cover Overlay for Mobile or Initial State */}
        {!isOpened && (
          <div className="absolute inset-0 z-50 bg-[#f7f4ed] flex flex-col items-center justify-center p-6 text-center">
            {/* Background Illustration */}
            <div 
              className="absolute inset-0 z-0 opacity-80"
              style={{
                backgroundImage: "url('/images/themes/sunda-floral-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
            
            <div className="relative z-10 space-y-6 mt-10">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#6d5c4b]">Wedding Invitation</p>
              <h1 className="text-5xl font-[family-name:var(--font-display)] text-[#866d4b]">
                {data.couple.person1.name} <br/> <span className="text-3xl">&</span> <br/> {data.couple.person2.name}
              </h1>
              {data.events[0] && (
                <p className="text-sm font-bold tracking-widest text-[#54463a] pt-4">
                  {data.events[0].date.replace(/,/g, ' . ')}
                </p>
              )}
              
              <div className="mt-16 pt-8 space-y-2">
                <p className="text-xs font-semibold text-[#866d4b] uppercase tracking-widest">Kepada Yth.</p>
                <h2 className="text-xl font-bold font-[family-name:var(--font-display)]">{guestName || data.guest.name}</h2>
              </div>

              <button 
                onClick={handleOpen}
                className="mt-8 px-8 py-3 bg-[#3e342a] text-[#f7f4ed] text-sm uppercase tracking-widest font-semibold rounded-full hover:bg-[#54463a] transition-colors flex items-center gap-2 mx-auto shadow-xl"
              >
                Buka Undangan
              </button>
            </div>
          </div>
        )}

        {/* Inner Content (Visible after opened) */}
        {isOpened && (
          <div className="relative z-10 bg-[#f7f4ed]/90 backdrop-blur-sm min-h-screen">
            {/* Subtle background for content */}
            <div 
              className="fixed inset-0 z-[-1] opacity-30 pointer-events-none"
              style={{
                backgroundImage: "url('/images/themes/sunda-floral-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed"
              }}
            />

            {/* Mobile Hero (Only visible on mobile, since desktop has left panel) */}
            <section className="md:hidden relative h-[60vh] flex items-center justify-center p-6 text-center overflow-hidden">
              <Image 
                src={data.coverPhoto || "/images/themes/sunda-thumb.png"} 
                alt="Cover"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 text-white space-y-4">
                <p className="text-sm uppercase tracking-[0.2em]">The Wedding Of</p>
                <h1 className="text-4xl font-[family-name:var(--font-display)]">
                  {data.couple.person1.name} & {data.couple.person2.name}
                </h1>
              </div>
            </section>

            {/* Quote */}
            <section className="py-16 px-8 text-center space-y-6">
              <Heart className="w-6 h-6 text-[#866d4b] mx-auto opacity-50" />
              <p className="text-sm italic text-[#54463a] leading-relaxed font-serif">
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."
              </p>
              <p className="text-[#866d4b] font-bold tracking-widest uppercase text-xs">QS. Ar-Rum : 21</p>
            </section>

            {/* Mempelai */}
            <section className="py-16 px-8 text-center space-y-12">
              <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#3e342a]">Sang Mempelai</h2>
              
              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#866d4b]/30 relative">
                    <Image src={data.couple.person1.photo || "/images/themes/sunda-thumb.png"} alt="Groom" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-[family-name:var(--font-display)] text-[#866d4b]">{data.couple.person1.fullName}</h3>
                    <p className="text-xs text-[#6d5c4b] mt-2 whitespace-pre-wrap">{data.couple.person1.parents}</p>
                  </div>
                </div>
                
                <div className="text-2xl font-[family-name:var(--font-script)] text-[#866d4b]">&</div>
                
                <div className="space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#866d4b]/30 relative">
                    <Image src={data.couple.person2.photo || "/images/themes/sunda-thumb.png"} alt="Bride" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-[family-name:var(--font-display)] text-[#866d4b]">{data.couple.person2.fullName}</h3>
                    <p className="text-xs text-[#6d5c4b] mt-2 whitespace-pre-wrap">{data.couple.person2.parents}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Acara */}
            <section className="py-16 px-8 text-center">
              <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#3e342a] mb-10">Rangkaian Acara</h2>
              
              <div className="space-y-10">
                {data.events.map((event, idx) => (
                  <div key={idx} className="bg-white/60 p-6 rounded-2xl border border-[#866d4b]/20 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#866d4b] to-transparent" />
                    
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[#866d4b] mb-4">{event.name}</h3>
                    
                    <div className="space-y-3 text-[#54463a] text-sm">
                      <p className="font-bold">{event.date}</p>
                      <p>{event.time}</p>
                      
                      <div className="pt-3 border-t border-[#866d4b]/10 mt-3">
                        <p className="font-bold mb-1">{event.venue}</p>
                        <p className="text-xs leading-relaxed">{event.address}</p>
                      </div>
                    </div>

                    {data.features?.maps && event.mapsUrl && (
                      <a 
                        href={event.mapsUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-6 inline-block px-6 py-2 bg-[#866d4b] text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-[#3e342a] transition-colors"
                      >
                        Buka Peta Lokasi
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery */}
            {data.features?.gallery && data.gallery.length > 0 && (
              <section className="py-16 px-8 text-center">
                <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#3e342a] mb-8">Galeri</h2>
                
                <div className="grid grid-cols-2 gap-3">
                  {data.gallery.map((img, idx) => (
                    <div key={idx} className="relative aspect-square overflow-hidden rounded-lg">
                      <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gift */}
            {data.features?.gift && data.giftInfo && data.giftInfo.bankAccounts.length > 0 && (
              <section className="py-16 px-8 text-center">
                <Gift className="w-8 h-8 text-[#866d4b] mx-auto mb-4" />
                <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#3e342a] mb-4">Wedding Gift</h2>
                <p className="text-[#54463a] text-sm leading-relaxed mb-8">
                  Bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih, dapat mengirimkan melalui rekening berikut:
                </p>
                
                <div className="space-y-4">
                  {data.giftInfo.bankAccounts.map((bank, idx) => (
                    <div key={idx} className="bg-white/60 p-6 rounded-xl border border-[#866d4b]/20">
                      <p className="text-lg font-bold text-[#866d4b] uppercase">{bank.bank}</p>
                      <p className="text-2xl font-mono text-[#3e342a] my-2">{bank.number}</p>
                      <p className="text-xs text-[#54463a] uppercase font-semibold">A.N. {bank.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Footer */}
            <footer className="py-12 px-8 text-center text-[#6d5c4b] text-xs border-t border-[#866d4b]/20">
              <p className="mb-4 text-sm italic font-serif">Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
              <p className="font-bold text-[#3e342a] text-base mb-8">Wassalamu'alaikum Wr. Wb.</p>
              <p className="opacity-50">Made with ♥️ by Momena Labs</p>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
