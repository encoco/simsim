import { styled } from '@mui/material/styles';
import { Box, Paper, Button } from '@mui/material';

export const MainContent = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 240,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
    },
}));

export const ChatContainer = styled(Paper)(({ theme }) => ({
    flexGrow: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
}));

export const InputContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

export const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#1f2937', // Tailwind의 bg-gray-900에 해당하는 색상
    color: '#ffffff',
    '&:hover': {
        backgroundColor: '#374151', // Tailwind의 bg-gray-800 (약간 밝은 색상)
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiButton-endIcon': {
        marginLeft: '8px',  // 아이콘과 텍스트 사이의 간격
    },
}));

// MessageBubble 스타일 수정
export const MessageBubble = styled(Box)(({ theme, isUser }) => ({
    maxWidth: '70%',
    padding: theme.spacing(1, 2),
    borderRadius: 20,
    marginBottom: theme.spacing(1),
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? '#1f2937' : theme.palette.grey[300], // 사용자 메시지 색상 변경
    color: isUser ? '#ffffff' : theme.palette.text.primary,
}));

