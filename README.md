# TenantTrails — CSCI 4177/5709 Lab 2

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Demo Login
- Email: alex@dal.ca
- Password: password123

## Project Structure

```
src/
├── pages/           ← full-screen views
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Dashboard.jsx
├── components/      ← reusable UI
│   └── ProtectedRoute.jsx
├── context/         ← shared state
│   └── AuthContext.jsx
├── data/            ← mock data
│   └── mockData.js
├── App.jsx
├── main.jsx
└── index.css
```
