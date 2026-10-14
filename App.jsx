import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import WarehouseInventory from './Inventarizaciya'
import './App.css'
import Dashboard from './Dashboard'
import InventoryManagement from './InventoryManagement'
import Login from './Login'

function ProtectedRoute({ isAuthenticated, children }) {
  // Если пользователь не авторизован, принудительно перенаправляем на /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  // Состояние авторизации (в реальном проекте здесь будет проверка токена или контекст)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Функция для выхода из системы
  const handleLogout = () => {
    setIsAuthenticated(false);
  };


  return (
    <>
      <Router>
      <div className="app-container">
        
        {/* Отображаем навигационную панель только если пользователь вошел в систему */}
        {isAuthenticated && (
          <nav className="navigation-panel">
            <Link to="/dashboard">Главная панель</Link>
            <Link to="/inventory">Управление запасами</Link>
            <Link to="/warehouse">Инвентаризация склада</Link>
            <button onClick={handleLogout} className="logout-btn">Выйти</button>
          </nav>
        )}

        {/* Контент страниц */}
        <main className="content-area">
          <Routes>
            {/* Страница логина */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
              } 
            />

            {/* Защищенные маршруты */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <InventoryManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/warehouse" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <WarehouseInventory />
                </ProtectedRoute>
              } 
            />

            {/* Автоматическое перенаправление со всех неизвестных страниц и корня (/) */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </main>

      </div>
    </Router>
    </>
  )
}
