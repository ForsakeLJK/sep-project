import AdbIcon from '@mui/icons-material/Adb';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { fetchData } from '../apiService';
import { useAuth } from '../AuthContext';

const drawerWidth = 240;


const HomePage: React.FC = () => {

    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { userRole, logname } = useAuth();

    const navigate = useNavigate();

    const renderButtons = () => {
        return (
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary='app' />
                    </ListItemButton>
                </ListItem>
            </List>
        );
    };

    // useEffect(
    //     () => {
    //         const fetchMyData = async () => {
    //             try {
    //                 const response = await fetchData('home');
    //             } catch (error) {
    //                 console.error('Error fetching my data:', error);
    //             }
    //         };

    //         fetchMyData();
    //     }, []
    // )

    if (!userRole) {
        return <Navigate to="/login" />;
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        SEP
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    {renderButtons()}
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography sx={{ marginBottom: 2 }}>
                    <h1>Hello {logname}! </h1>
                </Typography>
                <Typography sx={{ marginBottom: 2 }}>
                    <h3>you can access different functionalities from the menu on the left-side</h3>
                </Typography>
            </Box>
        </Box>
    );
};

export default HomePage;