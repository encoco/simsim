// Style/RandomChatStyle.js
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

export const MainContent = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: '#f5f5f5',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
}));

export const ChatContainer = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
}));

// MessageBubble 컴포넌트 수정
export const MessageBubble = styled('div', {
    shouldForwardProp: (prop) => prop !== 'isUser', // isUser prop이 DOM으로 전달되는 것을 방지
})(({ theme, isUser }) => ({
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    maxWidth: '70%',
    padding: theme.spacing(1, 2),
    backgroundColor: isUser ? theme.palette.primary.main : 'white',
    color: isUser ? 'white' : 'black',
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[1],
    wordBreak: 'break-word',
    '& .MuiTypography-root': {
        color: 'inherit'
    }
}));

export const InputContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: 'white',
    borderTop: `1px solid ${theme.palette.divider}`
}));

export const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(1),
    minWidth: '120px'
}));