"use client";

import { useEffect, useState } from "react";
import type { ThemeProps } from "@/lib/types";
import Image from "next/image";
import { Play, Pause, MapPin, Calendar, Gift, Heart } from "lucide-react";

export default function ElegantDarkTheme({ data, guestName }: ThemeProps & { guestName?: string }) {
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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-[#cda434] selection:text-black">
      
      {/* Audio Control */}
      {data.features?.music && data.musicUrl && (
        <button 
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#cda434] text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(205,164,52,0.3)] hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
      )}

      {/* Hero / Cover Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={data.coverPhoto || "/images/themes/lux-art-1-thumb.jpg"} 
            alt="Cover"
            fill
            className="object-cover opacity-40 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-[#0a0a0a]" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <p className="text-[#cda434] uppercase tracking-[0.3em] text-sm">THE WEDDING OF</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight font-[family-name:var(--font-display)] drop-shadow-lg">
            {data.couple.person1.name} <span className="text-[#cda434] italic">&</span> {data.couple.person2.name}
          </h1>
          
          <div className="pt-12 space-y-4">
            <p className="text-sm text-gray-400 uppercase tracking-widest">Kepada Yth.</p>
            <h2 className="text-2xl font-medium text-white">{guestName || data.guest.name}</h2>
            <p className="text-gray-400 text-sm italic">Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir.</p>
          </div>
        </div>
      </section>

      {/* Couple Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-[#cda434]/0 to-[#cda434]/50" />
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <Heart className="w-8 h-8 text-[#cda434] mx-auto opacity-50" />
          <p className="text-lg italic text-gray-300 max-w-2xl mx-auto leading-relaxed">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 pt-8">
            <div className="space-y-4">
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border border-[#cda434]/30 relative grayscale hover:grayscale-0 transition-all duration-700">
                <Image src={data.couple.person1.photo || "/images/themes/lux-art-1-thumb.jpg"} alt="Groom" fill className="object-cover" />
              </div>
              <h3 className="text-3xl font-[family-name:var(--font-display)] text-[#cda434]">{data.couple.person1.fullName}</h3>
              <p className="text-sm text-gray-400 uppercase tracking-wider">{data.couple.person1.parents}</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border border-[#cda434]/30 relative grayscale hover:grayscale-0 transition-all duration-700">
                <Image src={data.couple.person2.photo || "/images/themes/lux-art-1-thumb.jpg"} alt="Bride" fill className="object-cover" />
              </div>
              <h3 className="text-3xl font-[family-name:var(--font-display)] text-[#cda434]">{data.couple.person2.fullName}</h3>
              <p className="text-sm text-gray-400 uppercase tracking-wider">{data.couple.person2.parents}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 bg-[#0f0f0f] relative border-y border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <p className="text-[#cda434] uppercase tracking-[0.2em] text-sm">Jadwal Acara</p>
            <h2 className="text-4xl font-[family-name:var(--font-display)] font-light">Momen Bahagia Kami</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.events.map((event, idx) => (
              <div key={idx} className="bg-[#141414] border border-[#222] p-8 rounded-2xl relative overflow-hidden group hover:border-[#cda434]/30 transition-colors">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Calendar className="w-32 h-32 text-[#cda434]" />
                </div>
                
                <h3 className="text-2xl font-[family-name:var(--font-display)] text-[#cda434] mb-6">{event.name}</h3>
                
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-[#cda434] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">{event.date}</p>
                      <p className="text-sm text-gray-500">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-[#cda434] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">{event.venue}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{event.address}</p>
                    </div>
                  </div>
                </div>

                {data.features?.maps && event.mapsUrl && (
                  <a 
                    href={event.mapsUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-8 inline-block px-6 py-2 border border-[#cda434] text-[#cda434] text-sm uppercase tracking-widest hover:bg-[#cda434] hover:text-black transition-colors"
                  >
                    Buka Google Maps
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {data.features?.gallery && data.gallery.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <p className="text-[#cda434] uppercase tracking-[0.2em] text-sm">Galeri</p>
              <h2 className="text-4xl font-[family-name:var(--font-display)] font-light">Potret Kenangan</h2>
            </div>
            
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
              {data.gallery.map((img, idx) => (
                <div key={idx} className="relative group overflow-hidden rounded-lg break-inside-avoid">
                  <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#cda434]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gift Section */}
      {data.features?.gift && data.giftInfo && data.giftInfo.bankAccounts.length > 0 && (
        <section className="py-24 bg-[#0f0f0f] border-y border-[#1a1a1a]">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-12">
            <Gift className="w-12 h-12 text-[#cda434] mx-auto" />
            <h2 className="text-4xl font-[family-name:var(--font-display)] font-light">Amplop Digital</h2>
            <p className="text-gray-400 leading-relaxed">
              Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
              Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
              {data.giftInfo.bankAccounts.map((bank, idx) => (
                <div key={idx} className="p-6 border border-[#222] bg-[#141414] rounded-xl space-y-4 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#cda434]/5 rounded-full blur-2xl" />
                  <p className="text-lg font-medium text-white">{bank.bank}</p>
                  <p className="text-2xl font-mono text-[#cda434] tracking-widest">{bank.number}</p>
                  <p className="text-sm text-gray-500 uppercase">A.N. {bank.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 text-center text-gray-600 text-sm">
        <p>Created with Momena Labs</p>
      </footer>
    </div>
  );
}
