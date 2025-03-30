# 🎬 Movie Tracker

A premium, full-stack movie tracking application built with **React**, **TypeScript**, and **Supabase**. Discover new movies, manage custom watchlists, and track your cinematic journey with a beautiful, dark-themed interface.

---

## 🏗️ Architecture

The project follows a modern serverless architecture. For a deep dive into the technical design, data flow, and database schema, see:

👉 **[System Architecture Documentation](./ARCHITECTURE.md)**

---

## ✨ Features

- 🔍 **Advanced Discovery**: Filter movies by genre, year, and rating with real-time search.
- 📁 **Watchlists**: Create and manage custom collections with **drag-and-drop reordering**.
- 🤝 **Social Features**: Follow other users, view their profiles, and see a global activity feed.
- 👤 **User Profiles**: Track your stats (total movies, watched count, average rating).
- ⚡ **Real-time Activity**: Live updates for community actions and **Presence** tracking (see who's watching now).
- ⭐ **Rating System**: Precise rating with **half-star support** and optimistic UI updates.
- 📱 **Responsive Design**: Optimized for all screen sizes with a cinematic dark theme and glassmorphism.
- 🔒 **Secure**: Row Level Security (RLS) ensures your data is protected.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS.
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions, Realtime, Storage).
- **Data Fetching**: React Query (TanStack Query) with optimistic updates.
- **Drag & Drop**: @dnd-kit.
- **Icons**: Lucide React.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Account
- TMDB API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd inertial-oort
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 📜 License

MIT
