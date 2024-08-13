import React from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

const PrivateRoute = ({ children }) => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? <Navigate to="/index" /> : children; // userInfo가 있으면 메인 페이지로, 없으면 자식 컴포넌트를 리턴
};

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
                <Route path="/index" element={<PrivateRoute></PrivateRoute>} />
            </Routes>
        </div>
    );
}
export default App;
