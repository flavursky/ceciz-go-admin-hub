import { useState } from "react";
import { Link2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Panel, PanelHead, StatusBadge } from "./admin-ui";

export function CheckoutLinkSettings() {
  const [form, setForm] = useState({ gform: "https://forms.gle/", shopee: "https://shopee.co.id/", start: "2026-10-12", end: "2026-10-18", gformOpen: true, shopeeOpen: true });
  const [saved, setSaved] = useState(form);
  const today = new Date().toISOString().slice(0, 10);
  const inPeriod = today >= saved.start && today <= saved.end;
  const live = (open: boolean) => <StatusBadge status={open && inPeriod ? "Open" : "Closed"} />;
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Panel className="mb-5">
      <PanelHead title="Link Checkout Buyer" subtitle="Atur kapan link Google Form & checkout Shopee tampil di sisi buyer" action={<Link2 className="h-5 w-5 text-primary" />} />
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <label className="grid gap-1.5"><span className="text-xs font-semibold">Link Google Form</span><Input value={form.gform} onChange={e => set("gform", e.target.value)} placeholder="https://forms.gle/..." /></label>
        <label className="grid gap-1.5"><span className="text-xs font-semibold">Link checkout Shopee</span><Input value={form.shopee} onChange={e => set("shopee", e.target.value)} placeholder="https://shopee.co.id/..." /></label>
        <label className="grid gap-1.5"><span className="text-xs font-semibold">Mulai (WIB)</span><Input type="date" value={form.start} onChange={e => set("start", e.target.value)} /></label>
        <label className="grid gap-1.5"><span className="text-xs font-semibold">Selesai (WIB)</span><Input type="date" value={form.end} onChange={e => set("end", e.target.value)} /></label>
        <label className="flex items-center justify-between rounded-lg border p-3 text-sm font-semibold">Google Form dibuka<Switch checked={form.gformOpen} onCheckedChange={v => set("gformOpen", v)} /></label>
        <label className="flex items-center justify-between rounded-lg border p-3 text-sm font-semibold">Shopee dibuka<Switch checked={form.shopeeOpen} onCheckedChange={v => set("shopeeOpen", v)} /></label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3 text-sm">
        <div className="flex flex-wrap items-center gap-3"><span className="text-muted-foreground">Status di buyer:</span><span className="flex items-center gap-1.5">Google Form {live(saved.gformOpen)}</span><span className="flex items-center gap-1.5">Shopee {live(saved.shopeeOpen)}</span></div>
        <Button size="sm" disabled={form.start > form.end} onClick={() => setSaved(form)}><Save /> Simpan & terapkan</Button>
      </div>
    </Panel>
  );
}
