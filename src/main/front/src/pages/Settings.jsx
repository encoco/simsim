import React, { useState } from 'react';
import {
    Container, Typography, Paper, Avatar, Button, TextField,
    Box, Grid, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { PhotoCamera, Save, DeleteForever } from '@mui/icons-material';

const Input = styled('input')({
    display: 'none',
});

function Settings(){
    const [nickname, setNickname] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleNicknameChange = (e) => setNickname(e.target.value);
    const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
                프로필 수정
            </Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>프로필 사진</Typography>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                    <Avatar sx={{ width: 100, height: 100, mb: 2 }}>U</Avatar>
                    <label htmlFor="icon-button-file">
                        <Input accept="image/*" id="icon-button-file" type="file" />
                        <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                            사진 변경
                        </Button>
                    </label>
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>닉네임 변경</Typography>
                <TextField
                    fullWidth
                    label="새 닉네임"
                    variant="outlined"
                    value={nickname}
                    onChange={handleNicknameChange}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    onClick={() => console.log('닉네임 변경:', nickname)}
                    startIcon={<Save />}
                >
                    변경
                </Button>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>비밀번호 변경</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="현재 비밀번호"
                            type="password"
                            variant="outlined"
                            value={currentPassword}
                            onChange={handleCurrentPasswordChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="새 비밀번호"
                            type="password"
                            variant="outlined"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="새 비밀번호 확인"
                            type="password"
                            variant="outlined"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <Button
                        variant="contained"
                        onClick={() => console.log('비밀번호 변경')}
                        startIcon={<Save />}
                    >
                        비밀번호 변경
                    </Button>
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>회원 탈퇴</Typography>
                <Typography color="error" paragraph>
                    주의: 이 작업은 되돌릴 수 없습니다.
                </Typography>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => console.log('회원 탈퇴')}
                    startIcon={<DeleteForever />}
                >
                    회원 탈퇴
                </Button>
            </Paper>
        </Container>
    );
}

export default Settings;