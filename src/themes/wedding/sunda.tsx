"use client";

import { useEffect, useState } from "react";
import type { ThemeProps } from "@/lib/types";
import Image from "next/image";
import { Play, Pause, MapPin, Calendar, Gift, Heart, Clock } from "lucide-react";

export default function SundaTheme({ data, guestName }: ThemeProps & { guestName?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

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

  return (
    <div className="min-h-screen bg-[#4a5342] text-white font-sans overflow-x-hidden selection:bg-[#cda434] selection:text-black relative">
      
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 z-0 opacity-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url('/images/themes/sunda-pattern.png')",
          backgroundSize: "400px",
          backgroundRepeat: "repeat"
        }}
      />

      {/* Audio Control */}
      {data.features?.music && data.musicUrl && (
        <button 
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#cda434] text-[#2c3326] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(205,164,52,0.4)] hover:scale-110 transition-transform border-2 border-[#fff2cc]"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
      )}

      {/* Hero / Cover Section */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center p-6 z-10 text-center">
        <div className="absolute inset-0 z-[-1]">
          <Image 
            src={data.coverPhoto || "/images/themes/sunda-thumb.png"} 
            alt="Cover"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#3a4233]/50 via-[#2c3326]/80 to-[#2c3326]" />
        </div>
        
        <div className="w-full max-w-lg mx-auto bg-[#3a4233]/80 backdrop-blur-sm border border-[#cda434]/40 rounded-t-full pt-16 pb-12 px-8 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-1000 relative overflow-hidden">
          {/* Subtle top ornament */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-16 opacity-50">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0 C60 30 80 40 100 50 C80 60 60 70 50 100 C40 70 20 60 0 50 C20 40 40 30 50 0 Z" fill="#cda434"/>
            </svg>
          </div>

          <p className="text-[#cda434] uppercase tracking-[0.2em] text-xs font-semibold mt-4">Pernikahan Tradisional</p>
          <h1 className="text-5xl md:text-6xl font-normal mt-6 mb-4 font-[family-name:var(--font-script)] text-white drop-shadow-md">
            {data.couple.person1.name} <br/> <span className="text-[#cda434] text-4xl">&</span> <br/> {data.couple.person2.name}
          </h1>
          
          <div className="mt-10 pt-6 border-t border-[#cda434]/20 space-y-3">
            <p className="text-xs text-[#e0e3d9] uppercase tracking-widest">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <h2 className="text-xl font-bold text-[#cda434] font-[family-name:var(--font-display)]">{guestName || data.guest.name}</h2>
            <p className="text-[#cda434]/70 text-xs italic">Mohon maaf bila ada kesalahan penulisan nama/gelar.</p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 px-6 relative z-10 bg-[#2c3326]">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-lg italic text-[#e0e3d9] leading-relaxed font-[family-name:var(--font-body)]">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."
          </p>
          <p className="text-[#cda434] font-bold tracking-widest uppercase text-sm">QS. Ar-Rum : 21</p>
        </div>
      </section>

      {/* Couple Section */}
      <section className="py-24 px-6 relative z-10 bg-[#3a4233] border-y border-[#cda434]/20">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <p className="text-[#cda434] uppercase tracking-[0.3em] text-sm">Sang Mempelai</p>
            <h2 className="text-3xl font-[family-name:var(--font-display)] text-white">Assalamu'alaikum Wr. Wb.</h2>
            <p className="text-[#e0e3d9] max-w-2xl mx-auto text-sm leading-relaxed">
              Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan putra-putri kami:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#cda434] to-transparent" />
            
            <div className="space-y-6">
              <div className="w-48 h-56 mx-auto rounded-t-full overflow-hidden border-2 border-[#cda434] p-1 relative bg-[#2c3326]">
                <div className="w-full h-full rounded-t-full overflow-hidden relative">
                  <Image src={data.couple.person1.photo || "/images/themes/sunda-thumb.png"} alt="Groom" fill className="object-cover" />
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-[family-name:var(--font-script)] text-[#cda434]">{data.couple.person1.fullName}</h3>
                <p className="text-sm text-[#e0e3d9] mt-2 leading-relaxed whitespace-pre-wrap">{data.couple.person1.parents}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="w-48 h-56 mx-auto rounded-t-full overflow-hidden border-2 border-[#cda434] p-1 relative bg-[#2c3326]">
                <div className="w-full h-full rounded-t-full overflow-hidden relative">
                  <Image src={data.couple.person2.photo || "/images/themes/sunda-thumb.png"} alt="Bride" fill className="object-cover" />
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-[family-name:var(--font-script)] text-[#cda434]">{data.couple.person2.fullName}</h3>
                <p className="text-sm text-[#e0e3d9] mt-2 leading-relaxed whitespace-pre-wrap">{data.couple.person2.parents}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 bg-[#2c3326] relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <p className="text-[#cda434] uppercase tracking-[0.2em] text-sm">Waktu & Tempat</p>
            <h2 className="text-4xl font-[family-name:var(--font-display)]">Rangkaian Acara</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.events.map((event, idx) => (
              <div key={idx} className="bg-[#3a4233] border-2 border-[#cda434]/30 p-8 rounded-tr-3xl rounded-bl-3xl relative text-center group hover:border-[#cda434] transition-colors shadow-lg">
                <h3 className="text-2xl font-[family-name:var(--font-display)] text-[#cda434] mb-4 border-b border-[#cda434]/20 pb-4 inline-block">{event.name}</h3>
                
                <div className="space-y-4 text-[#e0e3d9] mt-2">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Calendar className="w-5 h-5 text-[#cda434] mb-1" />
                    <p className="font-bold text-white text-lg">{event.date}</p>
                    <p className="text-sm text-[#cda434] bg-[#2c3326] px-3 py-1 rounded-full">{event.time}</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-2 pt-4">
                    <MapPin className="w-5 h-5 text-[#cda434]" />
                    <p className="font-bold text-white">{event.venue}</p>
                    <p className="text-sm leading-relaxed">{event.address}</p>
                  </div>
                </div>

                {data.features?.maps && event.mapsUrl && (
                  <a 
                    href={event.mapsUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-8 inline-block px-8 py-2.5 bg-[#cda434] text-[#2c3326] font-bold text-sm uppercase tracking-widest rounded-full hover:bg-white transition-colors"
                  >
                    Buka Peta Lokasi
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {data.features?.gallery && data.gallery.length > 0 && (
        <section className="py-24 px-6 relative z-10 bg-[#3a4233]">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-12 space-y-4">
              <p className="text-[#cda434] uppercase tracking-[0.2em] text-sm">Galeri Kami</p>
              <h2 className="text-4xl font-[family-name:var(--font-display)]">Potret Kebahagiaan</h2>
            </div>
            
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {data.gallery.map((img, idx) => (
                <div key={idx} className="relative group overflow-hidden rounded-xl border-4 border-[#cda434]/20 break-inside-avoid">
                  <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-auto object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gift Section */}
      {data.features?.gift && data.giftInfo && data.giftInfo.bankAccounts.length > 0 && (
        <section className="py-24 bg-[#2c3326] relative z-10">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
            <Gift className="w-12 h-12 text-[#cda434] mx-auto" />
            <h2 className="text-4xl font-[family-name:var(--font-display)]">Tanda Kasih</h2>
            <p className="text-[#e0e3d9] leading-relaxed max-w-xl mx-auto">
              Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan karunia yang sangat berarti bagi kami. 
              Bagi yang ingin memberikan tanda kasih, dapat mengirimkan melalui:
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              {data.giftInfo.bankAccounts.map((bank, idx) => (
                <div key={idx} className="p-8 border-2 border-[#cda434]/40 bg-[#3a4233] rounded-2xl space-y-3 w-full sm:w-[350px]">
                  <p className="text-xl font-bold text-[#cda434] uppercase tracking-wider">{bank.bank}</p>
                  <p className="text-3xl font-mono text-white tracking-widest">{bank.number}</p>
                  <p className="text-sm text-[#e0e3d9] uppercase font-semibold mt-2 border-t border-[#cda434]/20 pt-3">A.N. {bank.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 text-center text-[#e0e3d9] text-sm bg-[#1c2217] relative z-10 border-t border-[#cda434]/30">
        <p className="mb-2">Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
        <p className="font-bold text-[#cda434]">Wassalamu'alaikum Wr. Wb.</p>
        <p className="mt-8 text-xs opacity-50">Dibuat dengan ♥️ oleh Momena Labs</p>
      </footer>
    </div>
  );
}
