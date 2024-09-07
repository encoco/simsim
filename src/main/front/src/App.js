import React from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Main from './pages/Main';
import Setting from './pages/Settings';
import RandomChat from './pages/RandomChat';

const PrivateRoute = ({ children }) => {
    const userInfo = localStorage.getItem('token');
    return userInfo ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
    const userInfo = localStorage.getItem('token');
    return userInfo ? <Navigate to="/main" /> : children;
};

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
                <Route path="/main" element={<PrivateRoute><Main /></PrivateRoute>} />
                <Route path="/setting" element={<PrivateRoute><Setting /></PrivateRoute>} />
                <Route path="/RandomChat" element={<PrivateRoute><RandomChat /></PrivateRoute>} />
            </Routes>
        </div>
    );
}
export default App;
