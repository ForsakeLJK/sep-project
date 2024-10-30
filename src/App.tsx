import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './AuthContext';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;