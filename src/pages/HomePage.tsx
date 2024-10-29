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
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import ContentCS from '../components/ContentCS';
import ContentRev from '../components/ContentRev';
import ContentFM from '../components/ContentFM';
import ContentPM from '../components/ContentPM';
import ContentSub from '../components/ContentSub';
import ContentBudgetPM from '../components/ContentBudgetPM';
import ContentBudgetFM from '../components/ContentBudgetFM';
import ContentResourcePM from '../components/ContentResourcePM';
import ContentResourceHR from '../components/ContentResourceHR';

const drawerWidth = 240;

const HomePage: React.FC = () => {

    const [btnHit, setBtnHit] = useState<string | null>(null);

    const { userRole, logname } = useAuth();

    const renderContent = () => {
        if (!btnHit) {
            return (
                <div>
                    <Typography><h1>Hello {logname}!</h1></Typography>
                    <Typography><h3>you can use the menu on the left-side for further information</h3></Typography>
                </div>
            );
        }

        switch (userRole) {
            case 'CS':
                return <ContentCS btn_type={btnHit} user_name={logname} />;
            case 'AM':
            case 'SCS':
                return <ContentRev btn_type={btnHit} user_name={logname} />;
            case 'PM':
            case 'SM':
                if (btnHit === 'applications') {
                    return <ContentPM btn_type={btnHit} user_name={logname} />;
                } else if (btnHit == 'budget requests') {
                    return <ContentBudgetPM btn_type={btnHit} user_name={logname} />;
                } else if (btnHit == 'resource requests') {
                    return <ContentResourcePM btn_type={btnHit} user_name={logname} />;
                }
                return;
            case 'FM':
                if (btnHit === 'applications') {
                    return <ContentFM btn_type={btnHit} user_name={logname} />;
                } else if (btnHit === 'budget requests') {
                    return <ContentBudgetFM btn_type={btnHit} user_name={logname} />;
                }
                return;
            case 'HR':
                return <ContentResourceHR btn_type={btnHit} user_name={logname} />;
            case 'Sub':
                return <ContentSub btn_type={btnHit} user_name={logname} />;
        }
    };

    const handleButtonClick = async (btn_type: string) => {
        switch (userRole) {
            case 'CS':
            case 'AM':
            case 'SCS':
            case 'PM':
            case 'SM':
            case 'FM':
            case 'HR':
            case 'Sub':
                setBtnHit(btn_type);
                return;
        }
    };

    const renderButtons = () => {
        switch (userRole) {
            case 'CS':
                return (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleButtonClick('applications')}>
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
                            <ListItemButton onClick={() => handleButtonClick('applications')}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='applications' />
                            </ListItemButton>
                        </ListItem>
                    </List>
                );
            case 'PM':
            case 'SM':
                return (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleButtonClick('applications')}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='applications' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleButtonClick('resource requests')}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='resource requests' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleButtonClick('budget requests')}>
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
                            <ListItemButton onClick={() => handleButtonClick('applications')}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='applications' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleButtonClick('budget requests')}>
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
                            <ListItemButton onClick={() => handleButtonClick('resource requests')}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='resource requests' />
                            </ListItemButton>
                        </ListItem>
                    </List>
                );
            case 'Sub':
                return (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleButtonClick('tasks')}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary='tasks' />
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