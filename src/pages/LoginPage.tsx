// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Box, Button, TextField, Typography } from '@mui/material';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/home');
        } else {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            <Typography variant="h4" gutterBottom>SEP Login</Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
                <Box mb={2}>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        required
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                    />
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
            {error && <Typography color="error" mt={2}>{error}</Typography>}
        </Box>
    );
};

export default LoginPage;
