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
    <div className="min-h-screen bg-[#f8f5f0] text-[#54463a] font-sans overflow-x-hidden selection:bg-[#978864] selection:text-white relative">
      
      {/* Background Floral Illustration - Full Visibility */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/themes/sunda-floral-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      />

      {/* Audio Control */}
      {data.features?.music && data.musicUrl && isOpened && (
        <button 
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#3e342a] text-[#f7f4ed] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
      )}

      {/* Content Wrapper to fit inside the arch conceptually, though the arch is fixed in bg */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Hero / Cover Section */}
        <section className={`min-h-[100svh] w-full max-w-lg mx-auto flex flex-col items-center justify-center p-6 text-center transition-all duration-1000 ${isOpened ? 'pt-20 opacity-0 pointer-events-none absolute' : 'pt-32 opacity-100'}`}>
          
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-1000">
            <p className="text-[#866d4b] uppercase tracking-[0.2em] text-xs font-semibold">Pernikahan Tradisional</p>
            <h1 className="text-5xl md:text-6xl font-normal mt-2 mb-4 font-[family-name:var(--font-script)] text-[#54463a]">
              {data.couple.person1.name} <br/> <span className="text-[#866d4b] text-4xl">&</span> <br/> {data.couple.person2.name}
            </h1>
            
            <div className="mt-16 pt-10 border-t border-[#866d4b]/30 space-y-3">
              <p className="text-xs text-[#54463a] uppercase tracking-widest">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <h2 className="text-xl font-bold text-[#866d4b] font-[family-name:var(--font-display)]">{guestName || data.guest.name}</h2>
            </div>

            <button 
              onClick={handleOpen}
              className="mt-10 px-8 py-3 bg-[#3e342a] text-[#f8f5f0] font-semibold text-sm uppercase tracking-widest rounded-full hover:bg-[#866d4b] transition-colors shadow-xl mx-auto flex items-center gap-2 animate-bounce"
            >
              Buka Undangan
            </button>
          </div>
        </section>

        {/* Inner Content (Visible after opened) */}
        <div className={`w-full flex flex-col items-center transition-all duration-1000 transform ${isOpened ? 'translate-y-0 opacity-100 visible' : 'translate-y-20 opacity-0 invisible h-0 overflow-hidden'}`}>
          
          {/* Cover/Title for Opened State */}
          <section className="w-full py-20 px-6 max-w-lg mx-auto text-center">
            <p className="text-[#866d4b] uppercase tracking-[0.2em] text-xs font-semibold">The Wedding Of</p>
            <h1 className="text-5xl font-normal mt-2 mb-4 font-[family-name:var(--font-script)] text-[#54463a]">
              {data.couple.person1.name} & {data.couple.person2.name}
            </h1>
          </section>

        {/* The Bride & The Groom Section */}
        <section className="w-full py-20 px-6 max-w-lg mx-auto text-center">
          <div className="space-y-4 mb-16">
            <h2 className="text-3xl font-[family-name:var(--font-script)] text-[#866d4b]">The Bride & The Groom</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-[#54463a] font-bold">Assalamu'alaikum Wr. Wb.</p>
            <p className="text-[#54463a] text-sm leading-relaxed px-4">
              Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan putra-putri kami:
            </p>
          </div>
          
          <div className="space-y-16">
            <div className="space-y-6">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-[6px] border-white shadow-xl relative">
                <Image src={data.couple.person1.photo || "/images/themes/sunda-thumb.png"} alt="Groom" fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-4xl font-[family-name:var(--font-script)] text-[#866d4b]">{data.couple.person1.name}</h3>
                <p className="text-sm font-bold text-[#54463a] mt-2">{data.couple.person1.fullName}</p>
                <p className="text-xs text-[#54463a]/80 mt-1 whitespace-pre-wrap leading-relaxed">{data.couple.person1.parents}</p>
              </div>
            </div>
            
            <div className="text-4xl font-[family-name:var(--font-script)] text-[#866d4b]">&</div>
            
            <div className="space-y-6">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-[6px] border-white shadow-xl relative">
                <Image src={data.couple.person2.photo || "/images/themes/sunda-thumb.png"} alt="Bride" fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-4xl font-[family-name:var(--font-script)] text-[#866d4b]">{data.couple.person2.name}</h3>
                <p className="text-sm font-bold text-[#54463a] mt-2">{data.couple.person2.fullName}</p>
                <p className="text-xs text-[#54463a]/80 mt-1 whitespace-pre-wrap leading-relaxed">{data.couple.person2.parents}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="w-full py-20 px-6 max-w-lg mx-auto text-center">
          <h2 className="text-3xl font-[family-name:var(--font-script)] text-[#866d4b] mb-12">Rangkaian Acara</h2>
          
          <div className="space-y-8">
            {data.events.map((event, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm border border-[#866d4b]/20 p-8 rounded-3xl shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-[#866d4b]" />
                
                <h3 className="text-xl font-bold tracking-widest text-[#54463a] uppercase mb-6">{event.name}</h3>
                
                <div className="space-y-4 text-[#54463a] text-sm">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Calendar className="w-5 h-5 text-[#866d4b] mb-1" />
                    <p className="font-bold text-base">{event.date}</p>
                    <p className="text-xs px-3 py-1 bg-[#f8f5f0] rounded-full border border-[#866d4b]/20">{event.time}</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-2 pt-4 border-t border-[#866d4b]/20 mt-4">
                    <MapPin className="w-5 h-5 text-[#866d4b]" />
                    <p className="font-bold">{event.venue}</p>
                    <p className="text-xs leading-relaxed italic opacity-80">{event.address}</p>
                  </div>
                </div>

                {data.features?.maps && event.mapsUrl && (
                  <a 
                    href={event.mapsUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-8 inline-block px-8 py-3 bg-[#3e342a] text-[#f7f4ed] font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#866d4b] transition-colors"
                  >
                    Buka Peta Lokasi
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Quote Section */}
        <section className="w-full py-16 px-8 max-w-lg mx-auto text-center space-y-6">
          <Heart className="w-6 h-6 text-[#866d4b] mx-auto opacity-50" />
          <p className="text-sm italic text-[#54463a] leading-relaxed font-serif">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."
          </p>
          <p className="text-[#866d4b] font-bold tracking-widest uppercase text-xs">QS. Ar-Rum : 21</p>
        </section>

        {/* Gallery Section */}
        {data.features?.gallery && data.gallery.length > 0 && (
          <section className="w-full py-20 px-6 max-w-lg mx-auto text-center">
            <h2 className="text-3xl font-[family-name:var(--font-script)] text-[#866d4b] mb-12">Galeri Kami</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {data.gallery.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/5] overflow-hidden rounded-xl border-4 border-white shadow-md bg-gray-100">
                  <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gift Section */}
        {data.features?.gift && data.giftInfo && data.giftInfo.bankAccounts.length > 0 && (
          <section className="w-full py-20 px-6 max-w-lg mx-auto text-center">
            <Gift className="w-10 h-10 text-[#866d4b] mx-auto mb-6" />
            <h2 className="text-3xl font-[family-name:var(--font-script)] text-[#866d4b] mb-4">Tanda Kasih</h2>
            <p className="text-[#54463a] text-xs leading-relaxed mb-10 px-4">
              Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan karunia yang sangat berarti bagi kami. 
              Bagi yang ingin memberikan tanda kasih, dapat melalui:
            </p>
            
            <div className="space-y-6">
              {data.giftInfo.bankAccounts.map((bank, idx) => (
                <div key={idx} className="bg-white/90 p-8 rounded-3xl border border-[#866d4b]/30 shadow-sm relative">
                  <p className="text-lg font-bold text-[#866d4b] uppercase tracking-widest">{bank.bank}</p>
                  <p className="text-2xl font-mono text-[#3e342a] my-3">{bank.number}</p>
                  <p className="text-xs text-[#54463a] uppercase font-bold border-t border-[#866d4b]/20 pt-3 mt-2">A.N. {bank.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="w-full py-16 px-8 text-center text-[#54463a] text-xs border-t border-[#866d4b]/20 mt-10">
          <p className="mb-4 italic">Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
          <p className="font-bold text-[#3e342a] text-sm mb-10">Wassalamu'alaikum Wr. Wb.</p>
          <p className="opacity-50">Made with ♥️ by Momena Labs</p>
        </footer>

        </div>
      </div>
    </div>
  );
}
