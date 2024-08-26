import {Link, useNavigate} from "react-router-dom";
import { FaHome, FaCommentAlt, FaList, FaUserCog, FaCreditCard, FaSignOutAlt, FaCoins } from 'react-icons/fa';
import axios from "axios";
import api from '../../api';

const SideBar = () => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const response = api.get("/api/test",{withCredentials:true});
            /*await axios.get('/api/Logout', {
                withCredentials: true
            });

            localStorage.removeItem('token'); // 로컬 스토리지에서 사용자 정보 제거
            navigate('/');*/
        } catch (error) {
            console.error('로그아웃 오류', error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            alert('다시 시도해주세요.');
        }
    };
    const user = {
        name: '홍길동',
        image: 'defaultIMG.png',
        balance: 1250,
    };

    return (
        <div className="bg-gray-900 text-white p-6 flex flex-col justify-between w-64 md:w-48 sm:w-32">
            {/* 프로필 섹션 */}
            <div className="flex flex-col items-center ">
                <img
                    src={user.image}
                    alt="Profile"
                    className="w-40 h-40 rounded-full border-4 border-gray-700 mb-3"
                />
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <div className="flex items-center text-lg font-medium">
                    <FaCoins className="mr-2 text-yellow-500"/>
                    <span>{user.balance} 골드</span>
                </div>
            </div>
            {/* 네비게이션 링크 */}
            <div>
                <Link to="/" className="flex items-center mb-6 text-lg font-medium hover:text-gray-400">
                <FaHome className="mr-2" />
                    홈으로
                </Link>
                <Link to="/start-chat" className="flex items-center mb-6 text-lg font-medium hover:text-gray-400">
                    <FaCommentAlt className="mr-2" />
                    채팅 시작
                </Link>
                <Link to="/chat-history" className="flex items-center mb-6 text-lg font-medium hover:text-gray-400">
                    <FaList className="mr-2" />
                    채팅 목록
                </Link>
                <Link to="/settings" className="flex items-center mb-6 text-lg font-medium hover:text-gray-400">
                    <FaUserCog className="mr-2" />
                    설정
                </Link>
                <Link to="/purchase" className="flex items-center mb-6 text-lg font-medium hover:text-gray-400">
                    <FaCreditCard className="mr-2" />
                    충전
                </Link>
            </div>

            {/* 로그아웃 버튼 */}
            <button onClick={logout} className="flex items-center text-lg font-medium hover:text-gray-400">
                <FaSignOutAlt className="mr-2" />
                로그아웃
            </button>
        </div>
    );
};

export default SideBar;