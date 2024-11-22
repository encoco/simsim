import React, { useState } from 'react';
import {
    Container, Typography, Paper, Avatar, TextField, Box, Grid,
    ThemeProvider
} from '@mui/material';
import { PhotoCamera, Save, DeleteForever, Delete } from '@mui/icons-material';
import SideBar from "../components/SideBar/SideBar";
import {Input, MainContent, StyledButton, DeleteButton, theme} from '../Style/SettingStyle';
import api from '../api';


function Settings() {
    const [nickname, setNickname] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState('defaultIMG.png');

    const handleNicknameChange = (e) => setNickname(e.target.value);
    const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const UpdateNickname = async () => {
        if(nickname.length === 0){
            console.log("빈칸 안댕");
            return;
        }
        try {
            const response = await api.get('/api/BGNick', {
                params: {
                    nickname: nickname,
                    platform : 'steam'
                },
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
        console.log(nickname);
    }



    const handleRemoveProfileImage = () => {
        setProfileImage('defaultIMG.png');
    };

    // 더미 유저 데이터
    const dummyUser = {
        id: 1,
        profile_img: profileImage,
        name: '홍길동'
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <SideBar user={dummyUser} />
                <MainContent>
                    <Container maxWidth="sm">
                        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
                            프로필 수정
                        </Typography>

                        {/* 프로필 사진 섹션 */}
                        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>프로필 사진</Typography>
                            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                                <Avatar src={profileImage} sx={{ width: 100, height: 100, mb: 2 }} />
                                <Box>
                                    <label htmlFor="icon-button-file">
                                        <Input accept="image/*" id="icon-button-file" type="file" onChange={handleProfileImageChange} />
                                        <StyledButton variant="contained" component="span" startIcon={<PhotoCamera />}>
                                            사진 변경
                                        </StyledButton>
                                    </label>
                                    <StyledButton
                                        variant="outlined"
                                        onClick={handleRemoveProfileImage}
                                        startIcon={<Delete />}
                                    >
                                        사진 삭제
                                    </StyledButton>
                                </Box>
                            </Box>
                        </Paper>

                        {/* 닉네임 변경 섹션 */}
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
                            <StyledButton
                                variant="contained"
                                onClick={UpdateNickname}
                                startIcon={<Save />}
                            >
                                변경
                            </StyledButton>
                        </Paper>

                        {/* 비밀번호 변경 섹션 */}
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
                                <StyledButton
                                    variant="contained"
                                    onClick={() => console.log('비밀번호 변경')}
                                    startIcon={<Save />}
                                >
                                    비밀번호 변경
                                </StyledButton>
                            </Box>
                        </Paper>

                        {/* 회원 탈퇴 섹션 */}
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>회원 탈퇴</Typography>
                            <Typography color="error" paragraph>
                                주의: 이 작업은 되돌릴 수 없습니다.
                            </Typography>
                            <DeleteButton
                                variant="contained"
                                onClick={() => console.log('회원 탈퇴')}
                                startIcon={<DeleteForever />}
                            >
                                회원 탈퇴
                            </DeleteButton>
                        </Paper>

                    </Container>
                </MainContent>
            </Box>
        </ThemeProvider>
    );
}

export default Settings;