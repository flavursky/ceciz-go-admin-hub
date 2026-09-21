# CECIZ GO Hub

CECIZ GO — ADMIN SIDE MANAGEMENT SYSTEM PROTOTYPE

Build a polished, responsive internal Admin Management System for CECIZ GO, a K-pop merchandise Group Order business.

This is the ADMIN SIDE of a larger integrated CECIZ GO system.

A separate Buyer Side exists. Both systems will eventually use the same PocketBase backend/database and share the same business entities.

The Admin Side is for internal staff/admin/owner operations.

For this first stage, build a high-fidelity UI/UX prototype using realistic mock data.

Do NOT implement complicated business calculations yet.

Do NOT invent calculation formulas.

Focus on creating a strong, coherent admin interface based on the PRD.

1. PRODUCT CONTEXT

CECIZ GO manages group orders for K-pop merchandise across:

China (CH)

Korea (KR)

Thailand (TH)

Japan (JP)

Indonesia (INA)

The admin system is designed to replace manual spreadsheet/chat workflows.

Current problems:

Manual batch price calculation

Manual tracking updates

Manual payment verification

Manual tax calculation

Manual admin fee calculation

Manual profit calculation

Manual cashflow tracking

Difficult monitoring of many batches

Internal data scattered across spreadsheets

The Admin Side should become the central operational workspace.

2. DESIGN DIRECTION

The interface should feel like:

Soft K-pop business operations dashboard

not:

generic SaaS dashboard

overly corporate ERP

dark developer dashboard

spreadsheet clone

Use the following visual identity.

Primary:

#84B2E6

Secondary:

#EBE3C7

Action blue:

#83B2E6

Light gray:

#E5E7EB

Table header:

#F5F5F5

Background:

#FFFFFF

Text:

#1F2937

Secondary text:

#6B7280

Use soft borders, subtle shadows, rounded corners, clean typography, generous spacing, and clear status badges.

The overall visual language should be compatible with the Buyer Side.

The two systems should clearly feel like:

CECIZ GO

but their information architecture should be different.

3. VISUAL REFERENCE

Use the following website only as inspiration for softness and K-pop GO aesthetic:

https://gobychona.store/id

Do NOT copy:

exact layout

logo

assets

content

branding

proprietary UI

Use only the general visual feeling as inspiration.

4. ADMIN USER

The system supports different internal users.

Conceptually include:

Owner

Staff

The final system will use role/permission controls.

For the prototype, create realistic role-aware navigation.

Important:

The sidebar should only show modules the current role can access.

Do not hardcode all users as owners.

5. ADMIN LAYOUT

Desktop:

Left sidebar
+
Top header
+
Main content

Sidebar should contain:

Overview

Dashboard

Operations

Batch & Harga

Verifikasi Pembayaran

Tracking

Tagihan Tax

PO Album / CO Web

Cashflow

Reports

Laba GO

Gaji Admin

Rekap Pembayaran

System

Settings

Roles & Permissions

The sidebar should be collapsible.

On mobile:

Use a compact top navigation and/or bottom navigation.

Do not force the desktop sidebar onto a 375px screen.

6. ADMIN DASHBOARD

Create a clean operational overview.

Header:

"Good morning, Admin 👋"

Show summary cards:

Active Batch

24

Pending Payment Verification

8

Tracking in Progress

31

Outstanding Tax

Rp 4.250.000

Then:

Batch Activity

A chart showing active batches by country:

CH
KR
TH
JP
INA

Use soft color coding.

Then:

Payment Verification

Show:

Pending

Approved today

Rejected today

Then:

Recent Activity

Examples:

"Payment CH-025 uploaded by buyer"

"Batch JP-014 updated"

"Tracking CH-022 changed to OTW Indonesia"

"Tax invoice created"

7. BATCH & CALCULATION ENGINE

This is one of the most important modules.

Create:

Batch List

Columns:

Batch

Country

Date

Warehouse

Buyer count

Total PC

Status

Action

Filters:

Country

Status

Date

Warehouse

Status:

Open

Closed

Archived

Provide:

Create Batch

button.

8. CREATE BATCH

Create a structured form.

First:

Select Country

Options:

CH — Yuan

KR — Won

TH — Baht

JP — Yen

INA — Rupiah

The form should dynamically change based on country.

Do NOT implement actual formulas yet.

Show the appropriate fields as mock inputs.

For CH / TH / KR include concepts such as:

Batch number

Date

Proxy CO

Warehouse

Item

Buyer

Original price

Shipping

Quantity

Overall fees

Nyelem fee

Admin Nyelem

For JP:

Batch number

Date

Proxy CO

Warehouse

Item

Buyer

Yen price

Shipping

Fees

Nyelem fee

Admin Nyelem

Harga jual per buyer

For INA:

Batch number

Date

Seller

Buyer

Item

Rupiah price

Shopee CO price

GO fee

9. CALCULATION RESULT

Create a result section showing:

Buyer-facing values

Harga per Buyer

Harga Total

Harga TF Seller

Selisih Harga

Internal/admin-only values should be visually separated.

Example:

Internal Calculation

Tagihan PC

Tagihan freebies

Harga CO Shopee

Harga tagihan WH

Pemasukan tax

Selisih tax

Laba kotor

Laba bersih

Use a collapsible section:

"Show Internal Calculation"

This makes the UI easier to scan.

10. PAYMENT VERIFICATION

Create a dedicated verification dashboard.

Show:

Pending Verification

Cards/table with:

Buyer

Batch

Amount

Payment method

Uploaded date

Proof

Status

Admin can:

View Proof

Then:

Approve
Reject

Reject should open a modal asking for a reason.

Create filters:

Pending

Approved

Rejected

Country

Batch

Payment method

Date

11. TRACKING MANAGEMENT

Admin tracking is editable.

Create:

Tracking Dashboard

Filters:

Country

Warehouse

Status

Batch

Table columns:

Batch

Buyer

Item

Warehouse

Resi

Status

CO checklist

Last updated

Action

Status flow:

Seller

Arrive Warehouse

OTW Indonesia

Arrive Indonesia

Arrive Admin

Done

Cancel

Create clear status badges.

Use:

blue → warehouse
yellow → OTW
orange → Indonesia
green → admin/done

Admin can edit status.

Admin can edit:

warehouse

resi

notes

Include an archive action for completed tracking records.

12. TAX MANAGEMENT

Create a tax management interface.

The final business logic is periodic and multi-batch.

Do NOT invent the calculation formula.

UI should include:

Tax Period

Example:

September 2026

Then show:

Buyer

Batch

Country

Total PC

Non-PC

Tax

Deadline

Payment status

Allow:

View detail

Generate invoice

Mark/review status

Create a detailed tax breakdown drawer/modal.

13. PO ALBUM / CO WEB

Create a dedicated module for album purchase / web checkout tracking.

Sections:

Album Order

Show:

Batch

Buyer

Item

Quantity

DP

FP

Payment status

CO status

CO Status

Possible states:

Not Started

CO Open

CO Completed

Order Submitted

Completed

Keep this module visually consistent with Batch Management.

14. CASHFLOW / FLOW DUIT

Create a manual cashflow module.

Dashboard cards:

Total Balance

Income

Expense

Allow filtering by:

period

transaction type

category

Transaction table:

Date

Description

Type

Category

Amount

Payment method

Balance

Notes

Create:

Add Transaction

button.

Transaction types:

Income

Expense

Payment methods may include:

BCA

QRIS

SeaBank

ShopeePay

This module is admin-only.

15. FINANCIAL REPORTS

Create a Reports section with tabs.

Tab 1 — Laba GO

Filters:

Period

Country

Batch

Show:

Revenue

Cost

Gross Profit

Tax

Net Profit

Provide chart + summary cards.

Tab 2 — Gaji Admin

Filters:

Admin

Period

Show:

Admin

Number of transactions

Nyelem fee

Rekap fee

Total fee

Tab 3 — Rekap Pembayaran

Show:

Payment method

Number of payments

Total amount

Period

Include:

Export XLSX

and

Export PDF

buttons.

For prototype these can be non-functional.

16. SETTINGS

Create a structured Settings page.

Sections:

Fee Nyelem

Configure default fee per PC.

Rate Harian

Configure currency rates:

Yuan

Won

Baht

Yen

Fee Rekap

Tiered fee table.

Penalty Rules

amount per day

batch deadline

tax deadline

Tax Rate

PC tax rate per country

Non-PC tax rate by weight

Maximum Storage Duration

Maximum number of days before accumulated goods are considered overdue.

Use forms with Save buttons.

17. ROLES & PERMISSIONS

Create an admin permission management page.

Display:

Staff Accounts

Columns:

Name

Email

Role

Status

Last active

Actions

Allow:

Add staff

Disable account

Edit permissions

Create permission matrix:

| Module | View | Create | Edit | Delete |

Modules:

Batch

Calculation

Payment Verification

Tracking

Tax

PO/CO

Cashflow

Reports

Settings

Use toggles or checkboxes.

This is a prototype only.

18. SEARCH & FILTER UX

Admin users will work with many records.

Every major list should support:

search

filters

sorting

pagination

But avoid overwhelming the screen.

Use a compact filter bar.

On mobile, filters should collapse into:

Filter

drawer/modal.

19. TABLE DESIGN

Tables should be clean and modern.

Header:

#F5F5F5

Rows:

white

Hover:

very subtle blue tint

Borders:

light gray

Avoid excessive vertical grid lines.

For mobile, convert tables into cards or horizontally scroll only when absolutely necessary.

Never make the entire mobile page horizontally scroll.

20. STATUS BADGES

Create reusable badges.

Examples:

Open
Closed
Archived
Pending
Approved
Rejected
Arrive WH
OTW INA
Arrive INA
Arrive Admin
Done
Cancel

Use soft pastel backgrounds.

Avoid neon colors.

21. COMPONENT SYSTEM

Create reusable components:

Sidebar

Header

DashboardCard

DataTable

FilterBar

SearchInput

StatusBadge

CountryBadge

Modal

Drawer

ConfirmDialog

EmptyState

Pagination

FormSection

CurrencyInput

DateInput

SelectInput

PermissionMatrix

Timeline

ChartCard

Make the components reusable across all admin modules.

22. ADMIN VS BUYER BOUNDARY

This is extremely important.

Admin sees operational/internal information.

Buyer does NOT.

Admin-only information includes:

internal cost

warehouse bill

proxy cost

GO fee internals

gross profit

net profit

admin salaries

internal tax calculations

internal operational notes

internal financial cashflow

Buyer only receives the fields explicitly intended for buyer display.

23. SHARED SYSTEM MODEL

The Admin Side and Buyer Side represent the same underlying business.

Example:

ADMIN:

Create Batch
↓
Calculate Price
↓
Release Batch
↓
Verify Payment
↓
Update Tracking
↓
Generate Tax
↓
Complete

BUYER:

See Batch
↓
Place Order
↓
Receive Invoice
↓
Upload Payment
↓
See Verification Status
↓
See Tracking
↓
Pay Tax
↓
View History

Both interfaces should use the same terminology.

24. INTEGRATION ARCHITECTURE

Final intended stack:

Frontend:
Next.js + TypeScript + Tailwind CSS

Backend:
PocketBase

Database:
Shared PocketBase instance

Authentication:
Google OAuth for buyers

Admin authentication:
Role-based authentication/permissions

State:
React Query / TanStack Query

Buyer:
PWA + Web Push + Email notifications

Hosting:
Vercel for frontend

PocketBase:
Hosted separately

For this prototype:
USE MOCK DATA.

Do not connect a real backend yet.

25. RESPONSIVE REQUIREMENT

Desktop:

persistent sidebar

top header

data-heavy tables

charts

multi-column layouts

Tablet:

collapsible sidebar

responsive cards

simplified tables

Mobile:

bottom navigation or compact navigation

cards instead of large tables

filter drawer

stacked forms

large tap targets

Minimum supported width:

375px.

26. UX PRINCIPLE

The admin should always be able to answer:

What needs my attention?

Which payments need verification?

Which batches are active?

Where are the current shipments?

What tax needs processing?

How much money came in/out?

How much profit was generated?

How much do admins need to be paid?

What settings/rates are currently active?

The admin UI can be information-dense, but it must remain organized.

27. IMPORTANT PROTOTYPE CONSTRAINT

This is a UI/UX prototype first.

Use realistic mock data.

Do NOT implement actual calculation formulas yet.

Do NOT invent formulas for CH/KR/TH/JP/INA.

Do NOT implement production payment processing.

Do NOT connect real PocketBase yet.

Do NOT expose secrets.

Focus on:

information architecture

responsive UI

navigation

component system

realistic admin workflows

role-aware visibility

shared terminology with Buyer Side

visual consistency

Create a polished prototype that can later be connected to the real PocketBase backend without redesigning the entire UI.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d956a9c4-776c-4d34-8327-3c5d93ee0254).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
