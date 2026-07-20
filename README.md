# Smart Nearby Places Recommender

A full-stack web application that recommends nearby places based on the user's current mood or intent using the Google Places API.

**Live Demo:** https://nearby-app-one.vercel.app/

---

## Overview

Smart Nearby Places Recommender is a learning project focused on API integration, frontend state management, browser geolocation, and backend proxy development.

Users can choose a preference such as **Quick Bite**, **Work Spot**, **Date Night**, or **Budget Friendly**, and the application retrieves nearby places matching that intent. Each result includes useful information such as ratings, distance, and business status.

The application uses an Express backend to securely communicate with the Google Places API, ensuring API keys are never exposed in the frontend.

---

## Features

- Mood-based place recommendations
- Browser geolocation
- Google Places API integration
- Distance calculation
- Ratings and business status
- Sorting and filtering
- Responsive React interface
- Secure backend proxy using Express

---

## Tech Stack

### Frontend

- React (Vite)
- Functional Components
- React Hooks
- Fetch API
- CSS

### Backend

- Node.js
- Express.js
- Axios
- dotenv

### APIs

- Google Places Nearby Search API
- Browser Geolocation API

---

## Project Structure

```text
Nearby-App
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server
│   ├── routes
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Application Flow

1. User selects a mood or preference.
2. The browser requests the user's location.
3. The frontend sends the location and selected mood to the backend.
4. Express calls the Google Places API.
5. The API response is processed and returned to the frontend.
6. Places are displayed with ratings, distance, and business status.

---

## Environment Variables

Create a `.env` file inside the `server` directory.

```env
GOOGLE_PLACES_API_KEY=YOUR_API_KEY
PORT=5000
```

> Keep your API key only on the server.

---

## Installation

Clone the repository

```bash
git clone https://github.com/Mohsinkhan-29/Nearby-App.git
```

Install frontend dependencies

```bash
cd client
npm install
```

Install backend dependencies

```bash
cd ../server
npm install
```

---

## Running the Project

Start the backend

```bash
cd server
npm run dev
```

Start the frontend

```bash
cd client
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## Learning Objectives

This project demonstrates:

- REST API integration
- Secure API handling with Express
- Browser Geolocation API
- React Hooks and state management
- Data filtering and sorting
- Distance calculation
- Component-based architecture
- Environment variable management

---

## Author

**Mohsin Khan**

GitHub: https://github.com/Mohsinkhan-29

LinkedIn: https://www.linkedin.com/in/mohsin-khan29/
