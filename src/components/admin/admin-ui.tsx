import { Link, useRouterState } from "@tanstack/react-router";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  Archive, BadgeDollarSign, BarChart3, Bell, Boxes, Calculator, ChevronLeft, ChevronRight,
  CircleDollarSign, ClipboardCheck, FileBarChart, FileText, LayoutDashboard, Menu, PackageCheck,
  ReceiptText, Search, Settings, ShieldCheck, SlidersHorizontal, Truck, UserRound, WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Role = "Owner" | "Staff";
type NavTo = "/" | "/batches" | "/payments" | "/tracking" | "/tax" | "/album-orders" | "/cashflow" | "/reports" | "/settings" | "/roles";
type NavItem = { label: string; to: NavTo; icon: typeof LayoutDashboard; ownerOnly?: boolean };

const navSections: { label: string; items: NavItem[] }[] = [
  { label: "Overview", items: [{ label: "Dashboard", to: "/", icon: LayoutDashboard }] },
  { label: "Operations", items: [
    { label: "Batch & Harga", to: "/batches", icon: Calculator },
    { label: "Verifikasi Pembayaran", to: "/payments", icon: ClipboardCheck },
    { label: "Tracking", to: "/tracking", icon: Truck },
    { label: "Tagihan Tax", to: "/tax", icon: ReceiptText },
    { label: "PO Album / CO Web", to: "/album-orders", icon: PackageCheck },
    { label: "Cashflow", to: "/cashflow", icon: WalletCards, ownerOnly: true },
  ]},
  { label: "Reports", items: [
    { label: "Laba GO", to: "/reports", icon: BarChart3, ownerOnly: true },
    { label: "Gaji Admin", to: "/reports", icon: BadgeDollarSign, ownerOnly: true },
    { label: "Rekap Pembayaran", to: "/reports", icon: FileBarChart, ownerOnly: true },
  ]},
  { label: "System", items: [
    { label: "Settings", to: "/settings", icon: Settings, ownerOnly: true },
    { label: "Roles & Permissions", to: "/roles", icon: ShieldCheck, ownerOnly: true },
  ]},
];

const RoleContext = createContext<{ role: Role; setRole: (role: Role) => void }>({ role: "Owner", setRole: () => {} });
export const useAdminRole = () => useContext(RoleContext);

function Mark({ small = false }: { small?: boolean }) {
  return <div className={cn("grid place-items-center rounded-xl bg-primary font-extrabold text-primary-foreground shadow-brand", small ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm")}>CG</div>;
}

function RoleSwitch() {
  const { role, setRole } = useAdminRole();
  return (
    <div className="grid grid-cols-2 rounded-lg bg-muted p-1" aria-label="Current prototype role">
      {(["Owner", "Staff"] as const).map((item) => (
        <button key={item} onClick={() => setRole(item)} className={cn("rounded-md px-2 py-1.5 text-xs font-semibold transition", role === item ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}>{item}</button>
      ))}
    </div>
  );
}

function NavLinks({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role } = useAdminRole();
  return <nav className="space-y-5">{navSections.map((section) => {
    const items = section.items.filter((item) => role === "Owner" || !item.ownerOnly);
    if (!items.length) return null;
    return <div key={section.label}>
      {!collapsed && <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">{section.label}</p>}
      <div className="space-y-1">{items.map((item) => {
        const Icon = item.icon;
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return <Link key={item.label} to={item.to} onClick={onNavigate} title={collapsed ? item.label : undefined} className={cn("flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors", active ? "bg-primary-soft text-primary-strong" : "text-sidebar-foreground hover:bg-accent", collapsed && "justify-center px-0")}>
          <Icon className="h-[18px] w-[18px] shrink-0" />{!collapsed && <span className="truncate">{item.label}</span>}
        </Link>;
      })}</div>
    </div>;
  })}</nav>;
}

function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items: NavItem[] = [
    { label: "Home", to: "/", icon: LayoutDashboard }, { label: "Batch", to: "/batches", icon: Boxes },
    { label: "Bayar", to: "/payments", icon: ClipboardCheck }, { label: "Tracking", to: "/tracking", icon: Truck },
  ];
  return <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-card/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
    {items.slice(0, 2).map((item) => <BottomItem key={item.to} {...item} active={pathname === item.to} />)}
    <Sheet><SheetTrigger asChild><Button variant="default" size="icon" className="mx-auto h-11 w-11 rounded-full" aria-label="Open all modules"><Menu /></Button></SheetTrigger><SheetContent side="bottom" className="max-h-[82vh] overflow-y-auto rounded-t-2xl"><SheetHeader><SheetTitle>All modules</SheetTitle><SheetDescription>CECIZ GO admin workspace</SheetDescription></SheetHeader><div className="mt-5"><NavLinks /></div></SheetContent></Sheet>
    {items.slice(2).map((item) => <BottomItem key={item.to} {...item} active={pathname.startsWith(item.to)} />)}
  </nav>;
}
function BottomItem({ label, to, icon: Icon, active }: NavItem & { active: boolean }) { return <Link to={to} className={cn("flex min-w-0 flex-col items-center gap-1 text-[11px] font-semibold", active ? "text-primary-strong" : "text-muted-foreground")}><Icon className="h-5 w-5" /><span className="truncate">{label}</span></Link>; }

export function AdminShell({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Owner");
  const [collapsed, setCollapsed] = useState(false);
  return <RoleContext.Provider value={{ role, setRole }}><div className="min-h-screen bg-background">
    <aside className={cn("fixed inset-y-0 left-0 z-40 hidden border-r bg-sidebar transition-[width] duration-200 lg:flex lg:flex-col", collapsed ? "w-[76px]" : "w-[252px]")}>
      <div className={cn("flex h-20 items-center border-b", collapsed ? "justify-center" : "gap-3 px-5")}><Mark />{!collapsed && <div><p className="font-extrabold text-foreground">CECIZ GO</p><p className="text-xs text-muted-foreground">Admin workspace</p></div>}</div>
      <div className="flex-1 overflow-y-auto px-3 py-5"><NavLinks collapsed={collapsed} /></div>
      <div className="border-t p-3">{!collapsed && <div className="mb-3"><RoleSwitch /></div>}<Button variant="ghost" size="sm" className="w-full" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <ChevronRight /> : <><ChevronLeft /> Collapse</>}</Button></div>
    </aside>
    <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[76px]" : "lg:pl-[252px]")}>
      <header className="sticky top-0 z-30 grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center border-b bg-background/90 px-4 backdrop-blur md:px-7">
        <div className="flex min-w-0 items-center gap-3 lg:hidden"><Mark small /><div className="min-w-0"><p className="truncate text-sm font-extrabold">CECIZ GO</p><p className="text-[11px] text-muted-foreground">Admin workspace</p></div></div>
        <div className="hidden max-w-md lg:block"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input className="bg-muted/55 pl-9 shadow-none" placeholder="Search batch, buyer, resi..." /></div></div>
        <div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Notifications" className="relative"><Bell/><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive"/></Button><div className="hidden h-8 w-px bg-border sm:block"/><div className="hidden items-center gap-2 sm:flex"><div className="grid h-9 w-9 place-items-center rounded-full bg-secondary font-bold text-secondary-foreground">NA</div><div><p className="text-xs font-semibold">Nadia A.</p><p className="text-[11px] text-muted-foreground">{role}</p></div></div></div>
      </header>
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[1560px] px-4 pb-24 pt-6 md:px-7 lg:pb-8">{children}</main>
    </div><MobileNav />
  </div></RoleContext.Provider>;
}

export function PageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4"><div className="min-w-0"><h1 className="text-2xl font-extrabold text-foreground md:text-[28px]">{title}</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p></div>{action && <div className="shrink-0">{action}</div>}</div>; }
export function Panel({ children, className }: { children: ReactNode; className?: string }) { return <section className={cn("rounded-xl border bg-card shadow-panel", className)}>{children}</section>; }
export function PanelHead({ title, subtitle, action }: { title: string; subtitle?: string | undefined; action?: ReactNode }) { return <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-4 md:px-5"><div className="min-w-0"><h2 className="font-bold">{title}</h2>{subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}</div>{action}</div>; }
export function MetricCard({ label, value, icon: Icon, tone = "blue", detail }: { label:string; value:string; icon:typeof Boxes; tone?:"blue"|"cream"|"green"|"rose"; detail?:string }) { return <Panel className="p-4 md:p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-extrabold">{value}</p>{detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}</div><div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg", tone === "blue" && "bg-primary-soft text-primary-strong", tone === "cream" && "bg-secondary text-secondary-foreground", tone === "green" && "bg-success-soft text-success", tone === "rose" && "bg-danger-soft text-danger")}><Icon className="h-5 w-5"/></div></div></Panel>; }

export function StatusBadge({ status }: { status: string }) {
 const key = status.toLowerCase();
 const tone = key.includes("reject") || key.includes("cancel") ? "danger" : key.includes("approved") || key.includes("done") || key.includes("completed") || key.includes("admin") ? "success" : key.includes("otw") || key.includes("progress") ? "warning" : key.includes("pending") || key.includes("open") || key.includes("warehouse") || key.includes("arrive wh") ? "info" : "neutral";
 return <span className={cn("inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold", tone === "danger" && "bg-danger-soft text-danger", tone === "success" && "bg-success-soft text-success", tone === "warning" && "bg-warning-soft text-warning", tone === "info" && "bg-primary-soft text-primary-strong", tone === "neutral" && "bg-muted text-muted-foreground")}>{status}</span>;
}
export function CountryBadge({ country }: { country: string }) { const flags: Record<string,string> = { CH:"🇨🇳", KR:"🇰🇷", TH:"🇹🇭", JP:"🇯🇵", INA:"🇮🇩" }; return <span className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-xs font-bold"><span>{flags[country]}</span>{country}</span>; }

export function FilterBar({ children, placeholder = "Search records..." }: { children?: ReactNode; placeholder?: string }) { return <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center"><div className="relative min-w-0 flex-1 sm:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input className="pl-9" placeholder={placeholder}/></div><div className="hidden flex-wrap gap-2 md:flex">{children}</div><Sheet><SheetTrigger asChild><Button variant="outline" className="md:hidden"><SlidersHorizontal/> Filter</Button></SheetTrigger><SheetContent side="bottom" className="rounded-t-2xl"><SheetHeader><SheetTitle>Filter records</SheetTitle><SheetDescription>Narrow the list by the fields below.</SheetDescription></SheetHeader><div className="mt-5 grid gap-3">{children}</div><Button className="mt-5 w-full">Apply filters</Button></SheetContent></Sheet></div>; }
export function SelectBox({ label, options }: { label: string; options: string[] }) { return <label className="grid gap-1.5 text-xs font-semibold text-muted-foreground"><span className="sr-only">{label}</span><select className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring" defaultValue=""><option value="">{label}</option>{options.map(x => <option key={x}>{x}</option>)}</select></label>; }
export function Field({ label, placeholder, type="text" }: { label:string; placeholder?:string | undefined; type?:string }) { return <label className="grid gap-1.5"><span className="text-xs font-semibold text-foreground">{label}</span><Input type={type} placeholder={placeholder}/></label>; }
export function FormSection({ title, description, children }: { title:string; description?:string; children:ReactNode }) { return <Panel><PanelHead title={title} subtitle={description}/><div className="grid gap-4 p-4 sm:grid-cols-2 md:p-5 lg:grid-cols-3">{children}</div></Panel>; }
export function TableShell({ columns, rows }: { columns:string[]; rows:ReactNode[][] }) { return <div className="hidden overflow-hidden rounded-lg border md:block"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-table-header text-xs text-muted-foreground"><tr>{columns.map(c=><th key={c} className="px-4 py-3 font-semibold">{c}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i} className="border-t transition-colors hover:bg-primary-soft/35">{r.map((cell,j)=><td key={j} className="px-4 py-3.5">{cell}</td>)}</tr>)}</tbody></table></div></div>; }
export function MobileCards({ items }: { items: { title:string; subtitle?:ReactNode; rows:{ label:string; value:ReactNode }[]; action?:ReactNode }[] }) { return <div className="grid gap-3 md:hidden">{items.map((item,i)=><Panel key={i} className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{item.title}</h3>{item.subtitle && <div className="mt-1 text-xs text-muted-foreground">{item.subtitle}</div>}</div>{item.action}</div><dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">{item.rows.map((r,j)=><div key={j}><dt className="text-[11px] text-muted-foreground">{r.label}</dt><dd className="mt-0.5 text-sm font-medium">{r.value}</dd></div>)}</dl></Panel>)}</div>; }
export function PaginationBar({ count="1–5 of 24" }: { count?:string }) { return <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground"><span>{count}</span><div className="flex gap-1"><Button size="icon" variant="outline" className="h-8 w-8" aria-label="Previous page"><ChevronLeft/></Button><Button size="icon" variant="outline" className="h-8 w-8" aria-label="Next page"><ChevronRight/></Button></div></div>; }
export const EmptyState = () => <div className="grid place-items-center px-6 py-14 text-center"><Archive className="mb-3 h-8 w-8 text-muted-foreground"/><p className="font-semibold">No records found</p><p className="mt-1 text-sm text-muted-foreground">Try changing your filters.</p></div>;
