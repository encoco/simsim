import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SideBar from "../components/SideBar/SideBar";
import { MainContent, ChatContainer, MessageBubble, InputContainer, StyledButton } from '../Style/RandomChatStyle';

const RandomChat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isMatching, setIsMatching] = useState(false);
    const [isMatched, setIsMatched] = useState(false);

    // 더미 메시지 데이터
    const dummyMessages = [
        { text: "안녕하세요! 랜덤채팅에 오신 것을 환영합니다.", isUser: false },
        { text: "네, 안녕하세요! 반갑습니다.", isUser: true },
        { text: "오늘 날씨가 정말 좋네요.", isUser: false },
        { text: "그러게요. 산책하기 좋은 날씨예요.", isUser: true },
    ];

    useEffect(() => {
        setMessages(dummyMessages);
    }, []);

    const handleSendMessage = () => {
        if (inputMessage.trim() !== '' && isMatched) {
            setMessages([...messages, { text: inputMessage, isUser: true }]);
            setInputMessage('');
        }
    };

    const handleRandomMatch = () => {
        setIsMatching(true);
        setIsMatched(false);
        setMessages([]);  // 기존 메시지 초기화

        // 매칭 프로세스를 시뮬레이션 (실제로는 서버와의 통신이 필요)
        setTimeout(() => {
            setIsMatching(false);
            setIsMatched(true);
            setMessages([{ text: "새로운 대화 상대와 연결되었습니다!", isUser: false }]);
        }, 3000);  // 3초 후 매칭 완료
    };

    // 더미 유저 데이터
    const dummyUser = {
        name: "John Doe",
        image: "https://via.placeholder.com/150",
        balance: 1000
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <SideBar user={dummyUser} logout={() => console.log('로그아웃')} />
            <MainContent>
                <StyledButton
                    variant="contained"
                    startIcon={isMatching ? <CircularProgress size={20} color="inherit" /> : <ShuffleIcon />}
                    onClick={handleRandomMatch}
                    disabled={isMatching}
                    sx={{ mb: 2, alignSelf: 'center' }}
                >
                    {isMatching ? '매칭 중...' : '랜덤 매칭 시작'}
                </StyledButton>
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