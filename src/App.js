import './App.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FrontPage from './pages/frontPage';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import ProjectPage from './pages/projectPage';
import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detect login state on load and on every change
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div></div>; // or a spinner
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route 
          path="/login" 
          element={session ? <Navigate to="/home" /> : <LoginPage />} 
        />

        <Route 
          path="/home" 
          element={session ? <HomePage /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/project/:id" 
          element={session ? <ProjectPage /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
