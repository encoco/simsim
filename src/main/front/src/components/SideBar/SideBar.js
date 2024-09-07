import React from 'react';
import { Link } from 'react-router-dom';
import { FaCoins, FaHome, FaCommentAlt, FaList, FaUserCog, FaCreditCard, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ user, logout }) => {
    return (
        <div className="fixed top-0 left-0 h-full bg-gray-900 text-white p-6 flex flex-col justify-between w-64 transition-all duration-300 ease-in-out transform lg:translate-x-0 -translate-x-full lg:w-64 md:w-56 sm:w-20 z-50">
            {/* 프로필 섹션 */}
            <div className="flex flex-col items-center space-y-3">
                <img
                    src={user.image || 'defaultIMG.png'}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-gray-700 transition-all duration-300"
                />
                <h2 className="text-xl font-semibold sm:hidden lg:block">{user.name}</h2>
                <div className="flex items-center text-lg font-medium sm:hidden lg:flex">
                    <FaCoins className="mr-2 text-yellow-500" />
                    <span>{user.balance}</span>
                </div>
            </div>

            {/* 네비게이션 링크 */}
            <nav className="flex-grow my-8">
                <NavLink to="/" icon={<FaHome />} label="홈으로" />
                <NavLink to="/randomChat" icon={<FaCommentAlt />} label="채팅 시작" />
                <NavLink to="/chat-history" icon={<FaList />} label="채팅 목록" />
                <NavLink to="/setting" icon={<FaUserCog />} label="설정" />
                <NavLink to="/purchase" icon={<FaCreditCard />} label="충전" />
            </nav>

            {/* 로그아웃 버튼 */}
            <button
                onClick={logout}
                className="flex items-center justify-center w-full p-2 text-lg font-medium hover:bg-gray-800 rounded transition-colors duration-200"
            >
                <FaSignOutAlt className="mr-2" />
                <span className="sm:hidden lg:inline">로그아웃</span>
            </button>
        </div>
    );
};

const NavLink = ({ to, icon, label }) => (
    <Link
        to={to}
        className="flex items-center mb-6 p-2 text-lg font-medium hover:bg-gray-800 rounded transition-colors duration-200"
    >
        {icon}
        <span className="ml-2 sm:hidden lg:inline">{label}</span>
    </Link>
);

export default Sidebar;