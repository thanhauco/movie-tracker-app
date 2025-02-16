import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { Header } from '@/components/layout/Header'
import DiscoverPage from '@/pages/discover/DiscoverPage'
import LoginPage from '@/pages/auth/LoginPage'
import SignUpPage from '@/pages/auth/SignUpPage'
import WatchlistsPage from '@/pages/watchlists/WatchlistsPage'
import WatchlistDetailPage from '@/pages/watchlists/WatchlistDetailPage'
import MovieDetailsPage from '@/pages/movies/MovieDetailsPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import ActivityPage from '@/pages/activity/ActivityPage'
import { AIAssistant } from '@/components/ai/AIAssistant'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <Routes>
              <Route path="/" element={<DiscoverPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/watchlists" element={<WatchlistsPage />} />
              <Route path="/watchlists/:id" element={<WatchlistDetailPage />} />
              <Route path="/movies/:id" element={<MovieDetailsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/activity" element={<ActivityPage />} />
              {/* Add more routes as we build them */}
            </Routes>
            <AIAssistant />
          </div>
        </Router>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
