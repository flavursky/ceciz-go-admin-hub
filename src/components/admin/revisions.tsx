import { useState } from "react";
import { Calculator, EyeOff, MoreHorizontal, Pencil, Plus, Save, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PeriodFeesPanel } from "./period-fees";
import { eligibleProfitBatch } from "./period-rules";
import { CountryBadge, MetricCard, MobileCards, TableShell, Panel, PanelHead, StatusBadge } from "./admin-ui";

export const rp = (n: number) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;
const num = (v: string) => Number(v) || 0;

/* ---------- Batch row actions ---------- */
export function BatchActions({ hidden, onEdit, onToggleHide, onCalc }: { hidden: boolean; onEdit: () => void; onToggleHide: () => void; onCalc: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Batch actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}><Pencil /> Edit batch</DropdownMenuItem>
        <DropdownMenuItem onClick={onCalc}><Calculator /> Hitung Internal Calculation</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onToggleHide}>{hidden ? <><Eye /> Tampilkan batch</> : <><EyeOff /> Hide batch</>}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const internalFields = ["Harga TF Seller", "Tagihan PC", "Tagihan freebies", "Harga CO Shopee", "Harga tagihan WH", "Pemasukan tax", "Selisih tax", "Laba kotor", "Laba bersih"];
export function InternalCalcDialog({ batch, arrived, onClose, onSave }: { batch: string | null; arrived: boolean; onClose: () => void; onSave: (laba: number) => void }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  return (
    <Dialog open={!!batch} onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle>Internal Calculation · {batch}</DialogTitle><DialogDescription>Dihitung setelah barang tiba di Indonesia. Hanya terlihat oleh admin.</DialogDescription></DialogHeader>
        {!arrived && <div className="rounded-lg bg-warning-soft p-3 text-sm">Barang batch ini belum berstatus Arrive Indonesia. Internal calculation sebaiknya diisi setelah barang tiba di INA.</div>}
        <div className="grid gap-3 sm:grid-cols-2">
          {internalFields.map(f => <label key={f} className="grid gap-1.5"><span className="text-xs font-semibold">{f} (Rp)</span><Input type="number" value={vals[f] ?? ""} onChange={e => setVals(v => ({ ...v, [f]: e.target.value }))} placeholder="0" /></label>)}
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Batal</Button><Button onClick={() => { onSave(num(vals["Laba bersih"] ?? "")); setVals({}); }}><Save /> Simpan & tandai terhitung</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- PO Album input (spreadsheet-like) ---------- */
type AlbumRow = { member: string; harga: string; nama: string; dp: string; doneDp: boolean; fp: string; doneFp: boolean; note: string };
const emptyAlbum = (): AlbumRow => ({ member: "", harga: "", nama: "", dp: "", doneDp: false, fp: "", doneFp: false, note: "" });
export function AlbumInputPanel({ onClose }: { onClose: () => void }) {
  const [batch, setBatch] = useState("KR-ALB-07");
  const [item, setItem] = useState("CATBBI Album Ver.");
  const [rows, setRows] = useState<AlbumRow[]>([
    { member: "CATBBI", harga: "305000", nama: "@adeline", dp: "205000", doneDp: true, fp: "100000", doneFp: true, note: "" },
    { member: "CATBBI", harga: "305000", nama: "@Circe", dp: "207000", doneDp: true, fp: "100000", doneFp: true, note: "denda 2k dp" },
    { member: "CATBBI", harga: "305000", nama: "@yeppii", dp: "205000", doneDp: true, fp: "", doneFp: false, note: "" },
  ]);
  const [published, setPublished] = useState(false);
  const up = (i: number, k: keyof AlbumRow, v: string | boolean) => { setRows(r => r.map((x, j) => j === i ? { ...x, [k]: v } : x)); setPublished(false); };
  const cell = "h-8 min-w-24 text-sm";
  return (
    <Panel className="mb-5">
      <PanelHead title="Input PO Album / CO Web" subtitle="Data ini akan tampil di sisi buyer" action={<Button size="sm" variant="ghost" onClick={onClose}>Tutup</Button>} />
      <div className="grid gap-3 border-b p-4 sm:grid-cols-3">
        <label className="grid gap-1.5"><span className="text-xs font-semibold">Batch</span><Input value={batch} onChange={e => setBatch(e.target.value)} /></label>
        <label className="grid gap-1.5"><span className="text-xs font-semibold">Item / Album</span><Input value={item} onChange={e => setItem(e.target.value)} /></label>
        <label className="grid gap-1.5"><span className="text-xs font-semibold">Tipe</span><select className="h-9 rounded-md border bg-background px-3 text-sm"><option>PO Album</option><option>CO Web</option></select></label>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead className="bg-table-header text-xs"><tr>{["Fix Member", "Harga", "Nama", "DP", "Done DP", "FP", "Done FP", "Catatan", ""].map(h => <th key={h} className="px-2 py-2 text-left font-semibold">{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i} className="border-b">
            <td className="p-1"><Input className={cell} value={r.member} onChange={e => up(i, "member", e.target.value)} /></td>
            <td className="p-1"><Input className={cell} type="number" value={r.harga} onChange={e => up(i, "harga", e.target.value)} /></td>
            <td className="p-1"><Input className={cell} value={r.nama} onChange={e => up(i, "nama", e.target.value)} placeholder="@username" /></td>
            <td className="p-1"><Input className={cell} type="number" value={r.dp} onChange={e => up(i, "dp", e.target.value)} /></td>
            <td className="p-1 text-center"><Checkbox checked={r.doneDp} onCheckedChange={c => up(i, "doneDp", !!c)} aria-label="Done DP" /></td>
            <td className="p-1"><Input className={cell} type="number" value={r.fp} onChange={e => up(i, "fp", e.target.value)} /></td>
            <td className="p-1 text-center"><Checkbox checked={r.doneFp} onCheckedChange={c => up(i, "doneFp", !!c)} aria-label="Done FP" /></td>
            <td className="p-1"><Input className={cell} value={r.note} onChange={e => up(i, "note", e.target.value)} /></td>
            <td className="p-1"><Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Hapus baris" onClick={() => setRows(x => x.filter((_, j) => j !== i))}><Trash2 /></Button></td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t p-4">
        <Button variant="outline" size="sm" onClick={() => setRows(r => [...r, emptyAlbum()])}><Plus /> Tambah baris</Button>
        <div className="flex items-center gap-3">{published && <span className="text-xs font-semibold text-success">Terkirim ke buyer side ({rows.length} buyer)</span>}<Button size="sm" onClick={() => setPublished(true)}><Save /> Simpan & tampilkan di buyer</Button></div>
      </div>
    </Panel>
  );
}

/* ---------- Laba GO per periode ---------- */
const doneBatches = [
  { batch: "CH-022", country: "CH", status: "Done", calculated: true, laba: 185400 },
  { batch: "KR-017", country: "KR", status: "Done", calculated: true, laba: 142832 },
  { batch: "JP-012", country: "JP", status: "Done", calculated: true, laba: 99000 },
  { batch: "TH-009", country: "TH", status: "Done", calculated: true, laba: 76500 },
  { batch: "CH-025", country: "CH", status: "Open", calculated: false, laba: 0 },
];
export function LabaGoPanel() {
  const [history, setHistory] = useState([{ id: 1, name: "Agustus 2026", from: "2026-08-01", to: "2026-08-31", batches: "CH-022, KR-017", income: 328232, costs: 100000, net: 228232, notes: "Periode contoh sebelumnya" }]);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("TAX 1-3");
  const [from, setFrom] = useState("2026-09-01");
  const [to, setTo] = useState("2026-09-30");
  const [sel, setSel] = useState<string[]>(["CH-022", "KR-017", "JP-012"]);
  const [packing, setPacking] = useState("304506");
  const [lain, setLain] = useState("57697");
  const [lainNote, setLainNote] = useState("desain logo commis");
  const [pctA, setPctA] = useState("80");
  const [pctB, setPctB] = useState("20");
  const [tabungan, setTabungan] = useState("0");
  const modal = num(packing) + num(lain);
  const pemasukan = doneBatches.filter(b => eligibleProfitBatch(b) && sel.includes(b.batch)).reduce((s, b) => s + b.laba, 0);
  const bersih = pemasukan - modal;
  const rows: [string, string, string][] = [
    ["Total beli bahan packing", rp(num(packing)), "modal packing"],
    ["Pengeluaran lain", rp(num(lain)), lainNote],
    ["Total Modal Keseluruhan", rp(modal), "Total semua biaya"],
    ["Total Laba Keseluruhan (Pemasukan)", rp(pemasukan), `Dari ${sel.length} batch terpilih`],
    ["Laba Bersih", rp(bersih), "Pemasukan − Modal"],
    ["Gaji Admin A", rp(pemasukan * num(pctA) / 100), `${pctA}%`],
    ["Gaji Admin B", rp(pemasukan * num(pctB) / 100), `${pctB}%`],
    ["Tabungan GO", rp(pemasukan * num(tabungan) / 100), `${tabungan}%`],
  ];
  return (
    <>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_1fr]">
      <Panel>
        <PanelHead title="Input Laba per Periode" subtitle="Pilih batch berstatus Done yang laba bersihnya sudah terhitung" />
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          <label className="grid gap-1.5"><span className="text-xs font-semibold">Nama periode</span><Input value={name} onChange={e => setName(e.target.value)} /></label>
          <label className="grid gap-1.5"><span className="text-xs font-semibold">Dari tanggal</span><Input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label>
          <label className="grid gap-1.5"><span className="text-xs font-semibold">Sampai tanggal</span><Input type="date" value={to} onChange={e => setTo(e.target.value)} /></label>
        </div>
        <div className="grid gap-2 border-t p-4">
          <p className="text-xs font-bold uppercase text-muted-foreground">Batch</p>
          {doneBatches.map(b => { const ok = eligibleProfitBatch(b); return (
            <label key={b.batch} className={`flex items-center gap-3 rounded-lg border p-2.5 ${ok ? "cursor-pointer" : "opacity-50"}`}>
              <Checkbox disabled={!ok} checked={sel.includes(b.batch)} onCheckedChange={c => setSel(s => c ? [...s, b.batch] : s.filter(x => x !== b.batch))} />
              <strong className="text-sm">{b.batch}</strong><CountryBadge country={b.country} /><StatusBadge status={b.status} />
              <span className="ml-auto text-sm font-bold">{ok ? rp(b.laba) : "Belum terhitung"}</span>
            </label>); })}
        </div>
        <div className="grid gap-3 border-t p-4 sm:grid-cols-2">
          <label className="grid gap-1.5"><span className="text-xs font-semibold">Total beli bahan packing (Rp)</span><Input type="number" value={packing} onChange={e => setPacking(e.target.value)} /></label>
          <label className="grid gap-1.5"><span className="text-xs font-semibold">Pengeluaran lain (Rp)</span><Input type="number" value={lain} onChange={e => setLain(e.target.value)} /></label>
          <label className="grid gap-1.5 sm:col-span-2"><span className="text-xs font-semibold">Keterangan pengeluaran lain</span><Input value={lainNote} onChange={e => setLainNote(e.target.value)} /></label>
          <label className="grid gap-1.5"><span className="text-xs font-semibold">Pembagian Gaji Admin A (%)</span><Input type="number" value={pctA} onChange={e => setPctA(e.target.value)} /></label>
          <label className="grid gap-1.5"><span className="text-xs font-semibold">Pembagian Gaji Admin B (%)</span><Input type="number" value={pctB} onChange={e => setPctB(e.target.value)} /></label>
          <label className="grid gap-1.5 sm:col-span-2"><span className="text-xs font-semibold">Keterangan Periode</span><Input value={notes} onChange={e => setNotes(e.target.value)} /></label>
          <label className="grid gap-1.5"><span className="text-xs font-semibold">Sisihan Tabungan GO (%)</span><Input type="number" value={tabungan} onChange={e => setTabungan(e.target.value)} /></label>
        </div>
      </Panel>
      <Panel>
        <PanelHead title={name || "Periode"} subtitle={`${from} s/d ${to}`} action={<Button size="sm" disabled={!name.trim() || !from || !to || !sel.length || from > to} onClick={() => setHistory(h => [{ id: Date.now(), name, from, to, batches: sel.join(", "), income: pemasukan, costs: modal, net: bersih, notes }, ...h])}><Save /> Simpan periode</Button>} />
        <div className="divide-y">{rows.map(([k, v, n]) => <div key={k} className="grid grid-cols-[1.2fr_1fr] gap-2 px-5 py-3 text-sm sm:grid-cols-[1.3fr_1fr_1fr]"><span className="font-semibold">{k}</span><strong className="text-right sm:text-left">{v}</strong><span className="col-span-2 text-xs text-muted-foreground sm:col-span-1">{n}</span></div>)}</div>
      </Panel>
    </div>
    <div className="mt-5"><h2 className="mb-3 font-bold">Riwayat Laba per Periode</h2><TableShell columns={["Periode", "Tanggal", "Batch", "Pemasukan", "Modal", "Laba Bersih", "Keterangan"]} rows={history.map(h => [<strong>{h.name}</strong>, `${h.from} s/d ${h.to}`, h.batches, rp(h.income), rp(h.costs), <strong>{rp(h.net)}</strong>, h.notes || "—"])}/><MobileCards items={history.map(h => ({ title: h.name, subtitle: `${h.from} s/d ${h.to}`, rows: [{ label: "Batch", value: h.batches }, { label: "Pemasukan", value: rp(h.income) }, { label: "Modal", value: rp(h.costs) }, { label: "Laba Bersih", value: rp(h.net) }, { label: "Keterangan", value: h.notes || "—" }] }))}/></div>
    </>
  );
}

export const GajiAdminPanel = PeriodFeesPanel;
