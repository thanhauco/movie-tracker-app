# System Architecture

This document outlines the technical architecture of the Movie Tracker application.

## 🏗️ High-Level Architecture

The application follows a modern decoupled architecture with a React frontend and a Supabase (PostgreSQL + Edge Functions) backend.

```mermaid
graph TD
    subgraph "Frontend (React + Vite)"
        UI[UI Components / Tailwind]
        Hooks[Custom Hooks / React Query]
        Context[Auth Context]
        Services[API Service Layer]
    end

    subgraph "Backend (Supabase)"
        DB[(PostgreSQL)]
        Auth[Supabase Auth]
        Edge[Edge Functions / Deno]
        Storage[Supabase Storage]
        Realtime[Realtime Engine / Presence]
    end

    subgraph "External APIs"
        TMDB[TMDB API]
    end

    UI --> Hooks
    Hooks --> Services
    Context --> Auth
    Services --> Edge
    Services --> DB
    Edge --> TMDB
    Edge --> DB
    Realtime --> UI
    Storage --> UI
```

---

## 💻 Frontend Architecture

The frontend is built with **React**, **TypeScript**, and **Vite**, focusing on a modular and type-safe structure.

### Component Hierarchy & Data Flow

```mermaid
flowchart TB
    App[App.tsx / Router]
    Layout[Layout / Header / Footer]
    Pages[Pages / Discover / Profile / Watchlists / Activity]
    Components[UI Components / MovieCard / WatchlistCard / StarRating]
    Hooks[Hooks / useMovies / useWatchlists / useSocial]
    Services[Services / movieService / watchlistService / socialService]
    Query[React Query / Cache / Optimistic UI]

    App --> Layout
    Layout --> Pages
    Pages --> Components
    Pages --> Hooks
    Hooks --> Query
    Query --> Services
```

### Key Technologies:
- **State Management**: React Query (Server State), Context API (Auth/UI State).
- **Optimistic UI**: Implemented for ratings, status updates, and reordering.
- **Drag & Drop**: `@dnd-kit` for watchlist reordering.
- **Real-time**: Supabase Realtime for activity feed and Presence for "Watching Now".
- **Styling**: Tailwind CSS with glassmorphism and custom dark theme.

---

## 🗄️ Backend Architecture

The backend leverages **Supabase** for a serverless, scalable infrastructure.

### Database Schema (Core)

```mermaid
erDiagram
    profiles ||--o{ watchlists : owns
    profiles ||--o{ user_movies : tracks
    profiles ||--o{ activities : performs
    profiles ||--o{ follows : "follower/following"
    movies ||--o{ watchlist_items : contains
    movies ||--o{ user_movies : rated_by
    watchlists ||--o{ watchlist_items : contains

    profiles {
        uuid id PK
        string username
        string avatar_url
    }
    movies {
        uuid id PK
        int tmdb_id
        string title
        string poster_url
    }
    watchlists {
        uuid id PK
        uuid user_id FK
        string name
        boolean is_public
    }
    user_movies {
        uuid id PK
        uuid user_id FK
        uuid movie_id FK
        enum status
        float rating
    }
    follows {
        uuid id PK
        uuid follower_id FK
        uuid following_id FK
    }
```

### Serverless Logic (Edge Functions)
- **`sync-movie`**: Orchestrates data between TMDB and our PostgreSQL cache.
- **`search-movies`**: Proxy to TMDB for search results.
- **`discover-movies`**: Advanced filtering and sorting via TMDB.
- **`ai-assistant`**: LLM-powered cinematic assistant for user queries.
- **`ai-recommendations`**: Personalized movie suggestions based on user history.
- **`gamification`**: Logic for XP calculation and achievement unlocking.
- **`collaboration`**: Real-time synchronization for shared watchlists.

### Security (RLS)
All data access is governed by **Row Level Security (RLS)** policies. Social features utilize policies that allow users to see public profiles and activity while protecting private data.
