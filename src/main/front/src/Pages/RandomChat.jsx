import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SideBar from "../components/SideBar/SideBar";
import { MainContent, ChatContainer, MessageBubble, InputContainer, StyledButton } from '../Style/RandomChatStyle';
import webSocketService from "../Service/WebSocketService";
import api from '../api';

const RandomChat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isMatching, setIsMatching] = useState(false);
    const [isMatched, setIsMatched] = useState(false);
    const [partnerId, setPartnerId] = useState(null);
    const stompClient = useRef(null);
    const userId = useRef(localStorage.getItem('userId') || `user-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        localStorage.setItem('userId', userId.current);

        const setupWebSocket = async () => {
            try {
                await webSocketService.connect();
                console.log('WebSocket connection established');

                // 매칭 상태 구독
                webSocketService.subscribe(`/sub/chat/match/${userId.current}`, (message) => {
                    console.log("Received match message:", message);
                    let parsedMessage;

                    try {
                        // 메시지 파싱 (JSON 형식 처리)
                        if (typeof message.body === 'string') {
                            parsedMessage = JSON.parse(message.body);
                        } else if (typeof message === 'string') {
                            parsedMessage = JSON.parse(message);
                        } else {
                            parsedMessage = message;
                        }

                        const status = parsedMessage.message;
                        const roomId = parsedMessage.roomId;

                        // 매칭 성공 처리
                        if (status && status.includes('매칭되었습니다')) {
                            console.log('매칭 성공');
                            const matchedUserId = status.split('님')[0];
                            setPartnerId(matchedUserId);
                            setIsMatched(true);
                            setIsMatching(false);

                            setMessages(prev => [
                                ...prev,
                                { text: status, isUser: false }
                            ]);
                        }
                        // 매칭 대기 중 처리
                        else if (status === '매칭 대기 중') {
                            console.log('매칭 대기 중');
                            setIsMatching(true);
                            setIsMatched(false);
                        }
                        // 상대방이 채팅방을 나갔을 때 처리
                        else if (status === '상대방이 채팅방을 나갔습니다') {
                            setMessages(prev => [
                                ...prev,
                                { text: status, isUser: false }
                            ]);
                            setIsMatched(false);
                            setPartnerId(null);
                            setIsMatching(false);
                        }
                    } catch (error) {
                        console.error('Failed to parse match message:', error);
                    }
                });

                // 메시지 수신 구독
                webSocketService.subscribe(`/sub/chat/room/${userId.current}`, (message) => {
                    console.log("Received chat message:", message);
                    try {
                        let content;
                        // 메시지 내용 파싱
                        if (typeof message === 'string') {
                            content = message;
                        } else if (message.body) {
                            const parsed = JSON.parse(message.body);
                            content = parsed.content;
                        } else if (message.content) {
                            content = message.content;
                        }

                        if (content) {
                            setMessages(prev => [
                                ...prev,
                                { text: content, isUser: false }
                            ]);
                        }
                    } catch (error) {
                        console.error('Failed to process chat message:', error);
                    }
                });

                // 자동 매칭 시작
                setTimeout(() => {
                    handleRandomMatch();
                }, 1000);

            } catch (error) {
                console.error('WebSocket setup failed:', error);
                setMessages(prev => [
                    ...prev,
                    { text: "연결에 실패했습니다. 페이지를 새로고침 해주세요.", isUser: false }
                ]);
            }
        };

        setupWebSocket();

        // 컴포넌트 언마운트 시 WebSocket 연결 해제 및 채팅방 나가기
        return () => {
            if (isMatched) {
                handleLeaveChat();
            }
            webSocketService.disconnect();
        };
    }, []);


    // handleSendMessage 함수
    const handleSendMessage = () => {
        if (!inputMessage.trim() || !isMatched) return;

        const messageData = {
            sender: userId.current,
            content: inputMessage.trim()
        };

        webSocketService.send('/pub/api/chat/message', {}, messageData);
        console.log("Sent message:", messageData);

        setMessages(prev => [...prev, {
            text: inputMessage,
            isUser: true
        }]);

        setInputMessage('');
    };

    // handleLeaveChat 함수
    const handleLeaveChat = () => {
        try {
            webSocketService.send('/pub/api/chat/leave', {}, userId.current);
            console.log("Sent leave request for user:", userId.current);

            setIsMatched(false);
            setPartnerId(null);
            setMessages(prev => [...prev, {
                text: "채팅방을 나갔습니다.",
                isUser: false
            }]);

        } catch (err) {
            console.error('채팅방 나가기 실패:', err);
            setMessages(prev => [...prev, {
                text: "채팅방 나가기에 실패했습니다. 다시 시도해주세요.",
                isUser: false
            }]);
        }
    };

    // handleRandomMatch 함수
    const handleRandomMatch = async () => {
        try {
            setIsMatching(true);
            setIsMatched(false); // 매칭 시작 시 매칭 상태 초기화
            setMessages([]);

            webSocketService.send('/pub/api/chat/match', {}, userId.current);
            console.log("Sent match request for user:", userId.current);

            setMessages([{
                text: "매칭을 시작합니다...",
                isUser: false
            }]);

        } catch (err) {
            setIsMatching(false);
            setMessages([{
                text: "매칭 시작에 실패했습니다. 다시 시도해주세요.",
                isUser: false
            }]);
            console.error('매칭 시작 실패:', err);
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
                    {!isMatched ? (
                        <StyledButton
                            variant="contained"
                            startIcon={isMatching ? <CircularProgress size={20} color="inherit" /> : <ShuffleIcon />}
                            onClick={handleRandomMatch}
                            disabled={isMatching}
                        >
                            {isMatching ? '매칭 중...' : '랜덤 매칭 시작'}
                        </StyledButton>
                    ) : (
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
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        disabled={!isMatched}
                    />
                    <StyledButton
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!isMatched || !inputMessage.trim()}
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