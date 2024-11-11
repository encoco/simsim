import React, { useState, useEffect } from 'react';
import { FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Sidebar from '../components/SideBar/SideBar';

// 더미 데이터는 그대로 유지
const dummyPopularUsers = [
    { id: 1, name: "User 1", image: "https://via.placeholder.com/150", bio: "Bio for User 1", likes: 100 },
    { id: 2, name: "User 2", image: "https://via.placeholder.com/150", bio: "Bio for User 2", likes: 200 },
    { id: 3, name: "User 3", image: "https://via.placeholder.com/150", bio: "Bio for User 3", likes: 150 },
    { id: 4, name: "User 4", image: "https://via.placeholder.com/150", bio: "Bio for User 4", likes: 300 },
    { id: 5, name: "User 5", image: "https://via.placeholder.com/150", bio: "Bio for User 5", likes: 250 },
    { id: 6, name: "User 6", image: "https://via.placeholder.com/150", bio: "Bio for User 6", likes: 180 },
];

const dummyUser = {
    name: "John Doe",
    image: "https://via.placeholder.com/150",
    balance: 1000
};

const Main = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [popularUsers] = useState(dummyPopularUsers);
    const [visibleCards, setVisibleCards] = useState(6);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setVisibleCards(6);
            } else if (window.innerWidth >= 1024) {
                setVisibleCards(5);
            } else if (window.innerWidth >= 768) {
                setVisibleCards(4);
            } else if (window.innerWidth >= 640) {
                setVisibleCards(3);
            } else {
                setVisibleCards(2); // 최소 2개의 카드 표시
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // 초기 로드 시 실행

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePreviousClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + popularUsers.length) % popularUsers.length);
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % popularUsers.length);
    };

    const getVisibleUsers = () => {
        const visibleUsers = [];
        for (let i = 0; i < Math.max(visibleCards, 2); i++) {
            const index = (currentIndex + i) % popularUsers.length;
            visibleUsers.push(popularUsers[index]);
        }
        return visibleUsers;
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
            <Sidebar user={dummyUser} />

            <main className="flex-1 p-4 lg:p-8 transition-all duration-300 lg:ml-64 md:ml-56 sm:ml-20">
                <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
                    {popularUsers && popularUsers.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {getVisibleUsers().map((user) => (
                                <div key={user.id} className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
                                    <div className="aspect-w-1 aspect-h-1 w-full">
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-sm font-medium truncate">{user.name}</h3>
                                        <p className="text-xs text-gray-600 mb-2 h-8 overflow-hidden">{user.bio}</p>
                                        <div className="flex items-center text-xs">
                                            <FaHeart className="text-red-500 mr-1" />
                                            <span>{user.likes}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No popular users available.</p>
                    )}
                </div>

                {popularUsers && popularUsers.length > 0 && (
                    <div className="flex justify-between mt-4">
                        <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 transition-colors duration-200"
                            onClick={handlePreviousClick}
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 transition-colors duration-200"
                            onClick={handleNextClick}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Main;