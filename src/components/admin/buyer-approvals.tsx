import { useState } from "react";
import { Check, Clock, Eye, ShieldCheck, UserCheck, UserRound, UserX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EmptyState, FilterBar, MetricCard, MobileCards, PageHeader, PaginationBar, Panel, PanelHead, SelectBox, StatusBadge, TableShell } from "./admin-ui";

type Group = "GO 1" | "GO 2";
type Request = { id: string; name: string; email: string; dnLine: string; idLine: string; group: Group; time: string };
type Decision = { request: Request; status: "Approved" | "Rejected"; decidedAt: string; reason?: string };

const initialPending: Request[] = [
  { id: "R-044", name: "Naya Azzahra", email: "naya.demo@gmail.com", dnLine: "Naya Azzahra", idLine: "naya_kpop", group: "GO 1", time: "2 Nov 2026, 09:02" },
  { id: "R-043", name: "Kevin Aditya", email: "kevin.aditya@gmail.com", dnLine: "Kevin Aditya", idLine: "kevin_go23", group: "GO 2", time: "1 Nov 2026, 20:15" },
  { id: "R-042", name: "Nabila Sari", email: "nabila.sari@gmail.com", dnLine: "Nabila", idLine: "bila.sr", group: "GO 1", time: "1 Nov 2026, 14:40" },
];
const initialHistory: Decision[] = [
  { request: { id: "R-041", name: "Maya Putri", email: "maya.putri@gmail.com", dnLine: "Maya Putri", idLine: "mayaputrii", group: "GO 1", time: "28 Okt 2026, 11:30" }, status: "Approved", decidedAt: "28 Okt 2026, 10:12" },
  { request: { id: "R-040", name: "Dita Anggraini", email: "dita.anggraini@gmail.com", dnLine: "Dita", idLine: "dita.ang", group: "GO 2", time: "27 Okt 2026, 16:05" }, status: "Approved", decidedAt: "27 Okt 2026, 17:44" },
  { request: { id: "R-038", name: "Farel Pratama", email: "farel.p@gmail.com", dnLine: "Farel Pratama", idLine: "farel_pr", group: "GO 2", time: "26 Okt 2026, 09:18" }, status: "Rejected", decidedAt: "27 Okt 2026, 09:30", reason: "ID LINE tidak ditemukan di grup LINE CECIZ." },
];

const initials = (name: string) => name.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase();
const pendingBadge = <span className="inline-flex w-fit items-center rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-strong">Menunggu ACC</span>;

export function BuyerApprovalsPage() {
  const [pending, setPending] = useState<Request[]>(initialPending);
  const [history, setHistory] = useState<Decision[]>(initialHistory);
  const [group, setGroup] = useState("");
  const [historyStatus, setHistoryStatus] = useState("");
  const [detail, setDetail] = useState<Request | null>(null);
  const [rejecting, setRejecting] = useState<Request | null>(null);
  const [reason, setReason] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  const shownPending = pending.filter(r => !group || r.group === group);
  const shownHistory = history.filter(d => (!historyStatus || d.status === historyStatus) && (!group || d.request.group === group));

  const approve = (request: Request, fromDetail = false) => {
    setPending(list => list.filter(r => r.id !== request.id));
    setHistory(list => [{ request, status: "Approved", decidedAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) + ", " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }, ...list]);
    setFlash(`Akun ${request.name} di-ACC. Buyer sudah bisa mengakses dashboard buyer.`);
    if (fromDetail) setDetail(null);
  };
  const openReject = (request: Request, fromDetail = false) => {
    if (fromDetail) setDetail(null);
    setReason("");
    setRejecting(request);
  };
  const confirmReject = () => {
    if (!rejecting) return;
    const request = rejecting;
    setPending(list => list.filter(r => r.id !== request.id));
    setHistory(list => [{ request, status: "Rejected", decidedAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) + ", " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), reason: reason || "Tidak memenuhi syarat verifikasi." }, ...list]);
    setFlash(`Pengajuan ${request.name} ditolak${reason ? `: ${reason}` : "."}`);
    setRejecting(null);
  };

  const act = (r: Request) => <div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => setDetail(r)}><Eye /> Detail</Button><Button size="sm" variant="outline" className="text-success" onClick={() => approve(r)}><Check /> ACC</Button><Button size="sm" variant="outline" className="text-danger" onClick={() => openReject(r)}><X /> Tolak</Button></div>;

  return <>
    <PageHeader title="Approval Akun Buyer" description="Verifikasi pengajuan akun buyer baru (DN LINE, ID LINE, Group) sebelum mereka bisa mengakses dashboard buyer." />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Menunggu ACC" value={String(pending.length)} detail="Pengajuan akun baru" icon={Clock} tone="cream" />
      <MetricCard label="Disetujui" value={String(history.filter(d => d.status === "Approved").length)} detail="Akun buyer aktif" icon={UserCheck} tone="green" />
      <MetricCard label="Ditolak" value={String(history.filter(d => d.status === "Rejected").length)} detail="Tidak terverifikasi di grup" icon={UserX} tone="rose" />
      <MetricCard label="Total buyer terdaftar" value={String(history.length + pending.length)} detail="Termasuk yang menunggu" icon={UserRound} />
    </div>

    {flash && <Panel className="mt-5 border-success/40 bg-success-soft/30"><div className="flex items-start justify-between gap-3 px-5 py-4"><p className="text-sm font-semibold text-success">{flash}</p><Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" aria-label="Tutup pesan" onClick={() => setFlash(null)}><X /></Button></div></Panel>}

    <FilterBar placeholder="Search nama, email, atau ID LINE...">
      <SelectBox label="Group" options={["GO 1", "GO 2"]} />
      <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground"><span className="sr-only">Group</span>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring" value={group} onChange={e => setGroup(e.target.value)} aria-label="Filter group">
          <option value="">Semua group</option><option>GO 1</option><option>GO 2</option>
        </select>
      </label>
    </FilterBar>

    <Panel>
      <PanelHead title="Menunggu Persetujuan" subtitle={`${shownPending.length} pengajuan akun buyer baru`} action={<Button size="sm" variant="outline" onClick={() => setPending(initialPending)}><ShieldCheck /> Reset data contoh</Button>} />
      {shownPending.length === 0 ? <EmptyState /> : <>
        <div className="hidden md:block"><TableShell columns={["Buyer", "Email Google", "DN LINE", "ID LINE", "Group", "Diajukan", "Status", "Action"]} rows={shownPending.map(r => [
          <div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">{initials(r.name)}</div><strong>{r.name}</strong></div>,
          r.email, r.dnLine, r.idLine, r.group, <span className="text-xs text-muted-foreground">{r.time}</span>, pendingBadge, act(r),
        ])} /></div>
        <div className="p-4 md:hidden"><MobileCards items={shownPending.map(r => ({ title: r.name, subtitle: r.email, action: pendingBadge, rows: [{ label: "DN LINE", value: r.dnLine }, { label: "ID LINE", value: r.idLine }, { label: "Group", value: r.group }, { label: "Diajukan", value: r.time }], className: "flex flex-col" }))} />
          <div className="mt-3 grid gap-2">{shownPending.map(r => <div key={r.id} className="flex gap-2">{act(r)}</div>)}</div>
        </div>
      </>}
      <div className="px-4 pb-4 md:px-5"><PaginationBar count={`1–${Math.max(shownPending.length, 1)} of ${pending.length}`} /></div>
    </Panel>

    <Panel className="mt-5">
      <PanelHead title="Riwayat Keputusan" subtitle="Akun yang sudah di-ACC atau ditolak" action={
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={historyStatus} onChange={e => setHistoryStatus(e.target.value)} aria-label="Filter status riwayat">
          <option value="">Semua status</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option>
        </select>} />
      <div className="hidden md:block"><TableShell columns={["Buyer", "Email Google", "DN / ID LINE", "Group", "Diajukan", "Status", "Diputuskan", "Alasan"]} rows={shownHistory.map(d => [
        <strong>{d.request.name}</strong>, d.request.email, `${d.request.dnLine} / ${d.request.idLine}`, d.request.group,
        <span className="text-xs text-muted-foreground">{d.request.time}</span>, <StatusBadge status={d.status} />,
        <span className="text-xs text-muted-foreground">{d.decidedAt}</span>,
        d.reason ? <span className="text-xs text-danger">{d.reason}</span> : <span className="text-xs text-muted-foreground">—</span>,
      ])} /></div>
      <div className="p-4 md:hidden"><MobileCards items={shownHistory.map(d => ({ title: d.request.name, subtitle: d.request.email, action: <StatusBadge status={d.status} />, rows: [{ label: "DN / ID LINE", value: `${d.request.dnLine} / ${d.request.idLine}` }, { label: "Group", value: d.request.group }, { label: "Diputuskan", value: d.decidedAt }, ...(d.reason ? [{ label: "Alasan", value: d.reason }] : [])] }))} /></div>
    </Panel>

    <Sheet open={!!detail} onOpenChange={o => !o && setDetail(null)}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader><SheetTitle>Detail Pengajuan · {detail?.id}</SheetTitle><SheetDescription>Data yang diisi buyer setelah login dengan Google.</SheetDescription></SheetHeader>
        {detail && <div className="mt-6 grid gap-4">
          <div className="flex items-center gap-3 rounded-lg bg-primary-soft/45 p-4"><div className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">{initials(detail.name)}</div><div><p className="font-bold">{detail.name}</p><p className="text-xs text-muted-foreground">{detail.email}</p></div></div>
          {[["DN LINE", detail.dnLine], ["ID LINE", detail.idLine], ["Group", detail.group], ["Diajukan", detail.time]].map(([k, v]) => <div key={k} className="flex items-center justify-between rounded-lg border p-4"><span className="text-xs font-semibold text-muted-foreground">{k}</span><strong className="text-sm">{v}</strong></div>)}
          <div className="rounded-lg bg-warning-soft p-4 text-sm"><p className="font-semibold">Sebelum menyetujui</p><p className="mt-1 text-muted-foreground">Cocokkan DN &amp; ID LINE dengan daftar member grup LINE CECIZ. Buyer hanya bisa mengakses dashboard setelah di-ACC admin.</p></div>
          <div className="flex gap-2"><Button variant="outline" className="flex-1 text-danger" onClick={() => openReject(detail, true)}><X /> Tolak</Button><Button className="flex-1" onClick={() => approve(detail, true)}><Check /> ACC akun</Button></div>
        </div>}
      </SheetContent>
    </Sheet>

    <Dialog open={!!rejecting} onOpenChange={o => { if (!o) setRejecting(null); }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Tolak pengajuan akun</DialogTitle><DialogDescription>{rejecting ? `${rejecting.name} · ${rejecting.email}` : ""} Buyer akan melihat status pengajuan ditolak beserta alasan ini.</DialogDescription></DialogHeader>
        <label className="grid gap-1.5"><span className="text-xs font-semibold">Alasan penolakan</span><Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Contoh: ID LINE tidak ditemukan di grup LINE CECIZ." rows={3} /></label>
        <DialogFooter><Button variant="outline" onClick={() => setRejecting(null)}>Batal</Button><Button className="bg-danger text-danger-foreground hover:bg-danger/90" onClick={confirmReject}><UserX /> Tolak pengajuan</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </>;
}
