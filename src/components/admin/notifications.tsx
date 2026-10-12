import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState<number[]>([]);
  const notices = [
    { id: 1, title: "Pembayaran CH-025 menunggu verifikasi", description: "Maya Putri · Rp 685.000", to: "/payments" as const },
    { id: 2, title: "Tracking KR-127 · OTW Indonesia", description: "THRUTHANAMOON KR", to: "/tracking" as const },
    { id: 3, title: "Tagihan tax September", description: "Talia N. · Pending", to: "/tax" as const },
  ];
  const unread = notices.filter(n => !read.includes(n.id)).length;
  return <><Button variant="ghost" size="icon" aria-label={`Notifications (${unread} belum dibaca)`} onClick={() => setOpen(true)} className="relative"><Bell/>{unread > 0 && <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-destructive text-[10px] text-destructive-foreground">{unread}</span>}</Button><Sheet open={open} onOpenChange={setOpen}><SheetContent className="overflow-y-auto"><SheetHeader><SheetTitle>Notifikasi</SheetTitle><SheetDescription>{unread} belum dibaca</SheetDescription></SheetHeader><Button variant="outline" size="sm" className="my-5" disabled={!unread} onClick={() => setRead(notices.map(n => n.id))}><CheckCheck/> Tandai semua dibaca</Button><div className="divide-y">{notices.map(n => <Link key={n.id} to={n.to} onClick={() => { setRead(r => r.includes(n.id) ? r : [...r, n.id]); setOpen(false); }} className={`block px-3 py-4 ${read.includes(n.id) ? "text-muted-foreground" : "bg-primary-soft/40"}`}><p className="text-sm font-semibold">{n.title}</p><p className="mt-1 text-xs text-muted-foreground">{n.description}</p></Link>)}</div></SheetContent></Sheet></>;
}