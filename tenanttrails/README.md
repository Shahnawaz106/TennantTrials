# TenantTrails — CSCI 4177/5709 Lab 3

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Run Tests

```bash
npm run test
```

## Demo Login
- Email: alex@dal.ca
- Password: password123

## Project Structure

```
src/
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx         ← exports validate() for testing
│   ├── Signup.jsx
│   ├── Dashboard.jsx     ← clickable cards, useEffect, conditional rendering
│   ├── ApartmentDetail.jsx  ← useParams, reviews, modal
│   └── Profile.jsx       ← user reviews, edit, delete
├── components/
│   ├── ProtectedRoute.jsx
│   ├── StarRating.jsx    ← pure display component
│   ├── ReviewCard.jsx    ← single review with edit/delete
│   ├── AISummary.jsx     ← AI summary box
│   └── ReviewDialog.jsx  ← modal for write/edit review
├── context/
│   └── AuthContext.jsx
├── data/
│   └── mockData.js
├── __tests__/
│   ├── setup.js
│   ├── validate.test.js   ← unit tests for login validation
│   └── ReviewCard.test.jsx ← component tests
├── App.jsx
├── main.jsx
└── index.css
```
