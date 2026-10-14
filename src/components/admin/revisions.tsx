import { useState } from "react";
import { Calculator, ChevronDown, Eye, MoreHorizontal, Pencil, Plus, Save, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PeriodFeesPanel } from "./period-fees";
import { batchRecords, eligibleProfitBatch, sellingDifference } from "./period-rules";
import { CountryBadge, MobileCards, TableShell, Panel, PanelHead, StatusBadge } from "./admin-ui";

export const rp = (n: number) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;
const num = (v: string) => Number(v) || 0;

/* ---------- Batch row actions ---------- */
export const batchStatuses = ["Open", "Closed", "Archived"];
export function BatchActions({ status, onEdit, onStatus, onCalc }: { status: string; onEdit: () => void; onStatus: (s: string) => void; onCalc: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Batch actions"><MoreHorizontal /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}><Pencil /> Edit batch</DropdownMenuItem>
        <DropdownMenuItem onClick={onCalc}><Calculator /> Hitung Internal Calculation</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><Tag className="mr-2 h-4 w-4" /> Edit status batch</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={status} onValueChange={onStatus}>{batchStatuses.map(s => <DropdownMenuRadioItem key={s} value={s}>{s}</DropdownMenuRadioItem>)}</DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const internalFields = ["Total Harga Jual", "Harga TF Seller", "Tagihan PC", "Tagihan freebies", "Harga CO Shopee", "Harga tagihan WH", "Pemasukan tax", "Selisih tax", "Laba kotor", "Laba bersih"];
export function InternalCalcDialog({ batch, arrived, onClose, onSave }: { batch: string | null; arrived: boolean; onClose: () => void; onSave: (laba: number) => void }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const selisih = sellingDifference(num(vals["Total Harga Jual"] ?? ""), num(vals["Harga TF Seller"] ?? ""));
  return (
    <Dialog open={!!batch} onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle>Internal Calculation · {batch}</DialogTitle><DialogDescription>Dihitung setelah barang tiba di Indonesia. Hanya terlihat oleh admin.</DialogDescription></DialogHeader>
        {!arrived && <div className="rounded-lg bg-warning-soft p-3 text-sm">Barang batch ini belum berstatus Arrive Indonesia. Internal calculation sebaiknya diisi setelah barang tiba di INA.</div>}
        <div className="grid gap-3 sm:grid-cols-2">
          {internalFields.map(f => <label key={f} className="grid gap-1.5"><span className="text-xs font-semibold">{f} (Rp)</span><Input type="number" value={vals[f] ?? ""} onChange={e => setVals(v => ({ ...v, [f]: e.target.value }))} placeholder="0" /></label>)}
          <div className="rounded-lg bg-primary-soft/60 p-3 sm:col-span-2"><p className="text-xs text-muted-foreground">Selisih (Total Harga Jual − Total TF Seller) · otomatis</p><p className="mt-1 text-lg font-extrabold">{rp(selisih)}</p></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Batal</Button><Button onClick={() => { onSave(num(vals["Laba bersih"] ?? "")); setVals({}); }}><Save /> Simpan & tandai terhitung</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- PO Album / CO Web ---------- */
type AlbumRow = { member: string; harga: string; nama: string; dp: string; doneDp: boolean; fp: string; doneFp: boolean; note: string };
type AlbumBatch = { id: number; batch: string; item: string; type: string; rows: AlbumRow[] };
const emptyAlbum = (): AlbumRow => ({ member: "", harga: "", nama: "", dp: "", doneDp: false, fp: "", doneFp: false, note: "" });
const initialAlbums: AlbumBatch[] = [
  { id: 1, batch: "KR-ALB-07", item: "CATBBI Album Ver.", type: "PO Album", rows: [
    { member: "CATBBI", harga: "305000", nama: "@adeline", dp: "205000", doneDp: true, fp: "100000", doneFp: true, note: "" },
    { member: "CATBBI", harga: "305000", nama: "@Circe", dp: "207000", doneDp: true, fp: "100000", doneFp: true, note: "denda 2k dp" },
    { member: "CATBBI", harga: "305000", nama: "@yeppii", dp: "205000", doneDp: true, fp: "", doneFp: false, note: "" },
  ] },
  { id: 2, batch: "JP-ALB-03", item: "SKZ Japan Album", type: "CO Web", rows: [
    { member: "Felix", harga: "280000", nama: "@rania", dp: "180000", doneDp: true, fp: "100000", doneFp: false, note: "" },
  ] },
];
function AlbumEditor({ value, onSave, onClose }: { value: AlbumBatch; onSave: (a: AlbumBatch) => void; onClose: () => void }) {
  const [a, setA] = useState(value);
  const up = (i: number, k: keyof AlbumRow, v: string | boolean) => setA(x => ({ ...x, rows: x.rows.map((r, j) => j === i ? { ...r, [k]: v } : r) }));
  const cell = "h-8 min-w-24 text-sm";
  return <>
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="grid gap-1.5"><span className="text-xs font-semibold">Batch Album</span><Input value={a.batch} onChange={e => setA({ ...a, batch: e.target.value })} /></label>
      <label className="grid gap-1.5"><span className="text-xs font-semibold">Item / Album</span><Input value={a.item} onChange={e => setA({ ...a, item: e.target.value })} /></label>
      <label className="grid gap-1.5"><span className="text-xs font-semibold">Tipe</span><select className="h-9 rounded-md border bg-background px-3 text-sm" value={a.type} onChange={e => setA({ ...a, type: e.target.value })}><option>PO Album</option><option>CO Web</option></select></label>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-table-header text-xs"><tr>{["Fix Member", "Harga", "Nama", "DP", "Done DP", "FP", "Done FP", "Catatan", ""].map(h => <th key={h} className="px-2 py-2 text-left font-semibold">{h}</th>)}</tr></thead>
        <tbody>{a.rows.map((r, i) => <tr key={i} className="border-b">
          <td className="p-1"><Input className={cell} value={r.member} onChange={e => up(i, "member", e.target.value)} /></td>
          <td className="p-1"><Input className={cell} type="number" value={r.harga} onChange={e => up(i, "harga", e.target.value)} /></td>
          <td className="p-1"><Input className={cell} value={r.nama} onChange={e => up(i, "nama", e.target.value)} placeholder="@username" /></td>
          <td className="p-1"><Input className={cell} type="number" value={r.dp} onChange={e => up(i, "dp", e.target.value)} /></td>
          <td className="p-1 text-center"><Checkbox checked={r.doneDp} onCheckedChange={c => up(i, "doneDp", !!c)} aria-label="Done DP" /></td>
          <td className="p-1"><Input className={cell} type="number" value={r.fp} onChange={e => up(i, "fp", e.target.value)} /></td>
          <td className="p-1 text-center"><Checkbox checked={r.doneFp} onCheckedChange={c => up(i, "doneFp", !!c)} aria-label="Done FP" /></td>
          <td className="p-1"><Input className={cell} value={r.note} onChange={e => up(i, "note", e.target.value)} /></td>
          <td className="p-1"><Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Hapus baris" onClick={() => setA(x => ({ ...x, rows: x.rows.filter((_, j) => j !== i) }))}><Trash2 /></Button></td>
        </tr>)}</tbody>
      </table>
    </div>
    <DialogFooter className="sm:justify-between"><Button variant="outline" size="sm" onClick={() => setA(x => ({ ...x, rows: [...x.rows, emptyAlbum()] }))}><Plus /> Tambah baris</Button><div className="flex gap-2"><Button variant="outline" onClick={onClose}>Batal</Button><Button disabled={!a.batch.trim()} onClick={() => onSave(a)}><Save /> Simpan & tampilkan di buyer</Button></div></DialogFooter>
  </>;
}
export function AlbumOrdersPanel() {
  const [albums, setAlbums] = useState(initialAlbums);
  const [filter, setFilter] = useState("Semua batch album");
  const [detail, setDetail] = useState<AlbumBatch | null>(null);
  const [editing, setEditing] = useState<AlbumBatch | null>(null);
  const shown = albums.filter(a => filter === "Semua batch album" || a.batch === filter);
  const stats = (a: AlbumBatch) => ({ dp: a.rows.filter(r => r.doneDp).length, fp: a.rows.filter(r => r.doneFp).length });
  const actions = (a: AlbumBatch) => <div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => setDetail(a)}><Eye /> Detail</Button><Button size="icon" variant="ghost" aria-label={`Edit ${a.batch}`} onClick={() => setEditing(a)}><Pencil /></Button></div>;
  return <>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <select aria-label="Filter batch album" className="h-9 rounded-md border bg-background px-3 text-sm" value={filter} onChange={e => setFilter(e.target.value)}>{["Semua batch album", ...albums.map(a => a.batch)].map(b => <option key={b}>{b}</option>)}</select>
      <Button onClick={() => setEditing({ id: 0, batch: "", item: "", type: "PO Album", rows: [emptyAlbum()] })}><Plus /> Add Album Order</Button>
    </div>
    <Panel><PanelHead title="Album Order per Batch" subtitle="Klik detail untuk melihat dan update pembayaran DP / FP" /><div className="p-4">
      <TableShell columns={["Batch Album", "Item", "Tipe", "Buyer", "Done DP", "Done FP", "Action"]} rows={shown.map(a => [<strong>{a.batch}</strong>, a.item, a.type, a.rows.length, `${stats(a).dp}/${a.rows.length}`, `${stats(a).fp}/${a.rows.length}`, actions(a)])} />
      <MobileCards items={shown.map(a => ({ title: a.batch, subtitle: a.item, action: actions(a), rows: [{ label: "Tipe", value: a.type }, { label: "Buyer", value: a.rows.length }, { label: "Done DP", value: `${stats(a).dp}/${a.rows.length}` }, { label: "Done FP", value: `${stats(a).fp}/${a.rows.length}` }] }))} />
    </div></Panel>
    <Dialog open={detail !== null} onOpenChange={o => { if (!o) setDetail(null); }}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{detail?.batch} · {detail?.item}</DialogTitle><DialogDescription>{detail?.type}</DialogDescription></DialogHeader>{detail && <>
      <TableShell columns={["Member", "Harga", "Nama", "DP", "Done DP", "FP", "Done FP", "Catatan"]} rows={detail.rows.map(r => [r.member, rp(num(r.harga)), r.nama, rp(num(r.dp)), <StatusBadge status={r.doneDp ? "Done" : "Pending"} />, rp(num(r.fp)), <StatusBadge status={r.doneFp ? "Done" : "Pending"} />, r.note || "—"])} />
      <MobileCards items={detail.rows.map(r => ({ title: r.nama || "—", subtitle: r.member, rows: [{ label: "Harga", value: rp(num(r.harga)) }, { label: "DP", value: `${rp(num(r.dp))} ${r.doneDp ? "✓" : ""}` }, { label: "FP", value: `${rp(num(r.fp))} ${r.doneFp ? "✓" : ""}` }, { label: "Catatan", value: r.note || "—" }] }))} />
      <DialogFooter><Button onClick={() => { setEditing(detail); setDetail(null); }}><Pencil /> Edit / Update DP-FP</Button></DialogFooter></>}</DialogContent></Dialog>
    <Dialog open={editing !== null} onOpenChange={o => { if (!o) setEditing(null); }}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl"><DialogHeader><DialogTitle>{editing?.id ? `Edit ${editing.batch}` : "Input PO Album / CO Web"}</DialogTitle><DialogDescription>Data ini akan tampil di sisi buyer</DialogDescription></DialogHeader>{editing && <AlbumEditor key={editing.id} value={editing} onClose={() => setEditing(null)} onSave={a => { setAlbums(all => a.id ? all.map(x => x.id === a.id ? a : x) : [...all, { ...a, id: Date.now() }]); setEditing(null); }} />}</DialogContent></Dialog>
  </>;
}

/* ---------- Laba GO per periode ---------- */
export function LabaGoPanel() {
  const eligible = batchRecords.filter(eligibleProfitBatch);
  const [history, setHistory] = useState([{ id: 1, name: "Agustus 2026", from: "2026-08-01", to: "2026-08-31", batches: "CH-022, KR-017", income: 328232, costs: 100000, net: 228232, notes: "Periode contoh sebelumnya" }]);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("TAX 1-3");
  const [from, setFrom] = useState("2026-09-01");
  const [to, setTo] = useState("2026-09-30");
  const [sel, setSel] = useState<string[]>(["CH-022", "KR-017"]);
  const [packing, setPacking] = useState("304506");
  const [lain, setLain] = useState("57697");
  const [lainNote, setLainNote] = useState("desain logo commis");
  const [pctA, setPctA] = useState("80");
  const [pctB, setPctB] = useState("20");
  const [tabungan, setTabungan] = useState("0");
  const modal = num(packing) + num(lain);
  const chosen = eligible.filter(b => sel.includes(b.batch));
  const pemasukan = chosen.reduce((s, b) => s + (b.laba ?? 0), 0);
  const bersih = pemasukan - modal;
  const rows: [string, string, string][] = [
    ["Total beli bahan packing", rp(num(packing)), "modal packing"],
    ["Pengeluaran lain", rp(num(lain)), lainNote],
    ["Total Modal Keseluruhan", rp(modal), "Total semua biaya"],
    ["Total Laba Keseluruhan (Pemasukan)", rp(pemasukan), `Dari ${chosen.length} batch terpilih`],
    ["Laba Bersih", rp(bersih), "Pemasukan − Modal"],
    ["Gaji Admin A", rp(pemasukan * num(pctA) / 100), `${pctA}%`],
    ["Gaji Admin B", rp(pemasukan * num(pctB) / 100), `${pctB}%`],
    ["Tabungan GO", rp(pemasukan * num(tabungan) / 100), `${tabungan}%`],
  ];
  const f = (label: string, value: string, set: (v: string) => void, type = "number", span = "") => <label className={`grid gap-1.5 ${span}`}><span className="text-xs font-semibold">{label}</span><Input type={type} value={value} onChange={e => set(e.target.value)} /></label>;
  return (
    <>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_1fr]">
      <Panel>
        <PanelHead title="Input Laba per Periode" subtitle="Batch diambil dari data batch: laba bersih sudah terhitung & tracking Done / Arrived INA / tagihan diceklis" />
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {f("Nama periode", name, setName, "text")}{f("Dari tanggal", from, setFrom, "date")}{f("Sampai tanggal", to, setTo, "date")}
        </div>
        <div className="grid gap-2 border-t p-4">
          <span className="text-xs font-semibold">Batch</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline" className="justify-between font-normal">{chosen.length ? `${chosen.length} batch dipilih · ${rp(pemasukan)}` : "Pilih batch..."}<ChevronDown /></Button></DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]" align="start">
              <DropdownMenuLabel className="text-xs">Batch siap dihitung ({eligible.length})</DropdownMenuLabel>
              {eligible.map(b => <DropdownMenuCheckboxItem key={b.batch} checked={sel.includes(b.batch)} onSelect={e => e.preventDefault()} onCheckedChange={c => setSel(s => c ? [...s, b.batch] : s.filter(x => x !== b.batch))}><span className="font-semibold">{b.batch}</span><span className="ml-2 text-xs text-muted-foreground">{b.tracking}{b.bill ? " · tagihan ✓" : ""}</span><span className="ml-auto pl-3 font-bold">{rp(b.laba ?? 0)}</span></DropdownMenuCheckboxItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
          {chosen.length > 0 && <div className="flex flex-wrap gap-1.5">{chosen.map(b => <span key={b.batch} className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold"><CountryBadge country={b.country} />{b.batch} · {rp(b.laba ?? 0)}</span>)}</div>}
        </div>
        <div className="grid gap-3 border-t p-4 sm:grid-cols-2">
          {f("Total beli bahan packing (Rp)", packing, setPacking)}{f("Pengeluaran lain (Rp)", lain, setLain)}
          {f("Keterangan pengeluaran lain", lainNote, setLainNote, "text", "sm:col-span-2")}
          {f("Pembagian Gaji Admin A (%)", pctA, setPctA)}{f("Pembagian Gaji Admin B (%)", pctB, setPctB)}
          {f("Sisihan Tabungan GO (%)", tabungan, setTabungan)}{f("Keterangan Periode", notes, setNotes, "text")}
        </div>
      </Panel>
      <Panel>
        <PanelHead title={name || "Periode"} subtitle={`${from} s/d ${to}`} action={<Button size="sm" disabled={!name.trim() || !from || !to || !chosen.length || from > to} onClick={() => setHistory(h => [{ id: Date.now(), name, from, to, batches: chosen.map(b => b.batch).join(", "), income: pemasukan, costs: modal, net: bersih, notes }, ...h])}><Save /> Simpan periode</Button>} />
        <div className="divide-y">{rows.map(([k, v, n]) => <div key={k} className="grid grid-cols-[1.2fr_1fr] gap-2 px-5 py-3 text-sm sm:grid-cols-[1.3fr_1fr_1fr]"><span className="font-semibold">{k}</span><strong className="text-right sm:text-left">{v}</strong><span className="col-span-2 text-xs text-muted-foreground sm:col-span-1">{n}</span></div>)}</div>
      </Panel>
    </div>
    <div className="mt-5"><h2 className="mb-3 font-bold">Riwayat Laba per Periode</h2><TableShell columns={["Periode", "Tanggal", "Batch", "Pemasukan", "Modal", "Laba Bersih", "Keterangan"]} rows={history.map(h => [<strong>{h.name}</strong>, `${h.from} s/d ${h.to}`, h.batches, rp(h.income), rp(h.costs), <strong>{rp(h.net)}</strong>, h.notes || "—"])}/><MobileCards items={history.map(h => ({ title: h.name, subtitle: `${h.from} s/d ${h.to}`, rows: [{ label: "Batch", value: h.batches }, { label: "Pemasukan", value: rp(h.income) }, { label: "Modal", value: rp(h.costs) }, { label: "Laba Bersih", value: rp(h.net) }, { label: "Keterangan", value: h.notes || "—" }] }))}/></div>
    </>
  );
}

export const GajiAdminPanel = PeriodFeesPanel;
