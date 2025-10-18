# Stabilix ERP

A lightweight, client-side Enterprise Resource Planning (ERP) cockpit for showcasing how Stabilix can centralize business operations across sales, inventory, workforce, and analytics modules. The experience is entirely front-end and persists data locally in the browser (when available).

## Features

- **Executive dashboard** with live pipeline, forecast, workforce, and inventory metrics plus task and supply alerts.
- **Sales pipeline management** for logging opportunities, tracking stage probability, and removing stale deals.
- **Inventory control** for capturing stock levels, reorder points, and automatically flagging low inventory items.
- **Workforce directory** to keep departmental headcount current and monitor employee status changes.
- **Business intelligence reports** with weighted revenue forecasts, departmental breakdowns, vendor spend, and a unified task timeline.

## Getting started

1. **Download or clone the repo.** All of the assets you need live in this folder (`index.html`, `styles.css`, and `app.js`).
2. **Open the app in a browser.** Double-click `index.html`, or run a simple static server (for example `npx serve .` or `python -m http.server`) and visit the provided address. Any modern Chromium, Firefox, or Safari browser will work.
3. **Explore the modules.** Use the navigation bar to move between Dashboard, Sales, Inventory, Workforce, and Reporting views. The dashboard shows an overview of seeded sample data so you can understand the layout immediately.
4. **Add or edit records.** Each module includes inline forms for creating, updating, and deleting entries. Changes are written to `localStorage`, so the data you enter persists between page refreshes on the same machine and browser profile.
5. **Reset the workspace (optional).** If you want to return to the original sample data, clear the browser's site data for the page or use your browser's developer tools to wipe the `localStorage` keys prefixed with `stabilix-`.

The project is completely static—no build tooling, package installs, or backend services are required.
