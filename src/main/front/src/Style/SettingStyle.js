import { styled } from '@mui/material/styles';
import { Button, Box, createTheme } from '@mui/material';

export const Input = styled('input')({
    display: 'none',
});

export const MainContent = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 240,
    [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
    },
}));

export const StyledButton = styled(Button)(({ theme, variant }) => ({
    margin: theme.spacing(1),
    padding: theme.spacing(1, 3),
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 'bold',
    ...(variant === 'contained' && {
        color: theme.palette.getContrastText(theme.palette.primary.main),
    }),
    ...(variant === 'outlined' && {
        color: '#1f2937',
        borderColor: '#1f2937',
        '&:hover': {
            borderColor: '#1f2937',
            backgroundColor: 'rgba(31, 41, 55, 0.04)', 
        },
    }),
}));

export const DeleteButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    padding: theme.spacing(1, 3),
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 'bold',
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.error.dark,
    },
}));

// 커스텀 테마 생성
export const theme = createTheme({
    palette: {
        primary: {
            main: '#1f2937', // Tailwind의 bg-gray-900에 해당하는 색상
        },
    },
});