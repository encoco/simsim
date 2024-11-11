import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SideBar from "../components/SideBar/SideBar";
import { MainContent, ChatContainer, MessageBubble, InputContainer, StyledButton } from '../Style/RandomChatStyle';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const RandomChat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isMatching, setIsMatching] = useState(false);
    const [isMatched, setIsMatched] = useState(false);
    const [partnerId, setPartnerId] = useState(null);
    const stompClient = useRef(null);
    const userId = useRef(localStorage.getItem('userId') || `user-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        // WebSocket 연결 설정
        const socket = new SockJS('/ws');
        stompClient.current = Stomp.over(socket);

        stompClient.current.connect({}, () => {
            // 채팅 메시지 구독
            stompClient.current.subscribe(`/sub/chat/room/${userId.current}`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages(prev => [...prev, {
                    text: receivedMessage.content,
                    isUser: false
                }]);
            });

            // 매칭 상태 구독
            stompClient.current.subscribe(`/sub/chat/match/${userId.current}`, (message) => {
                const status = message.body;
                if (status.includes('매칭되었습니다')) {
                    const matchedUserId = status.split('님')[0];
                    setPartnerId(matchedUserId);
                    setIsMatched(true);
                    setIsMatching(false);
                    setMessages(prev => [...prev, {
                        text: status,
                        isUser: false
                    }]);
                } else if (status === '매칭 대기 중') {
                    setIsMatching(true);
                } else if (status.includes('나갔습니다')) {
                    setIsMatched(false);
                    setPartnerId(null);
                    setMessages(prev => [...prev, {
                        text: status,
                        isUser: false
                    }]);
                }
            });
        });

        return () => {
            if (stompClient.current.connected) {
                stompClient.current.disconnect();
            }
        };
    }, []);

    const handleSendMessage = () => {
        if (inputMessage.trim() !== '' && isMatched) {
            const chatMessage = {
                sender: userId.current,
                content: inputMessage,
                type: 'CHAT'
            };

            stompClient.current.send('/pub/chat/message', {}, JSON.stringify(chatMessage));
            setMessages(prev => [...prev, {
                text: inputMessage,
                isUser: true
            }]);
            setInputMessage('');
        }
    };

    const handleRandomMatch = () => {
        setIsMatching(true);
        setMessages([]);
        stompClient.current.send('/pub/chat/match', {}, userId.current);
    };

    const handleLeaveChat = () => {
        if (isMatched) {
            stompClient.current.send('/pub/chat/leave', {}, userId.current);
            setIsMatched(false);
            setPartnerId(null);
            setMessages([]);
        }
    };

    // 더미 유저 데이터
    const dummyUser = {
        name: userId.current,
        image: "https://via.placeholder.com/150",
        balance: 1000
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <SideBar user={dummyUser} logout={() => console.log('로그아웃')} />
            <MainContent>
                <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
                    <StyledButton
                        variant="contained"
                        startIcon={isMatching ? <CircularProgress size={20} color="inherit" /> : <ShuffleIcon />}
                        onClick={handleRandomMatch}
                        disabled={isMatching || isMatched}
                    >
                        {isMatching ? '매칭 중...' : '랜덤 매칭 시작'}
                    </StyledButton>
                    {isMatched && (
                        <StyledButton
                            variant="outlined"
                            color="error"
                            onClick={handleLeaveChat}
                        >
                            채팅방 나가기
                        </StyledButton>
                    )}
                </Box>
                <ChatContainer>
                    {messages.map((message, index) => (
                        <MessageBubble key={index} isUser={message.isUser}>
                            <Typography variant="body1">{message.text}</Typography>
                        </MessageBubble>
                    ))}
                </ChatContainer>
                <InputContainer>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={isMatched ? "메시지를 입력하세요..." : "매칭 후 채팅이 가능합니다."}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={!isMatched}
                    />
                    <StyledButton
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!isMatched}
                        sx={{
                            minWidth: 'unset',
                            width: '56px',
                            height: '56px',
                            marginLeft: '8px',
                            padding: '0',
                        }}
                    >
                        <SendIcon />
                    </StyledButton>
                </InputContainer>
            </MainContent>
        </Box>
    );
};

export default RandomChat;