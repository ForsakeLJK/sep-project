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
import ContentCS from '../components/ContentCS';

interface Content {
    data?: Record<string, any>;
    error?: string;
}

const drawerWidth = 240;

const HomePage: React.FC = () => {

    const [content, setContent] = useState<Content | null>(null);

    const { userRole, logname } = useAuth();

    const renderContent = () => {
        if (content?.error) {
            return <Typography>{content.error}</Typography>;
        }

        if (!content) {
            return (
                <div>
                    <Typography><h1>Hello {logname}!</h1></Typography>
                    <Typography><h3>you can use the menu on the left-side for further information</h3></Typography>
                </div>
            );
        }

        switch (userRole) {
            case 'CS':
                return <ContentCS data={content.data} />;
            default:
                return null;
        }
    };

    const handleButtonClick = async () => {
        switch (userRole) {
            case 'CS':
                setContent({ data: { title: 'test_title', description: 'test_desc' } });
                return;
            case 'AM':
            case 'SCS':
            case 'PM':
            case 'FM':
            case 'HR':
                return;
        }
        // try {
        //     const data = await fetchData(endpoint);
        //     setContent({ data: data, contentType: contentType });
        // } catch (error) {
        //     setContent({ error: 'Error fetching data' });
        // }
    };

    const renderButtons = () => {
        switch (userRole) {
            case 'CS':
                return (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleButtonClick()}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='applications' />
                            </ListItemButton>
                        </ListItem>
                    </List>
                );
            case 'AM':
            case 'SCS':
                return (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='applications' />
                            </ListItemButton>
                        </ListItem>
                    </List>
                );
            case 'PM':
                return (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='applications' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='resource requests' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='budget requests' />
                            </ListItemButton>
                        </ListItem>
                    </List>
                );
            case 'FM':
                return (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='applications' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='budget requests' />
                            </ListItemButton>
                        </ListItem>
                    </List>
                );
            case 'HR':
                return (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='resource requests' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='job posts' />
                            </ListItemButton>
                        </ListItem>
                    </List>
                );
            default:
                return <Typography>No access</Typography>;
        }
    };

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
                {renderContent()}
            </Box>
        </Box>
    );
};

export default HomePage;