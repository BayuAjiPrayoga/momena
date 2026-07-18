"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Loader2, Tag } from "lucide-react";

interface PackageItem {
  id: string;
  name: string;
  price: number;
  maxGuests: number;
  maxPhotos: number;
  maxRevisions: number;
  activeDays: number;
  features: any;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const emptyForm = { name: "", price: 0, maxGuests: 100, maxPhotos: 5, maxRevisions: 1, activeDays: 365, features: {} };
  const [form, setForm] = useState<any>(emptyForm);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/admin/packages");
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/admin/packages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setEditingId(null);
        setShowAddForm(false);
        setForm(emptyForm);
        fetchPackages();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menyimpan");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus paket ini?")) return;
    try {
      const res = await fetch(`/api/admin/packages?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchPackages();
      else alert("Gagal menghapus. Paket mungkin sedang digunakan.");
    } catch {
      alert("Terjadi kesalahan");
    }
  };

  const startEdit = (pkg: PackageItem) => {
    setEditingId(pkg.id);
    setForm({ name: pkg.name, price: pkg.price, maxGuests: pkg.maxGuests, maxPhotos: pkg.maxPhotos, maxRevisions: pkg.maxRevisions, activeDays: pkg.activeDays, features: pkg.features });
    setShowAddForm(true);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-gray-900">Paket & Harga</h1>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-gray-900 font-medium rounded-lg hover:bg-[#FFD966] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Tambah Paket
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">{editingId ? "Edit Paket" : "Tambah Paket Baru"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nama Paket</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]" placeholder="Starter" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Harga (Rp)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Maks. Tamu</label>
              <input type="number" value={form.maxGuests} onChange={(e) => setForm({ ...form, maxGuests: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Maks. Foto</label>
              <input type="number" value={form.maxPhotos} onChange={(e) => setForm({ ...form, maxPhotos: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Maks. Revisi</label>
              <input type="number" value={form.maxRevisions} onChange={(e) => setForm({ ...form, maxRevisions: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Hari Aktif</label>
              <input type="number" value={form.activeDays} onChange={(e) => setForm({ ...form, activeDays: parseInt(e.target.value) || 365 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A843]" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={saving || !form.name} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-gray-900 font-medium rounded-lg hover:bg-[#FFD966] transition text-sm disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId ? "Simpan Perubahan" : "Tambah"}
            </button>
            <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
              <X className="w-4 h-4 inline mr-1" /> Batal
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-medium">Paket</th>
                <th className="px-6 py-4 font-medium">Harga</th>
                <th className="px-6 py-4 font-medium">Maks. Tamu</th>
                <th className="px-6 py-4 font-medium">Maks. Foto</th>
                <th className="px-6 py-4 font-medium">Revisi</th>
                <th className="px-6 py-4 font-medium">Hari Aktif</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packages.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Belum ada paket.</td></tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2"><Tag className="w-4 h-4 text-[#D4A843]" /> {pkg.name}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">Rp {pkg.price.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4">{pkg.maxGuests.toLocaleString()}</td>
                    <td className="px-6 py-4">{pkg.maxPhotos}</td>
                    <td className="px-6 py-4">{pkg.maxRevisions}x</td>
                    <td className="px-6 py-4">{pkg.activeDays} hari</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(pkg)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(pkg.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
