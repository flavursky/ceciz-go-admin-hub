# CECIZ GO Admin Prototype

## Goal
Build a high-fidelity, responsive internal operations workspace using realistic mock data only. The interface will use CECIZ GO terminology and clearly separate buyer-facing values from internal financial information.

## Experience
- Persistent, collapsible desktop sidebar with role-aware Owner and Staff navigation.
- Compact mobile header and bottom navigation at 375px and above.
- Clear attention queues, country/status badges, concise filters, mobile card views, and desktop tables.
- Soft blue, warm cream, white, and pastel status styling based on the supplied visual identity.

## Pages and workflows
1. **Dashboard** — key operational counts, country batch activity chart, payment status, and recent activity.
2. **Batch & Harga** — searchable batch list, create-batch country selector, country-aware mock fields, buyer results, and collapsed internal calculations.
3. **Payment Verification** — filtered queue, proof preview, approve action, and reject-reason dialog.
4. **Tracking** — shipment filters, status progression, editable warehouse/resi/notes, and archive actions.
5. **Tax** — period summary, multi-batch records, invoice actions, and detailed breakdown drawer.
6. **PO Album / CO Web** — album orders and checkout-state tracking.
7. **Cashflow** — balance summaries, transaction filters/table, and add-transaction dialog.
8. **Reports** — Laba GO, Gaji Admin, and Rekap Pembayaran tabs with mock charts and export controls.
9. **Settings** — fee, currency rate, penalty, tax, and storage-duration forms.
10. **Roles & Permissions** — staff account list and module permission matrix.

## Technical approach
- TanStack Start route structure with one shareable route per major module and route-specific metadata.
- Reusable shell, badges, filters, tables, dialogs, drawers, form sections, and chart wrappers.
- React state for prototype interactions; no backend, authentication, production payments, or invented formulas.
- Mock role switcher demonstrates role-aware navigation and staff restrictions.
- Validate key interactions and desktop/mobile layouts in the live preview.
