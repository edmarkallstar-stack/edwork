# EDWORK – EDMARK HRIS

Global HRIS for EDMARK (32 countries): recruitment, employee self-service, HR operations, payroll, approvals, and country-specific policy management.

## Stack

- **Frontend**: React 18, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Functions)

## Setup

1. **Clone and install**
   ```bash
   cd "EDMARK HRIS"
   npm install
   ```

2. **Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com).
   - Enable Authentication (Email/Password), Firestore, and Storage.
   - Copy `.env.example` to `.env` and set the Firebase config values.

3. **Run**
   ```bash
   npm run dev
   ```

4. **GitHub**
   - Create a new repository (e.g. `edwork` or `edwork-hris`).
   - `git init`, add all files, commit, add `origin`, push. Do not commit `.env`.

## Project structure

- `src/config` – Firebase and app config
- `src/contexts` – Auth and theme
- `src/features` – Auth, dashboard, (future: staff, recruitment, employees, etc.)
- `src/components` – Shared UI and AppShell
- `src/routes` – Route guards
- `src/types` – Shared TypeScript types
- `src/styles` – Global CSS and Tailwind

## Design

UI uses only EDMARK logo colours: dark blue, red, yellow, green, light blue; neutrals for backgrounds and borders. Mobile-responsive.
