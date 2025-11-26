import './App.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate} from 'react-router-dom';
import FrontPage from './pages/frontPage';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
