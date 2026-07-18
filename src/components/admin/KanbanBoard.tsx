"use client";

import { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { ExternalLink, CreditCard, Clock, CalendarDays } from "lucide-react";

type Order = any; // We'll use the raw object for simplicity in this demo

const COLUMNS = [
  { id: "NEW", title: "Baru", color: "border-blue-200 bg-blue-50/50" },
  { id: "PENDING_PAYMENT", title: "Menunggu Bayar", color: "border-amber-200 bg-amber-50/50" },
  { id: "ACTIVE", title: "Aktif", color: "border-emerald-200 bg-emerald-50/50" },
  { id: "COMPLETED", title: "Selesai", color: "border-gray-200 bg-gray-50/50" },
];

export default function KanbanBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const orderId = active.id as string;
    const newStatus = over.id as string;

    const activeOrder = orders.find((o) => o.id === orderId);
    if (!activeOrder || activeOrder.status === newStatus) return;

    // Verify it's dropping into a column (not another card)
    if (!COLUMNS.find(c => c.id === newStatus)) {
        // If they drop on another card, find the column of that card
        const overOrder = orders.find(o => o.id === newStatus);
        if(overOrder) {
            handleMove(orderId, overOrder.status);
        }
        return;
    }

    handleMove(orderId, newStatus);
  };

  const handleMove = async (orderId: string, newStatus: string) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");
    } catch (err) {
      alert("Gagal memindahkan pesanan");
      // Revert in real app, but for now we just show an alert
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.id);
          return (
            <div key={col.id} className="min-w-[320px] max-w-[320px] snap-center">
              <div className={`rounded-xl border ${col.color} p-4 flex flex-col h-full min-h-[500px]`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 font-[family-name:var(--font-display)]">{col.title}</h3>
                  <span className="bg-white px-2 py-1 rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-100">
                    {colOrders.length}
                  </span>
                </div>

                <SortableContext id={col.id} items={colOrders} strategy={verticalListSortingStrategy}>
                  <div className="flex-1 space-y-3">
                    {colOrders.map((order) => (
                      <KanbanCard key={order.id} order={order} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </div>
          );
        })}
      </DndContext>
    </div>
  );
}

function KanbanCard({ order }: { order: Order }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: order.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative"
    >
      <div className="flex justify-between items-start mb-2">
        <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs font-semibold text-blue-600 hover:underline z-10 relative">
          {order.orderNumber}
        </Link>
        <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
          {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
        </span>
      </div>
      
      <p className="font-medium text-gray-900 text-sm mb-1">{order.customer.name}</p>
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
        <CalendarDays className="w-3 h-3" /> {order.theme.name}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
          <CreditCard className="w-3 h-3 text-[#D4A843]" />
          Rp {(order.package.price / 1000).toFixed(0)}k
        </div>
        
        {order.status === "ACTIVE" && (
           <Link href={`/client/${order.id}`} target="_blank" className="text-purple-600 bg-purple-50 p-1.5 rounded-md hover:bg-purple-100 transition z-10 relative" title="Panel Klien">
             <ExternalLink className="w-3 h-3" />
           </Link>
        )}
      </div>
    </div>
  );
}
