"use client";

import type { ThemeProps } from "@/lib/types";
import { useInView, useCountdown, useAudioPlayer } from "@/lib/hooks";
import { useState } from "react";
import { Music, Music2, MapPin, Calendar, Copy, Check, Send, ChevronDown, Leaf, Gift, MessageCircle, Users, Clock, Image as ImageIcon } from "lucide-react";

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <section ref={ref} id={id} className={`py-16 md:py-24 px-6 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </section>
  );
}

function LeafOrnament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-6 ${className}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#6B8F6B]/40" />
      <Leaf className="w-5 h-5 text-[#6B8F6B]/60" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#6B8F6B]/40" />
    </div>
  );
}

/* ─── Cover ─── */
function CoverSection({ data, onOpen }: ThemeProps & { onOpen: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-center px-6" style={{ background: "linear-gradient(135deg, #2D3C2D 0%, #3a4f3a 30%, #2D3C2D 70%, #1A231A 100%)" }}>
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 10 C45 20, 55 25, 50 40 C48 50, 42 55, 40 60 C38 55, 32 50, 30 40 C25 25, 35 20, 40 10Z' fill='%239FBF9F' /%3E%3C/svg%3E\")", backgroundSize: "80px 80px" }} />
      <div className="relative z-10 space-y-6 animate-[fade-in_1s_ease-out]">
        <Leaf className="w-10 h-10 text-[#9FBF9F] mx-auto opacity-60" />
        <p className="text-sm tracking-[0.3em] uppercase text-[#9FBF9F]/80 font-[family-name:var(--font-body)]">The Wedding of</p>
        <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-script)] text-[#E0ECE0]">
          {data.couple.person1.name} <span className="text-3xl md:text-5xl text-[#9FBF9F]">&</span> {data.couple.person2.name}
        </h1>
        <p className="text-[#9FBF9F]/60 text-sm font-[family-name:var(--font-body)]">{new Date(data.events[0]?.date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        <LeafOrnament />
        <div>
          <p className="text-xs text-white/40 mb-2 font-[family-name:var(--font-body)]">Kepada Yth.</p>
          <p className="text-xl md:text-2xl font-[family-name:var(--font-display)] text-[#E0ECE0]">{data.guest.name}</p>
        </div>
        <button onClick={onOpen} className="mt-8 px-8 py-3 bg-[#6B8F6B] text-white font-semibold rounded-full hover:bg-[#7DA67D] transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto font-[family-name:var(--font-body)]">
          <Leaf className="w-4 h-4" /> Buka Undangan
        </button>
      </div>
      <ChevronDown className="absolute bottom-8 w-6 h-6 text-[#9FBF9F]/50 animate-bounce" />
    </div>
  );
}

/* ─── Couple ─── */
function CoupleSection({ data }: ThemeProps) {
  return (
    <Section className="text-center" id="couple" style-override>
      <div className="max-w-3xl mx-auto" style={{ background: "linear-gradient(180deg, #F2F7F2 0%, #FAF5F0 100%)" }}>
        <p className="text-sm tracking-[0.2em] uppercase text-[#6B8F6B] font-[family-name:var(--font-body)]">Bismillahirrahmanirrahim</p>
        <p className="mt-4 text-sm text-[#8B7355] max-w-lg mx-auto italic font-[family-name:var(--font-arabic)] leading-relaxed">
          &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.&rdquo;
          <br /><span className="text-xs not-italic text-[#8B7355]/60">(QS. Ar-Rum: 21)</span>
        </p>
        <LeafOrnament />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {[data.couple.person1, data.couple.person2].map((person, i) => (
            <div key={i} className="space-y-3">
              <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-[#6B8F6B]/20 to-[#C1D9C1]/20 border-2 border-[#6B8F6B]/30 flex items-center justify-center overflow-hidden">
                {person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" /> : <Leaf className="w-12 h-12 text-[#6B8F6B]/30" />}
              </div>
              <h2 className="text-3xl font-[family-name:var(--font-script)] text-[#445844]">{person.name}</h2>
              <p className="text-sm text-[#8B7355] font-[family-name:var(--font-body)]">{person.fullName}</p>
              <p className="text-xs text-[#8B7355]/60 font-[family-name:var(--font-body)]">{person.parents}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Countdown ─── */
function CountdownSection({ data }: ThemeProps) {
  const t = useCountdown(data.events[0]?.date || "");
  const units = [{ l: "Hari", v: t.days }, { l: "Jam", v: t.hours }, { l: "Menit", v: t.minutes }, { l: "Detik", v: t.seconds }];
  return (
    <Section className="text-center text-white" id="countdown" style-override>
      <div style={{ background: "linear-gradient(135deg, #445844 0%, #2D3C2D 100%)" }} className="rounded-3xl p-12 max-w-2xl mx-auto">
        <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#E0ECE0]">Save The Date</h2>
        <div className="flex justify-center gap-4 md:gap-8 mt-8">
          {units.map((u) => (
            <div key={u.l} className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
                <span className="text-2xl md:text-3xl font-bold text-[#C1D9C1] font-[family-name:var(--font-display)] tabular-nums">{String(u.v).padStart(2, "0")}</span>
              </div>
              <span className="text-xs mt-2 text-[#9FBF9F]/60 uppercase tracking-wider font-[family-name:var(--font-body)]">{u.l}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Event ─── */
function EventSection({ data }: ThemeProps) {
  return (
    <Section className="text-center" id="event">
      <div style={{ background: "linear-gradient(180deg, #FAF5F0 0%, #F2F7F2 100%)" }} className="py-4">
        <Leaf className="w-6 h-6 text-[#6B8F6B] mx-auto" />
        <h2 className="text-3xl mt-4 font-[family-name:var(--font-display)] text-[#2D3C2D]">Waktu & Tempat</h2>
        <LeafOrnament />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {data.events.map((evt, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-md border border-[#C1D9C1]/30 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-[family-name:var(--font-display)] text-[#445844]">{evt.name}</h3>
              <div className="mt-4 space-y-3 text-sm text-[#8B7355] font-[family-name:var(--font-body)]">
                <p className="flex items-center justify-center gap-2"><Clock className="w-4 h-4 text-[#6B8F6B]" />{new Date(evt.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                <p className="flex items-center justify-center gap-2"><Clock className="w-4 h-4 text-[#6B8F6B]" />{evt.time}</p>
                <p className="flex items-center justify-center gap-2"><MapPin className="w-4 h-4 text-[#6B8F6B]" />{evt.venue}</p>
                <p className="text-xs text-[#8B7355]/60">{evt.address}</p>
              </div>
              <div className="mt-6 flex gap-3 justify-center">
                <a href={evt.mapsUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-xs bg-[#6B8F6B] text-white rounded-full hover:bg-[#577357] transition font-[family-name:var(--font-body)]"><MapPin className="w-3 h-3 inline mr-1" />Buka Maps</a>
                <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evt.name)}&dates=${new Date(evt.date).toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${new Date(evt.date).toISOString().replace(/[-:]/g, "").split(".")[0]}Z&location=${encodeURIComponent(evt.venue)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-xs border border-[#6B8F6B] text-[#6B8F6B] rounded-full hover:bg-[#6B8F6B]/10 transition font-[family-name:var(--font-body)]"><Calendar className="w-3 h-3 inline mr-1" />Kalender</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Gallery ─── */
function GallerySection({ data }: ThemeProps) {
  if (!data.features.gallery || !data.gallery.length) return null;
  return (
    <Section className="text-center" id="gallery">
      <div style={{ background: "linear-gradient(135deg, #2D3C2D 0%, #445844 100%)" }} className="rounded-3xl p-10 max-w-3xl mx-auto text-white">
        <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#E0ECE0]">Our Moments</h2>
        <LeafOrnament />
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.gallery.map((img, i) => (
            <div key={i} className={`relative overflow-hidden rounded-xl group ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
              <div className="aspect-square bg-gradient-to-br from-[#6B8F6B]/20 to-[#445844]/20 flex items-center justify-center"><ImageIcon className="w-10 h-10 text-[#9FBF9F]/30" /></div>
              {img.caption && <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition"><p className="text-xs">{img.caption}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Love Story ─── */
function LoveStorySection({ data }: ThemeProps) {
  if (!data.features.loveStory || !data.loveStory?.length) return null;
  return (
    <Section className="text-center" id="love-story">
      <div style={{ background: "linear-gradient(180deg, #F2F7F2 0%, #FAF5F0 100%)" }} className="py-4">
        <h2 className="text-3xl font-[family-name:var(--font-display)] text-[#2D3C2D]">Love Story</h2>
        <LeafOrnament />
        <div className="mt-10 max-w-xl mx-auto space-y-0">
          {data.loveStory.map((item, i) => (
            <div key={i} className="relative pl-8 pb-10 border-l-2 border-[#6B8F6B]/30 text-left last:pb-0">
              <div className="absolute left-[-9px] top-0 w-4 h-4 bg-[#6B8F6B] rounded-full border-4 border-[#F2F7F2]" />
              <p className="text-xs text-[#6B8F6B] font-semibold font-[family-name:var(--font-body)]">{new Date(item.date).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>
              <h3 className="text-lg font-[family-name:var(--font-display)] text-[#2D3C2D] mt-1">{item.title}</h3>
              <p className="text-sm text-[#8B7355] mt-2 font-[family-name:var(--font-body)] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── RSVP ─── */
function RsvpSection({ data }: ThemeProps) {
  const [status, setStatus] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  if (!data.features.rsvp) return null;
  return (
    <Section className="text-center" id="rsvp">
      <div style={{ background: "linear-gradient(135deg, #445844 0%, #2D3C2D 100%)" }} className="rounded-3xl p-10 max-w-lg mx-auto text-white">
        <Users className="w-8 h-8 text-[#C1D9C1] mx-auto" />
        <h2 className="text-3xl mt-4 font-[family-name:var(--font-display)] text-[#E0ECE0]">Konfirmasi Kehadiran</h2>
        {submitted ? (
          <div className="mt-8 p-6 bg-white/10 rounded-2xl"><Check className="w-10 h-10 text-[#C1D9C1] mx-auto mb-3" /><p className="text-[#C1D9C1] font-[family-name:var(--font-body)]">Terima kasih!</p></div>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {["Hadir", "Tidak Hadir", "Masih Ragu"].map((opt) => (
                <button key={opt} onClick={() => setStatus(opt)} className={`py-3 px-2 rounded-xl text-sm font-[family-name:var(--font-body)] transition-all ${status === opt ? "bg-[#6B8F6B] text-white scale-105" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>{opt}</button>
              ))}
            </div>
            {status === "Hadir" && (
              <div className="flex items-center justify-center gap-4 text-white/70 font-[family-name:var(--font-body)]">
                <span className="text-sm">Jumlah tamu:</span>
                <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20">-</button>
                <span className="w-8 text-center text-[#C1D9C1] font-bold">{guestCount}</span>
                <button onClick={() => setGuestCount(Math.min(5, guestCount + 1))} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20">+</button>
              </div>
            )}
            <button onClick={() => setSubmitted(true)} disabled={!status} className="w-full py-3 bg-[#6B8F6B] text-white rounded-full font-semibold hover:bg-[#7DA67D] transition disabled:opacity-40 font-[family-name:var(--font-body)]">Kirim RSVP</button>
          </div>
        )}
      </div>
    </Section>
  );
}

/* ─── Guestbook ─── */
function GuestbookSection({ data }: ThemeProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [msgs, setMsgs] = useState(data.guestbookMessages);
  if (!data.features.guestbook) return null;
  return (
    <Section className="text-center" id="guestbook">
      <div style={{ background: "linear-gradient(180deg, #FAF5F0 0%, #F2F7F2 100%)" }} className="py-4">
        <MessageCircle className="w-8 h-8 text-[#6B8F6B] mx-auto" />
        <h2 className="text-3xl mt-4 font-[family-name:var(--font-display)] text-[#2D3C2D]">Ucapan & Doa</h2>
        <LeafOrnament />
        <div className="mt-8 max-w-lg mx-auto space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" className="w-full px-4 py-3 rounded-xl border border-[#6B8F6B]/20 bg-white text-sm focus:border-[#6B8F6B] focus:ring-1 focus:ring-[#6B8F6B] outline-none transition font-[family-name:var(--font-body)]" />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tulis ucapan & doa..." rows={3} className="w-full px-4 py-3 rounded-xl border border-[#6B8F6B]/20 bg-white text-sm focus:border-[#6B8F6B] focus:ring-1 focus:ring-[#6B8F6B] outline-none transition resize-none font-[family-name:var(--font-body)]" />
          <button onClick={() => { if (name && message) { setMsgs([{ id: String(Date.now()), name, message, createdAt: new Date().toISOString() }, ...msgs]); setName(""); setMessage(""); } }} className="w-full py-3 bg-[#6B8F6B] text-white rounded-full font-semibold hover:bg-[#7DA67D] transition font-[family-name:var(--font-body)] flex items-center justify-center gap-2"><Send className="w-4 h-4" />Kirim Ucapan</button>
        </div>
        <div className="mt-8 max-w-lg mx-auto space-y-3 max-h-80 overflow-y-auto">
          {msgs.map((m) => (
            <div key={m.id} className="text-left p-4 bg-white rounded-xl border border-[#C1D9C1]/20 shadow-sm">
              <p className="text-sm font-semibold text-[#445844] font-[family-name:var(--font-body)]">{m.name}</p>
              <p className="text-sm text-[#8B7355] mt-1 font-[family-name:var(--font-body)]">{m.message}</p>
              <p className="text-xs text-[#8B7355]/40 mt-2 font-[family-name:var(--font-body)]">{new Date(m.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Gift ─── */
function GiftSection({ data }: ThemeProps) {
  const [copied, setCopied] = useState<number | null>(null);
  if (!data.features.gift || !data.giftInfo) return null;
  return (
    <Section className="text-center" id="gift">
      <div style={{ background: "linear-gradient(135deg, #2D3C2D 0%, #445844 100%)" }} className="rounded-3xl p-10 max-w-lg mx-auto text-white">
        <Gift className="w-8 h-8 text-[#C1D9C1] mx-auto" />
        <h2 className="text-3xl mt-4 font-[family-name:var(--font-display)] text-[#E0ECE0]">Amplop Digital</h2>
        <p className="mt-2 text-sm text-white/50 font-[family-name:var(--font-body)]">Doa restu Anda merupakan karunia yang sangat berarti bagi kami.</p>
        <div className="mt-8 space-y-4">
          {data.giftInfo.bankAccounts.map((acc, i) => (
            <div key={i} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <p className="text-xs text-[#C1D9C1]/60 uppercase tracking-wider font-[family-name:var(--font-body)]">{acc.bank}</p>
              <p className="text-lg font-[family-name:var(--font-mono-clean)] text-[#C1D9C1] mt-2 tracking-wider">{acc.number}</p>
              <p className="text-sm text-white/40 mt-1 font-[family-name:var(--font-body)]">a.n. {acc.name}</p>
              <button onClick={() => { navigator.clipboard.writeText(acc.number); setCopied(i); setTimeout(() => setCopied(null), 2000); }} className="mt-3 px-4 py-2 text-xs bg-[#6B8F6B]/30 text-[#C1D9C1] rounded-full hover:bg-[#6B8F6B]/50 transition font-[family-name:var(--font-body)] flex items-center justify-center gap-1 mx-auto">
                {copied === i ? <><Check className="w-3 h-3" />Tersalin!</> : <><Copy className="w-3 h-3" />Salin Nomor</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Audio Player ─── */
function AudioPlayerButton({ musicUrl }: { musicUrl?: string }) {
  const { isPlaying, toggle } = useAudioPlayer(musicUrl);
  if (!musicUrl) return null;
  return (
    <button onClick={toggle} className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#6B8F6B] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#7DA67D] transition-all hover:scale-110" aria-label={isPlaying ? "Pause musik" : "Play musik"}>
      {isPlaying ? <Music className="w-5 h-5" /> : <Music2 className="w-5 h-5" />}
    </button>
  );
}

/* ─── Main ─── */
export default function Rustik1Theme({ data }: ThemeProps) {
  const [isOpened, setIsOpened] = useState(false);
  if (!isOpened) return <CoverSection data={data} onOpen={() => setIsOpened(true)} />;
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #F2F7F2 0%, #FAF5F0 50%, #F2F7F2 100%)" }}>
      <AudioPlayerButton musicUrl={data.musicUrl} />
      <CoupleSection data={data} />
      {data.features.countdown && <CountdownSection data={data} />}
      <EventSection data={data} />
      {data.features.loveStory && <LoveStorySection data={data} />}
      {data.features.gallery && <GallerySection data={data} />}
      <RsvpSection data={data} />
      <GuestbookSection data={data} />
      <GiftSection data={data} />
      <div className="py-12 text-center" style={{ background: "linear-gradient(135deg, #2D3C2D, #1A231A)" }}>
        <p className="text-2xl font-[family-name:var(--font-script)] text-[#9FBF9F]/60">{data.couple.person1.name} & {data.couple.person2.name}</p>
        <p className="text-xs mt-4 text-white/30 font-[family-name:var(--font-body)]">Powered by <span className="text-[#6B8F6B]/80">Momena Labs</span></p>
      </div>
    </div>
  );
}
