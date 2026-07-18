"use client";

import { useState, useRef } from "react";
import { 
  Users, MessageSquare, ExternalLink, Download, 
  Send, Settings, Save, CheckCircle2, Copy, Camera, ImageIcon, Upload
} from "lucide-react";
import { useForm } from "react-hook-form";
import ImageCropper from "@/components/ui/ImageCropper";
import Image from "next/image";

interface ClientDashboardTabsProps {
  order: any;
  inviteUrl: string;
}

export default function ClientDashboardTabs({ order, inviteUrl }: ClientDashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "kirim" | "settings">("overview");

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-white/10 hide-scrollbar">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "overview" 
                ? "border-[#D4A843] text-[#D4A843]" 
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            Overview & RSVP
          </button>
          <button
            onClick={() => setActiveTab("kirim")}
            className={`pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "kirim" 
                ? "border-[#D4A843] text-[#D4A843]" 
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            Kirim Undangan (WA)
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "settings" 
                ? "border-[#D4A843] text-[#D4A843]" 
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            Pengaturan Data Acara
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab order={order} inviteUrl={inviteUrl} />}
      {activeTab === "kirim" && <KirimUndanganTab order={order} inviteUrl={inviteUrl} />}
      {activeTab === "settings" && <SettingsTab order={order} />}
    </div>
  );
}

// ==========================================
// 1. OVERVIEW TAB
// ==========================================
function OverviewTab({ order, inviteUrl }: { order: any, inviteUrl: string }) {
  const attendingCount = order.guests
    .filter((g: any) => g.rsvpStatus === "ATTENDING")
    .reduce((sum: number, g: any) => sum + (g.rsvpGuestCount || 1), 0);

  const notAttendingCount = order.guests.filter((g: any) => g.rsvpStatus === "NOT_ATTENDING").length;

  const handleExportCSV = () => {
    window.location.href = `/api/client/export?orderId=${order.id}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section className="p-6 rounded-2xl bg-[#D4A843]/5 border border-[#D4A843]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/50 mb-1 font-[family-name:var(--font-body)]">Link Undangan Anda:</p>
          <a href={inviteUrl} target="_blank" rel="noreferrer" className="text-lg font-mono text-[#D4A843] hover:underline flex items-center gap-2">
            {inviteUrl} <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(inviteUrl);
            alert("Link disalin!");
          }}
          className="px-5 py-2.5 bg-[#D4A843] text-[#1a1510] text-sm font-semibold rounded-full hover:bg-[#FFD966] transition-all flex items-center gap-2"
        >
          <Copy className="w-4 h-4" /> Copy Link
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<Users className="text-emerald-400" />} label="Konfirmasi Hadir (Tamu)" value={attendingCount} />
        <StatCard icon={<Users className="text-red-400" />} label="Tidak Hadir" value={notAttendingCount} />
        <StatCard icon={<MessageSquare className="text-blue-400" />} label="Total Ucapan" value={order._count.guestbook} />
      </section>

      {/* RSVP Donut Chart */}
      {order.guests.length > 0 && (() => {
        const maybeCount = order.guests.filter((g: any) => g.rsvpStatus === "MAYBE").length;
        const pendingCount = order.guests.filter((g: any) => g.rsvpStatus === "PENDING").length;
        const total = order.guests.length;
        const segments = [
          { label: "Hadir", count: order.guests.filter((g: any) => g.rsvpStatus === "ATTENDING").length, color: "#34d399" },
          { label: "Tidak Hadir", count: notAttendingCount, color: "#f87171" },
          { label: "Mungkin", count: maybeCount, color: "#fbbf24" },
          { label: "Belum Respons", count: pendingCount, color: "#6b7280" },
        ].filter(s => s.count > 0);

        let accumulated = 0;
        const gradientParts = segments.map(s => {
          const start = (accumulated / total) * 100;
          accumulated += s.count;
          const end = (accumulated / total) * 100;
          return `${s.color} ${start}% ${end}%`;
        });

        return (
          <section className="bg-[#1a1510] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-[family-name:var(--font-display)] mb-4">Rekap RSVP</h3>
            <div className="flex items-center gap-8">
              <div
                className="w-32 h-32 rounded-full shrink-0 relative"
                style={{ background: `conic-gradient(${gradientParts.join(', ')})` }}
              >
                <div className="absolute inset-3 bg-[#1a1510] rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{total}</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {segments.map(s => (
                  <div key={s.label} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-white/60 flex-1">{s.label}</span>
                    <span className="text-white font-medium">{s.count}</span>
                    <span className="text-white/30 text-xs">({((s.count / total) * 100).toFixed(0)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RSVP Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-[family-name:var(--font-display)] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4A843]" /> Daftar RSVP
            </h3>
            <button 
              onClick={handleExportCSV}
              className="text-sm flex items-center gap-2 text-white/70 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
          <div className="bg-[#1a1510] border border-white/10 rounded-2xl overflow-hidden">
            {order.guests.length === 0 ? (
              <div className="p-8 text-center text-white/40 font-[family-name:var(--font-body)]">
                Belum ada tamu yang merespons.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-[family-name:var(--font-body)]">
                  <thead className="bg-white/5 text-white/40">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nama Tamu</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-center">Jml</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {order.guests.map((g: any) => (
                      <tr key={g.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <p className="font-medium">{g.name}</p>
                          <p className="text-xs text-white/30">{g.phone || "-"}</p>
                        </td>
                        <td className="px-4 py-3">
                          {g.rsvpStatus === "ATTENDING" && <span className="text-emerald-400 text-xs">Hadir</span>}
                          {g.rsvpStatus === "NOT_ATTENDING" && <span className="text-red-400 text-xs">Tidak Hadir</span>}
                          {g.rsvpStatus === "MAYBE" && <span className="text-yellow-400 text-xs">Mungkin</span>}
                        </td>
                        <td className="px-4 py-3 text-center">{g.rsvpStatus === "ATTENDING" ? g.rsvpGuestCount : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Guestbook List */}
        <section className="space-y-4">
          <h3 className="text-xl font-[family-name:var(--font-display)] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#D4A843]" /> Buku Tamu
          </h3>
          <div className="bg-[#1a1510] border border-white/10 rounded-2xl p-4 space-y-3">
            {order.guestbook.length === 0 ? (
              <div className="p-4 text-center text-white/40 font-[family-name:var(--font-body)]">
                Belum ada ucapan.
              </div>
            ) : (
              order.guestbook.map((msg: any) => (
                <div key={msg.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-sm">{msg.name}</p>
                    <p className="text-xs text-white/30">
                      {new Date(msg.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <p className="text-sm text-white/70 italic font-[family-name:var(--font-body)] leading-relaxed">
                    "{msg.message}"
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// ==========================================
// 2. KIRIM UNDANGAN TAB
// ==========================================
const TEMPLATES = {
  formal: `Kepada Yth. Bapak/Ibu/Saudara/i\n*[nama]*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.\n\n*Berikut link undangan kami:* \n[link-undangan]\n\nMerupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir. \nTerima kasih.`,
  islami: `Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nKepada Yth.\n*[nama]*\n\nBismillah. Dengan memohon ridho Allah SWT, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.\n\n*Detail Acara & Undangan Digital:* \n[link-undangan]\n\nKehadiran dan doa restu Anda adalah anugerah terindah bagi kami.\nWassalamu'alaikum Warahmatullahi Wabarakatuh`,
};

function KirimUndanganTab({ order, inviteUrl }: { order: any, inviteUrl: string }) {
  const [namesText, setNamesText] = useState("");
  const [template, setTemplate] = useState<keyof typeof TEMPLATES>("formal");
  const [hostName, setHostName] = useState("Kami yang berbahagia");
  const [generatedList, setGeneratedList] = useState<{name: string, url: string, message: string}[]>([]);

  const handleGenerate = () => {
    if (!namesText.trim()) return;
    
    const names = namesText.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    const results = names.map(name => {
      // URL Encoding for name parameter
      const guestUrl = `${inviteUrl}?to=${encodeURIComponent(name)}`;
      
      let message = TEMPLATES[template]
        .replace("[nama]", name)
        .replace("[link-undangan]", guestUrl);
      
      message += `\n\nSalam hangat,\n*${hostName}*`;

      return {
        name,
        url: guestUrl,
        message,
      };
    });

    setGeneratedList(results);
  };

  const handleShare = (msg: string) => {
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
      <div className="space-y-6">
        <div className="bg-[#1a1510] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-xl font-[family-name:var(--font-display)]">Generator Link WhatsApp</h3>
          
          <div>
            <label className="block text-sm text-white/70 mb-2 font-[family-name:var(--font-body)]">
              Yang Mengundang (Nama Panggilan/Keluarga)
            </label>
            <input 
              type="text" 
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A843] transition-colors text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2 font-[family-name:var(--font-body)]">
              Daftar Nama Tamu (Satu nama per baris)
            </label>
            <textarea 
              rows={6}
              value={namesText}
              onChange={(e) => setNamesText(e.target.value)}
              placeholder="Contoh:&#10;Bpk. Budi Santoso&#10;Keluarga Haryanto&#10;Andi & Partner"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4A843] transition-colors text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2 font-[family-name:var(--font-body)]">
              Pilihan Kata Pengantar
            </label>
            <div className="flex gap-2">
              <button 
                onClick={() => setTemplate("formal")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors border ${template === "formal" ? "bg-[#D4A843]/20 border-[#D4A843] text-[#D4A843]" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}
              >
                Formal
              </button>
              <button 
                onClick={() => setTemplate("islami")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors border ${template === "islami" ? "bg-[#D4A843]/20 border-[#D4A843] text-[#D4A843]" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}
              >
                Islami
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 text-sm text-white/50 italic whitespace-pre-line font-[family-name:var(--font-body)]">
            Preview Pengantar:
            <br/><br/>
            <span className="text-white/80">{TEMPLATES[template].replace("[nama]", "Nama Tamu").replace("[link-undangan]", inviteUrl + "?to=Nama+Tamu")}</span>
            <br/><br/>
            Salam hangat, <br/>
            {hostName}
          </div>

          <button 
            onClick={handleGenerate}
            className="w-full bg-[#D4A843] text-[#1a1510] font-semibold py-3 rounded-lg hover:bg-[#FFD966] transition-colors"
          >
            Buat Daftar Link
          </button>
        </div>
      </div>

      <div>
        {generatedList.length > 0 ? (
          <div className="bg-[#1a1510] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-[family-name:var(--font-display)] mb-4">Hasil Generate ({generatedList.length})</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {generatedList.map((guest, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center gap-4">
                  <div className="overflow-hidden">
                    <p className="font-medium text-white truncate">{guest.name}</p>
                    <p className="text-xs text-white/40 truncate">{guest.url}</p>
                  </div>
                  <button 
                    onClick={() => handleShare(guest.message)}
                    className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
                    title="Kirim ke WhatsApp"
                  >
                    <Send className="w-4 h-4 ml-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[300px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/30 p-8 text-center font-[family-name:var(--font-body)]">
            <Send className="w-12 h-12 mb-4 opacity-50" />
            <p>Masukkan daftar nama tamu dan klik "Buat Daftar Link" untuk melihat hasilnya di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. SETTINGS TAB (EDIT DATA)
// ==========================================
function SettingsTab({ order }: { order: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Photo upload + crop state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [cropTarget, setCropTarget] = useState<"cover" | "bride" | "groom">("cover");
  const [coverPreview, setCoverPreview] = useState("");
  const [bridePreview, setBridePreview] = useState("");
  const [groomPreview, setGroomPreview] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  let evt = order.eventData;
  if (typeof evt === "string") {
    try { evt = JSON.parse(evt); } catch (e) { evt = {}; }
  }

  const { register, handleSubmit } = useForm({
    defaultValues: {
      musicUrl: evt.musicUrl || "",
      bankName: evt.giftInfo?.bankAccounts?.[0]?.bank || "",
      bankNumber: evt.giftInfo?.bankAccounts?.[0]?.number || "",
      bankAccountName: evt.giftInfo?.bankAccounts?.[0]?.name || "",
    }
  });

  // Open file picker for a specific photo target
  const handlePhotoSelect = (target: "cover" | "bride" | "groom") => {
    setCropTarget(target);
    fileInputRef.current?.click();
  };

  // When file is selected, open cropper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropImageSrc(url);
    setCropModalOpen(true);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  // After crop, upload the blob
  const handleCropDone = async (blob: Blob) => {
    setCropModalOpen(false);
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", blob, `${cropTarget}.jpg`);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        if (cropTarget === "cover") setCoverPreview(url);
        else if (cropTarget === "bride") setBridePreview(url);
        else if (cropTarget === "groom") setGroomPreview(url);
      } else {
        alert("Gagal mengupload foto");
      }
    } catch {
      alert("Error uploading");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/client/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          musicUrl: data.musicUrl,
          bankName: data.bankName,
          bankNumber: data.bankNumber,
          bankAccountName: data.bankAccountName,
          coverPhoto: coverPreview || undefined,
          bridePhoto: bridePreview || undefined,
          groomPhoto: groomPreview || undefined,
        })
      });

      if(res.ok) {
        setSuccessMsg("Data berhasil diperbarui! Perubahan akan langsung tampil di undangan.");
      } else {
        alert("Gagal memperbarui data");
      }
    } catch(e) {
      alert("Error saving data");
    } finally {
      setIsLoading(false);
    }
  };

  const getCropAspect = () => {
    if (cropTarget === "cover") return 9 / 16; // portrait cover
    return 5 / 6; // portrait profile
  };

  return (
    <div className="max-w-2xl animate-in fade-in duration-300">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image Cropper Modal */}
      {cropModalOpen && cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          aspectRatio={getCropAspect()}
          cropShape={cropTarget === "cover" ? "rect" : "round"}
          onCropComplete={handleCropDone}
          onCancel={() => setCropModalOpen(false)}
          label={
            cropTarget === "cover" ? "Crop Foto Utama" :
            cropTarget === "bride" ? "Crop Foto Mempelai Wanita" :
            "Crop Foto Mempelai Pria"
          }
        />
      )}

      <div className="bg-[#1a1510] border border-white/10 rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-xl font-[family-name:var(--font-display)] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D4A843]" /> Pengaturan Data Acara
          </h3>
          <p className="text-sm text-white/50 mt-1 font-[family-name:var(--font-body)]">
            Ubah foto, backsound musik dan informasi rekening.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo Upload Section */}
          <div className="space-y-4">
            <h4 className="text-[#D4A843] text-sm font-semibold border-b border-white/10 pb-2 flex items-center gap-2">
              <Camera className="w-4 h-4" /> Foto Pengantin
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {/* Cover Photo */}
              <div className="space-y-2">
                <p className="text-xs text-white/50 text-center">Foto Utama</p>
                <button
                  type="button"
                  onClick={() => handlePhotoSelect("cover")}
                  className="w-full aspect-[9/16] rounded-xl border-2 border-dashed border-white/20 hover:border-[#D4A843]/50 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center overflow-hidden relative group"
                >
                  {coverPreview ? (
                    <>
                      <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6 text-white/30 mb-1" />
                      <span className="text-[10px] text-white/30">Upload</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bride Photo */}
              <div className="space-y-2">
                <p className="text-xs text-white/50 text-center">Mempelai Wanita</p>
                <button
                  type="button"
                  onClick={() => handlePhotoSelect("bride")}
                  className="w-full aspect-[5/6] rounded-xl border-2 border-dashed border-white/20 hover:border-[#D4A843]/50 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center overflow-hidden relative group"
                >
                  {bridePreview ? (
                    <>
                      <img src={bridePreview} alt="Bride" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6 text-white/30 mb-1" />
                      <span className="text-[10px] text-white/30">Upload</span>
                    </>
                  )}
                </button>
              </div>

              {/* Groom Photo */}
              <div className="space-y-2">
                <p className="text-xs text-white/50 text-center">Mempelai Pria</p>
                <button
                  type="button"
                  onClick={() => handlePhotoSelect("groom")}
                  className="w-full aspect-[5/6] rounded-xl border-2 border-dashed border-white/20 hover:border-[#D4A843]/50 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center overflow-hidden relative group"
                >
                  {groomPreview ? (
                    <>
                      <img src={groomPreview} alt="Groom" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6 text-white/30 mb-1" />
                      <span className="text-[10px] text-white/30">Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            {uploadingPhoto && (
              <p className="text-xs text-[#D4A843] text-center animate-pulse">Mengupload foto...</p>
            )}
            <p className="text-xs text-white/30 text-center">Klik untuk upload, lalu atur posisi foto sesuai keinginan.</p>
          </div>

          {/* Music URL */}
          <div className="space-y-4">
            <h4 className="text-[#D4A843] text-sm font-semibold border-b border-white/10 pb-2">Backsound Musik</h4>
            <div>
              <label className="block text-sm text-white/70 mb-2">URL Musik (MP3 / Link streaming valid)</label>
              <input 
                {...register("musicUrl")}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A843] text-white"
                placeholder="https://..."
              />
              <p className="text-xs text-white/40 mt-1">Gunakan link file .mp3 langsung untuk hasil terbaik.</p>
            </div>
          </div>

          {/* Bank info */}
          <div className="space-y-4">
            <h4 className="text-[#D4A843] text-sm font-semibold border-b border-white/10 pb-2">Informasi Amplop Digital (Rekening)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Nama Bank</label>
                <input 
                  {...register("bankName")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A843] text-white"
                  placeholder="Misal: BCA"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Nomor Rekening</label>
                <input 
                  {...register("bankNumber")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A843] text-white"
                  placeholder="Misal: 1234567890"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">Nama Pemilik Rekening</label>
              <input 
                {...register("bankAccountName")}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4A843] text-white"
                placeholder="Atas Nama"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#D4A843] text-[#1a1510] font-semibold rounded-lg hover:bg-[#FFD966] transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <div className="bg-[#1a1510] p-6 rounded-2xl border border-white/10 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-white/40 font-[family-name:var(--font-body)]">{label}</p>
        <p className="text-2xl font-bold font-[family-name:var(--font-display)]">{value}</p>
      </div>
    </div>
  );
}
