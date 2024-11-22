import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import Main from './Pages/Main';
import Setting from './Pages/Settings';
import RandomChat from './Pages/RandomChat';
import LoginAlert from './components/LoginAlert';

const PrivateRoute = ({ children }) => {
    const [showAlert, setShowAlert] = useState(true);  // true로 초기값 설정
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = localStorage.getItem('token');

    if (!userInfo) {
        return (
            <div>
                {showAlert && (
                    <LoginAlert
                        onClose={() => {
                            setShowAlert(false);
                            navigate('/');
                        }}
                        onLogin={() => {
                            setShowAlert(false);
                            navigate('/login', { state: { from: location.pathname } });
                        }}
                    />
                )}
            </div>
        );
    }

    return children;
};

const PublicRoute = ({ children }) => {
    const userInfo = localStorage.getItem('token');
    const location = useLocation();

    if (userInfo) {
        const from = location.state?.from || '/';
        return <Navigate to={from} />;
    }

    return children;
};

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/Login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
                <Route path="/setting" element={<PrivateRoute><Setting /></PrivateRoute>} />
                <Route path="/RandomChat" element={<PrivateRoute><RandomChat /></PrivateRoute>} />
            </Routes>
        </div>
    );
}

export default App;