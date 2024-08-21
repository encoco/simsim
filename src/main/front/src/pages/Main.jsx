import React, {useState, useEffect} from 'react';
import { FaChevronLeft,  FaChevronRight, FaHeart} from 'react-icons/fa';
import axios from "axios";
import SideBar from "../components/SideBar/SideBar";

const Main = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const popularUsers = [
        {
            id: 1,
            name: 'John Doe',
            image: 'defaultIMG.png',
            bio: 'Hello, I\'m John and I enjoy random chats!',
            likes: 100,
        },
        {
            id: 2,
            name: 'Jane Smith',
            image: 'defaultIMG.png',
            bio: 'Hi, I\'m Jane and I\'m looking for new friends!',
            likes: 80,
        },
        {
            id: 3,
            name: 'Bob Johnson',
            image: 'defaultIMG.png',
            bio: 'Hey, I\'m Bob and I love chatting with new people.',
            likes: 120,
        },
        {
            id: 4,
            name: 'Sarah Lee',
            image: 'defaultIMG.png',
            bio: 'Hello, I\'m Sarah and I\'m excited to meet you!',
            likes: 90,
        },
        {
            id: 5,
            name: 'Michael Brown',
            image: 'defaultIMG.png',
            bio: 'Hi, I\'m Michael and I enjoy random conversations.',
            likes: 110,
        },
        {
            id: 6,
            name: 'Emily Davis',
            image: 'defaultIMG.png',
            bio: 'Hello, I\'m Emily and I\'m looking forward to chatting!',
            likes: 75,
        },
    ];

    const handlePreviousClick = () => {
        setCurrentIndex((currentIndex - 1 + popularUsers.length) % popularUsers.length);
    };

    const handleNextClick = () => {
        setCurrentIndex((currentIndex + 1) % popularUsers.length);
    };
    return (
        <div className="flex h-screen">
            <SideBar />
            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="grid grid-cols-6 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={popularUsers[(currentIndex + index) % popularUsers.length].id}
                                 className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
                                <div className="w-full relative" style={{paddingBottom: '100%'}}>
                                    <img src={popularUsers[(currentIndex + index) % popularUsers.length].image}
                                         alt={popularUsers[(currentIndex + index) % popularUsers.length].name}
                                         className="absolute w-full h-full object-cover"/>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-medium">{popularUsers[(currentIndex + index) % popularUsers.length].name}</h3>
                                    <p className="text-gray-600 mb-2">{popularUsers[(currentIndex + index) % popularUsers.length].bio}</p>
                                    <div className="flex items-center">
                                        <FaHeart className="text-red-500 mr-2"/>
                                        <span>{popularUsers[(currentIndex + index) % popularUsers.length].likes}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between mt-6">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2"
                            onClick={handlePreviousClick}>
                        <FaChevronLeft/>
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2"
                            onClick={handleNextClick}>
                        <FaChevronRight/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Main;